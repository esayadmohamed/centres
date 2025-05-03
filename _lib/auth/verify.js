'use server'
import db from "@/_lib/db";

// const sql = require('better-sqlite3');
// const db = sql('main.db');
// db.pragma('foreign_keys = ON');

import xss from 'xss';
import validator from 'validator';
import bcrypt from "bcryptjs";
import { randomBytes } from 'crypto';
import nodemailer from "nodemailer";

import { RateLimiter } from '@/_lib/utils/ratelimiter';

// --------------------------------------------------------------
// ------------------------------------------ On Main | automatic

function generateVerificationCode() {
    return randomBytes(12).toString('hex');
}

async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        secure: false,
        port: 587,
        tls: {
            rejectUnauthorized: true,
        },
    });

    const verificationLink = `http://localhost:3000/auth/signup/${token}`;

    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: email,
        subject: "Code de Verification - Courdesoutien",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                    <!-- Centre de Soutien Section -->
                    <h2 style="color: #2e86c1; font-weight: bold; margin-bottom: 20px;">Centre de Soutien</h2>

                    <!-- Thank you message -->
                    <p style="font-size: 16px; margin-bottom: 20px;">Merci de vous être inscrit sur Courdesoutien !</p>
                    <p style="font-size: 16px; margin-bottom: 20px;">Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>

                    <!-- Verification Button -->
                    <p>
                        <a href="${verificationLink}" style="display: inline-block; background-color: #2e86c1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                            Vérifier mon e-mail
                        </a>
                    </p>

                    <!-- Expiration notice -->
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">Ce code expirera dans 60 minutes.</p>
                    <p style="font-size: 14px; color: #666;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>

                    <!-- Website Link -->
                    <p style="font-size: 14px; color: #2e86c1; margin-top: 20px;">
                        <a href="https://www.centredesoutien.com" style="color: #2e86c1; text-decoration: none;">
                            www.centredesoutien.com
                        </a>
                    </p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}

export async function VerifyToken(db, user_token){
    try {
        const rate_limiter = await RateLimiter('verify');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        }    

        if(!user_token || typeof user_token !== 'string'){
            return null
        }

        const token = xss(user_token).trim();

        if(!token || token.length !== 24){
            return { error: "Le code de vérification n'est pas valide." };
        }
    
        // const existingToken = db.prepare("SELECT * FROM tokens WHERE token = ?").get(token);
        const [rows] = await db.execute("SELECT * FROM tokens WHERE token = ?", [token]);
        const existingToken = rows[0] || null; 
        
        if (!existingToken) {
            return { error: "Le code de vérification n'est pas valide." };
        } else {
            if (existingToken.expiration_time > Date.now()) {

                // db.prepare("UPDATE users SET active = ? WHERE email = ?")
                // .run('on', existingToken.email);
                await db.execute("UPDATE users SET active = ? WHERE email = ?", ['on', existingToken.email]);

                // db.prepare("DELETE FROM tokens WHERE email = ?").run(existingToken.email);
                await db.execute( "DELETE FROM tokens WHERE email = ?", [existingToken.email]);

                return { success: true};
            } else {
                
                const newToken = generateVerificationCode();
                const newExpirationTime = Date.now() + 3600000;

                // db.prepare("UPDATE tokens SET token = ?, expiration_time = ? WHERE email = ?")
                // .run(newToken, newExpirationTime, existingToken.email);
                await db.execute("UPDATE tokens SET token = ?, expiration_time = ? WHERE email = ?",
                    [newToken, newExpirationTime, existingToken.email] );
                  
                sendVerificationEmail(existingToken.email, newToken) 

                // db.prepare("UPDATE tokens SET send = ?").run(1);
                await db.execute( "UPDATE tokens SET send = ?",[1]);
                  
                return { error: "Le code de vérification a expiré. Nous avons envoyé un autre code à votre e-mail."};
            }
        }
        
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
    }

}

// ----------------------------------------------------------------
// ------------------------------------ On Component | upon request

export async function ResendToken(new_value){
    try{        
        const rate_limiter = await RateLimiter('verify');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        }  

        if(typeof new_value !== 'string'){
            console.warn(`Guest is sending invalid email for verification process`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
        }

        const email = xss(new_value)

        if (!validator.isEmail(email)) {
            return { error: "L'adresse e-mail fournie n'est pas valide." };
        }

        const existingUser = db.prepare("SELECT active FROM users WHERE email = ?").get(email);
        if (!existingUser) {
            return { error: "Aucun compte n'est associé à cette adresse e-mail." };
        } else if(existingUser.active !== 'none'){
            return { error: "L'adresse e-mail est déjà vérifiée." };
        }

        const token = generateVerificationCode();
        const expirationTime = Date.now() + 3600000;

        const existingToken = db.prepare("SELECT * FROM tokens WHERE email = ?").get(email);
        if (!existingToken || existingToken?.expiration_time < Date.now()) {
                  
            db.prepare("DELETE FROM tokens WHERE email = ?").run(email);

            db.prepare("INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)")
            .run(email, token, expirationTime);
            
            await sendVerificationEmail(email, token);

            db.prepare("UPDATE tokens SET send = ?").run(1);

            return { error: "Nous avons envoyé un nouveau code de vérification à votre e-mail." };

        } else{
            const timeLeft  = (existingToken.expiration_time - Date.now());
            const time_left = (timeLeft/60000).toFixed(0);
            return { error: `Un code a déjà été envoyé. Merci de vérifier votre boîte mail. Vous devez attendre ${time_left} minutes avant de pouvoir en demander un nouveau.` };
        }

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
    }

}

