'use server'
import getDB from "@/_lib/db";

import xss from 'xss';
import validator from 'validator';
import bcrypt from "bcryptjs";
import { randomBytes } from 'crypto';
import nodemailer from "nodemailer";

import { RateLimiter } from '@/_lib/utils/ratelimiter';

const db = getDB(); 

// --------------------------------------------------
// --------------------------------------------------

function generateVerificationCode() {
    return randomBytes(12).toString('hex');
}

async function sendResetEmail(email, token) {
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

        const resetLink = `https://www.centres.ma//auth/signup/${token}`;

        const mailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: "Code de Réinitialisation - Centres",
            html: `                
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                        <h2 style="color: #2e86c1; font-weight: bold; margin-bottom: 20px;">Centres Maroc</h2>
                        <p style="font-size: 16px; margin-bottom: 20px;">Vous avez demandé à réinitialiser votre mot de passe sur Centres.</p>
                        <p style="font-size: 16px; margin-bottom: 20px;">Pour changer votre mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>
                        <p>
                            <a href="${resetLink}" style="display: inline-block; background-color: #2e86c1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
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
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function PasswordToken(user_email) {
    const conn = await db.getConnection();

    try {
        // Input validation
        if (typeof user_email !== 'string') {
            console.warn(`Guest sent invalid email type for password reset.`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const email = xss(user_email.trim());

        if (!validator.isEmail(email) || email.length > 100) {
            return { error: "L'adresse e-mail fournie n'est pas valide." };
        }

        // Check user existence
        const [existingRows] = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
        const existingUser = existingRows[0] || null;

        if (!existingUser) {
            return { error: "Aucun utilisateur n'est associé à cette adresse e-mail" };
        }

        if (existingUser.active !== 'on') {
            return { error: "Le compte associé à cette adresse e-mail n'est pas actif." };
        }

        const [tokenRows] = await conn.query("SELECT * FROM tokens WHERE email = ?", [email]);
        const existingToken = tokenRows[0] || null;

        const now = Math.floor(Date.now() / 1000);

        if (existingToken?.send > 0 && existingToken.expiration_time > now) {
            return { error: "Un code de vérification a déjà été envoyé à votre boîte mail." };
        }

        const token = generateVerificationCode();
        const expirationTime = now + 3600;

        await conn.beginTransaction();

        await conn.query("DELETE FROM tokens WHERE email = ?", [email]);

        await conn.query(
            "INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)",
            [email, token, expirationTime]
        );

        await conn.query("UPDATE tokens SET send = ? WHERE email = ?", [1, email]);

        await conn.commit();

        await sendResetEmail(email, token);

        return { success: "Un code de vérification a été envoyé à votre boîte mail." };

    } catch (error) {
        await conn.rollback();
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    } finally {
        conn.release();
    }
}

// -------------------------------------------------

async function VerifyResetToken(token){
    try {
        const [existingRows] = await db.query("SELECT * FROM tokens WHERE token = ? FOR UPDATE", [token]);
        const existingToken = existingRows[0] || null
        
        if (!existingToken) {
            return {error: {password: "Le code de réinitialisation n'est pas valide."}};
        } else { 
            if (existingToken.expiration_time > Math.floor(Date.now() / 1000)) { // success

                return { email: existingToken.email };
                
            } else {     

                const newToken = generateVerificationCode();
                const newExpirationTime = Math.floor(Date.now() / 1000) + 3600;

                await db.query("UPDATE tokens SET token = ?, expiration_time = ? WHERE email = ?"
                    ,[newToken, newExpirationTime, existingToken.email]);

                await sendResetEmail(existingToken.email, newToken);
                
                await db.execute("UPDATE tokens SET send = ? WHERE email = ?", [1, existingToken.email]);

                return {error: "Un code de vérification a été envoyé à votre boîte mail."}
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
    if (password.length > 50){
        errors.long = "Mot de passe n'est pas valide";
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

export async function PasswordReset(user) {
    try {
        const data = SanitizeObject(user);
        if (!data) {
            console.warn("Password reset: Invalid input.");
            return { error: { password: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const password = {
            main_password: xss(user?.mainPassword).trim(),
            match_password: xss(user?.matchPassword).trim(),
            reset_token: xss(user?.token).trim(),
        };

        const errors = validateUserData(password.main_password);
        if (errors) return { error: errors };

        if (password.main_password !== password.match_password) {
            return { error: { password: "Les mots de passe ne correspondent pas." } };
        }

        if (!password.reset_token || password.reset_token.length !== 24) {
            return { error: { password: "Le code de réinitialisation n'est pas valide." } };
        }

        const verify_token = await VerifyResetToken(password.reset_token);
        if (verify_token?.error) return verify_token;

        const [existingRows] = await db.query("SELECT password FROM users WHERE email = ?", [verify_token.email]);
        const existingUser = existingRows[0] || null;

        if (!existingUser) {
            return { error: { password: "Ce compte n'existe plus." } };
        }

        const isLikeOld = await bcrypt.compare(password.main_password, existingUser.password);
        if (isLikeOld) {
            return { error: { password: "Le nouveau mot de passe ne doit pas être identique à l'ancien." } };
        }

        const new_password = await bcrypt.hash(password.main_password, 10);

        // Optional: Use transaction here for safety
        await db.beginTransaction();
        await db.query("UPDATE users SET password = ? WHERE email = ?", [new_password, verify_token.email]);
        await db.query("DELETE FROM tokens WHERE email = ?", [verify_token.email]);
        await db.commit();

        return { success: true };

    } catch (error) {
        await db.rollback?.(); // Safe even if no transaction started
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
    }
}


// export async function PasswordReset(user){
//     try {
//         // const rate_limiter = await RateLimiter('password');
//         // if(!rate_limiter){
//         //     return { error: {password:"Le serveur est actuellement occupé, veuillez réessayer plus tard."}};
//         // }

//         const data = SanitizeObject(user)
//         if(!data){
//             console.warn("Create an account: Invalid input type, expected a object.");
//             return { error: {password:"Une erreur est survenue. Veuillez réessayer plus tard."}};
//         }

//         const password = {
//             main_password  : xss(user?.mainPassword).trim(),
//             match_password : xss(user?.matchPassword).trim(),
//             reset_token    : xss(user?.token).trim()
//         }
        
//         // -------------------

//         const errors = validateUserData(password.main_password);
//         if (errors) return { error: errors };

//         if (password.main_password !== password.match_password) {
//             return {error: {password: "Les mots de passe ne correspondent pas."}}
//         }
        
//         if(!password.reset_token || password.reset_token.length !== 24){
//             return { error: {password: "Le code de réinitialisation n'est pas valide."}};
//         }

//         // -------------------

//         const verify_token = await VerifyResetToken(password.reset_token); 
//         if (verify_token?.error) return verify_token;

//         const [existingRows] = await db.query("SELECT password FROM users WHERE email = ?", [verify_token.email]);
//         const existingUser = existingRows[0] || null

//         const isLikeOld = await bcrypt.compare(password.main_password, existingUser.password);
//         if(isLikeOld) {
//             return { error: {password: "Le nouveau mot de passe ne doit pas être identique à l'ancien."}};
//         }

//         const new_password = await bcrypt.hash(password.main_password, 10);
        
//         await db.query("UPDATE users SET password = ? WHERE email = ?", [new_password, verify_token.email]);

//         await db.query("DELETE FROM tokens WHERE email = ?", [verify_token.email]);

//         return { success: true}
            
//     } catch (error) {
//         console.error("Database error:", error);
//         return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } }
//     }
    
// }




