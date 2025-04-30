'use server'
// const sql = require('better-sqlite3');
// const db = sql('main.db');
// db.pragma('foreign_keys = ON');
import db from "@/_lib/db";

import xss from 'xss';
import validator from 'validator';
import bcrypt from "bcryptjs";
import { randomBytes } from 'crypto';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

import { RateLimiter } from '@/_lib/utils/ratelimiter';

// --------------------------------------------------
// --------------------------------------------------

const handleDbError = (error) => {
    console.error("Database error:", error);
    return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
};

function generateVerificationCode() {
    return randomBytes(12).toString('hex');
}

async function sendResetEmail(email, token) {
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

    const resetLink = `http://localhost:3000/auth/reset/${token}`;

    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: email,
        subject: "Réinitialisation du mot de passe - Courdesoutien",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                    <!-- Centre de Soutien Section -->
                    <h2 style="color: #2874a6; font-weight: bold; margin-bottom: 20px;">Centre de Soutien</h2>

                    <!-- Password reset message -->
                    <p style="font-size: 16px; margin-bottom: 20px;">Vous avez demandé à réinitialiser votre mot de passe sur Courdesoutien.</p>
                    <p style="font-size: 16px; margin-bottom: 20px;">Merci de cliquer sur le lien ci-dessous :</p>

                    <!-- Reset Password Link -->
                    <p>
                        <a href="${resetLink}" style="display: inline-block; background-color: #2874a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                            Réinitialiser mon mot de passe
                        </a>
                    </p>

                    <!-- Expiration notice -->
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">Ce lien expirera dans 60 minutes.</p>
                    <p style="font-size: 14px; color: #666;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>

                    <!-- Website Link -->
                    <p style="font-size: 14px; color: #2874a6; margin-top: 20px;">
                        <a href="https://www.centredesoutien.com" style="color: #2874a6; text-decoration: none;">
                            www.centredesoutien.com
                        </a>
                    </p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}

export async function PasswordToken(user_email){
    // console.log(typeof user_email);return{error: true}
    try {
        const rate_limiter = await RateLimiter('reset');
        if(!rate_limiter){
            return { error:"Le serveur est actuellement occupé, veuillez réessayer plus tard." };
        }

        if(typeof user_email !== 'string'){
            console.warn(`User ${user_id} is sending invalid phone data for listing_id ${listing_id}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const email = xss(user_email).trim(); 

        if (!validator.isEmail(email) || email.length > 100) {
            return { error: "L'adresse e-mail fournie n'est pas valide." };
        }
        
        const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (!existingUser) {
            return{error: "Aucun utilisateur n'est associé à cette adresse e-mail"}
        }

        if (existingUser?.active !== 'on') {
            return {error: "Le compte associé à cette adresse e-mail n'est pas actif."}
        }

        const existingToken =  db.prepare("SELECT * FROM tokens WHERE email = ?").get(email);

        if(existingToken?.send > 0 && existingToken.expiration_time > Date.now()) {
            return {error: "Un code de vérification a déjà été envoyée à votre boîte mail."}
        } else {
            db.prepare("DELETE FROM tokens WHERE email = ?").run(email);
            
            const token = generateVerificationCode();
            const expirationTime = Date.now() + 3600000;
            
            db.prepare("INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)")
            .run(email, token, expirationTime);
            
            await sendResetEmail(email, token);

            db.prepare("UPDATE tokens SET send = ?").run(1);

            return {success: "Un code de vérification a été envoyée à votre boîte mail."}
        }

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
    
}

// --------------------------------------------------
// --------------------------------------------------

export async function VerifyResetToken(token){

    try {
        const existingToken = db.prepare("SELECT * FROM tokens WHERE token = ?").get(token);
        
        if (!existingToken) {
            return {error: {password: "Le code de réinitialisation n'est pas valide."}};
        } else { 
            if (existingToken.expiration_time > Date.now()) { // success

                return existingToken.email
                
            } else {     

                const newToken = generateVerificationCode();
                const newExpirationTime = Date.now() + 3600000;

                db.prepare("UPDATE tokens SET token = ?, expiration_time = ? WHERE email = ?")
                .run(newToken, newExpirationTime, existingToken.email);

                await sendResetEmail(existingToken.email, newToken);
                
                db.prepare("UPDATE tokens SET send = ?").run(1);

                return {error: "Un code de vérification a été envoyée à votre boîte mail."}
            }
        }
        
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
    }

}

function validateUserData(password) {
    let errors = {};

    if (password.length < 8) {
        errors.long = "Au moins 8 caractères";
    }
    if (!/[0-9]/.test(password)) {
        errors.number = "Au moins un chiffre (1, 2, 3 ...)";
    }
    if (!/[A-Z]/.test(password)) {
        errors.uppercase = "Au moins une lettre majuscule (A, B, C ...)";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.character = "Au moins un caractère spécial (@, -, / ...)";
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

function SanitizeObject(obj){
    
    if(!obj) return null //1

    if(typeof obj !== 'object') return null //2
    if(Object.prototype.toString.call(obj) !== '[object Object]') return null

    if(!Object.hasOwn(obj, 'mainPassword') 
        || !Object.hasOwn(obj, 'matchPassword') 
        || !Object.hasOwn(obj, 'token')){
        return null
    }

    if(typeof obj.mainPassword !== 'string'
        || typeof obj.matchPassword !== 'string'
        || typeof obj.token !== 'string'){
        return null
    }

    return obj;
}

export async function PasswordReset(user){
    // console.log(user);return;
    try {
        const rate_limiter = await RateLimiter('password');
        if(!rate_limiter){
            return { error: {password:"Le serveur est actuellement occupé, veuillez réessayer plus tard."}};
        }

        const data = SanitizeObject(user_data)
        if(!data){
            console.warn("Create an account: Invalid input type, expected a object.");
            return { error: {password:"Une erreur est survenue. Veuillez réessayer plus tard."}};
        }

        const password = {
            main_password  : xss(user?.mainPassword).trim(),
            match_password : xss(user?.matchPassword).trim(),
            reset_token    : xss(user?.token).trim()
        }
        
        // -------------------

        if (password.main_password.length > 50) {
            return {error: {password: "Mot de passe n'est pas valide"}}
        }

        const errors = validateUserData(password.main_password);
        if (errors) return { error: errors };

        if (password.main_password !== password.match_password) {
            return {error: {password: "Les mots de passe ne correspondent pas."}}
        }
        
        if(!password.reset_token || password.reset_token.length !== 24){
            return { error: {password: "Le code de réinitialisation n'est pas valide."}};
        }

        // -------------------

        const verify_token = await VerifyResetToken(password.reset_token); 
        if (verify_token?.error) return verify_token;

        const existingUser = db.prepare("SELECT password FROM users WHERE email = ?").get(verify_token);

        const isLikeOld = await bcrypt.compare(password.main_password, existingUser.password);
        if(isLikeOld) {
            return { error: {password: "Le nouveau mot de passe ne doit pas être identique à l'ancien."}};
        }

        const new_password = await bcrypt.hash(password.main_password, 10);
        
        db.prepare("UPDATE users SET password = ?").run(new_password);
        
        return { success: true}//"Le mot de passe a été modifié avec succès."};
            
        } catch (error) {
            return handleDbError(error);
        }
    
}