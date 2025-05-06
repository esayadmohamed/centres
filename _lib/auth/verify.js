'use server'
import getDB from "@/_lib/db";

import xss from 'xss';
import validator from 'validator';
import { randomBytes } from 'crypto';
import nodemailer from "nodemailer";

import { RateLimiter } from '@/_lib/utils/ratelimiter';

// --------------------------------------------------------------

function generateVerificationCode() {
    return randomBytes(12).toString('hex');
}

async function sendVerificationEmail(email, token) {
    try {
        // Create a transporter with Gmail settings
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            secure: true, // Using SSL
            port: 465, // Standard SSL port
        });

        const verificationLink = `https://www.centres.ma/auth/signup/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Code de Vérification - Centres',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                        <h2 style="color: #2e86c1; font-weight: bold; margin-bottom: 20px;">Centres Maroc</h2>
                        <p style="font-size: 16px; margin-bottom: 20px;">Merci de vous être inscrit sur Centres !</p>
                        <p style="font-size: 16px; margin-bottom: 20px;">Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
                        <p>
                            <a href="${verificationLink}" style="display: inline-block; background-color: #2e86c1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                Vérifier mon e-mail
                            </a>
                        </p>
                        <p style="font-size: 14px; color: #666; margin-top: 20px;">Ce code expirera dans 60 minutes.</p>
                        <p style="font-size: 14px; color: #666;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
                        <p style="font-size: 14px; color: #2e86c1; margin-top: 20px;">
                            <a href="https://www.centres.ma/" style="color: #2e86c1; text-decoration: none;">www.centres.ma</a>
                        </p>
                    </div>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Could not send verification email. Please try again later.');
    }
}

export async function VerifyToken(user_token){
    try {
        const db = getDB();

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
    
        const [rows] = await db.execute("SELECT * FROM tokens WHERE token = ? FOR UPDATE", [token]);
        const existingToken = rows[0] || null; 
        
        if (!existingToken) {
            return { error: "Le code de vérification n'est pas valide." };
        } else {
            if (existingToken.expiration_time > Math.floor(Date.now() / 1000)) {

                await db.execute("UPDATE users SET active = ? WHERE email = ?", ['on', existingToken.email]);

                await db.execute( "DELETE FROM tokens WHERE email = ?", [existingToken.email]);

                return { success: true};

            } else {
                const newToken = generateVerificationCode();
                // const newExpirationTime = Date.now() + 3600000;
                const newExpirationTime = Math.floor(Date.now() / 1000) + 3600;

                await db.execute("UPDATE tokens SET token = ?, expiration_time = ? WHERE email = ?",
                    [newToken, newExpirationTime, existingToken.email] );
                  
                await sendVerificationEmail(existingToken.email, newToken);

                await db.query("UPDATE tokens SET send = ? WHERE email = ?", [1, existingToken.email]);
                  
                return { error: "Le code de vérification a expiré. Nous avons envoyé un autre code à votre e-mail."};
            }
        }
        
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
    }

}

// ----------------------------------------------------------------

export async function ResendToken(new_value) {
    const db = getDB();
    const conn = await db.getConnection(); // Get transaction-safe connection

    try {
        // const rate_limiter = await RateLimiter('verify');
        // if(!rate_limiter){
        //     return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        // }  //no need since user can only send one per 1 hour

        if (typeof new_value !== 'string') {
            console.warn(`Guest is sending invalid email for verification process`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const email = xss(new_value.trim());

        if (!validator.isEmail(email)) {
            return { error: "L'adresse e-mail fournie n'est pas valide." };
        }

        const [existingRows] = await conn.query("SELECT active FROM users WHERE email = ?", [email]);
        const existingUser = existingRows[0] || null;

        if (!existingUser) {
            return { error: "Aucun compte n'est associé à cette adresse e-mail." };
        } else if (existingUser.active !== 'none') {
            return { error: "L'adresse e-mail est déjà vérifiée." };
        }

        const [tokenRows] = await conn.query("SELECT * FROM tokens WHERE email = ?", [email]);
        const existingToken = tokenRows[0] || null;

        const now = Math.floor(Date.now() / 1000);

        if (!existingToken || existingToken.expiration_time < now) {
            const token = generateVerificationCode();
            const expirationTime = now + 3600;

            await conn.beginTransaction();

            await conn.query("DELETE FROM tokens WHERE email = ?", [email]);

            await conn.query("INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)",
                [email, token, expirationTime]
            );

            await sendVerificationEmail(email, token);

            await conn.query("UPDATE tokens SET send = ? WHERE email = ?", [1, email]);

            await conn.commit();

            return { error: "Nous avons envoyé un nouveau code de vérification à votre e-mail." };

        } else {
            const timeLeft = existingToken.expiration_time - now;
            const time_left = (timeLeft / 60).toFixed(0);

            return {
                error: `Un code a déjà été envoyé. Merci de vérifier votre boîte mail. Vous devez attendre ${time_left} minutes avant de pouvoir en demander un nouveau.`,
            };
        }

    } catch (error) {
        await conn.rollback();
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
    } finally {
        conn.release();
    }
}