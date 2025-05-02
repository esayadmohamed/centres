'use server'
// const sql = require('better-sqlite3');
// const db = sql('main.db');
// db.pragma('foreign_keys = ON');
import db from "@/_lib/db";

import fs from 'node:fs/promises';
import path from 'node:path';
import xss from 'xss';
import validator from 'validator';
import bcrypt from "bcryptjs";
import { randomBytes } from 'crypto';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { revalidatePath } from "next/cache";
import { log } from 'node:console';


dotenv.config();

const handleDbError = (error) => {
    console.error("Database error:", error);
    return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
};


// --------------------------------------------------
// --------------------------------------------------

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

    const verificationLink = `http://localhost:3000/auth/${token}`;

    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: email,
        subject: "Code de Verification - Courdesoutien",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                    <!-- Centre de Soutien Section -->
                    <h2 style="color: #4CAF50; font-weight: bold; margin-bottom: 20px;">Centre de Soutien</h2>

                    <!-- Thank you message -->
                    <p style="font-size: 16px; margin-bottom: 20px;">Merci de vous être inscrit sur Courdesoutien !</p>
                    <p style="font-size: 16px; margin-bottom: 20px;">Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>

                    <!-- Verification Button -->
                    <p>
                        <a href="${verificationLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                            Vérifier mon e-mail
                        </a>
                    </p>

                    <!-- Expiration notice -->
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">Ce code expirera dans 60 minutes.</p>
                    <p style="font-size: 14px; color: #666;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>

                    <!-- Website Link -->
                    <p style="font-size: 14px; color: #4CAF50; margin-top: 20px;">
                        <a href="https://www.centredesoutien.com" style="color: #4CAF50; text-decoration: none;">
                            www.centredesoutien.com
                        </a>
                    </p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}

export async function VerifyToken(user_token){

    // 49404082e465136536b1dd30

    const token = xss(user_token?.token);

    if(!token || token.length !== 24){
        return { error: "Le code de vérification n'est pas valide." };
    }
    
    try {
        const existingToken = db.prepare("SELECT * FROM tokens WHERE token = ?").get(token);
        
        if (!existingToken) {
            return { error: "Le code de vérification n'est pas valide." };
        } else { //sub_1
            if (existingToken.expiration_time > Date.now()) { // success

                db.prepare("UPDATE users SET active = ? WHERE email = ?")
                .run('on', existingToken.email);

                db.prepare("DELETE FROM tokens WHERE email = ?").run(existingToken.email);

                return { success: "Votre compte a été vérifié."};
            } else { //sub_2
                
                const newToken = generateVerificationCode();
                const newExpirationTime = Date.now() + 3600000;

                db.prepare("UPDATE tokens SET token = ?, expiration_time = ? WHERE email = ?")
                .run(newToken, newExpirationTime, existingToken.email);

                sendVerificationEmail(existingToken.email, newToken) 
                // db.prepare("UPDATE tokens SET send = ?").run(1);

                return { error: "Le code de vérification a expiré. Nous avons envoyé un autre code à votre e-mail."};
            }
        }
        
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
    }

}

export async function ResendToken(user_email){
    
    const email = xss(user_email)

    if (!validator.isEmail(email)) {
        return { error: "Format d'e-mail n'est pas valide." };
    }

    try{
        const existingUser = db.prepare("SELECT active FROM users WHERE email = ?").get(email);
        if (!existingUser) {
            return { error: "Aucun compte n'est associé à cette adresse e-mail." };
        } else if(existingUser.active !== 'none'){
            return { error: "Le compte est déjà vérifié." };
        }

        const token = generateVerificationCode();
        const expirationTime = Date.now() + 3600000;

        const existingToken = db.prepare("SELECT * FROM tokens WHERE email = ?").get(email);
        if (!existingToken) {
                        
            db.prepare("INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)")
            .run(email, token, expirationTime);
            
            await sendVerificationEmail(email, token);

            return { error: "Nous avons envoyé un nouveau code à votre e-mail." };

        } else if(existingToken.expiration_time < Date.now()){
            
            db.prepare("UPDATE tokens SET token = ?, expiration_time = ? WHERE email = ?")
            .run(token, expirationTime, email);
            
            await sendVerificationEmail(email, token);

            return { error: "Nous avons envoyé un nouveau code à votre e-mail." };

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

// --------------------------------------------------
// --------------------------------------------------

// export async function CheckUserStatus(email){
    
//     const user_email = xss(email)

//     if (!validator.isEmail(user_email)) {
//         return { error: "Format d'e-mail n'est pas valide." };
//     }

//     try {
//         const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(user_email);
//         if (!existingUser) {
//             return {error: "L'e-mail ou le mot de passe est incorrect."}
//         }
//         if (existingUser.active !== 'on' && existingUser.active !== 'none') {
//             return {error: "Le compte a été désactivé."}
//         }
//         if (existingUser.active === 'none') {
//             const token_send =  db.prepare("SELECT send FROM tokens WHERE email = ?").get(user_email);

//             if(token_send?.send > 0) {
//                 return {error: "Le compte n'est pas encore vérifié. Un code de vérification a déjà été envoyée à votre boîte mail."}
//             } else {
                
//                 db.prepare("DELETE FROM tokens WHERE email = ?").run(user_email);
                
//                 const token = generateVerificationCode();
//                 const expirationTime = Date.now() + 3600000;
                
//                 db.prepare("INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)")
//                 .run(user_email, token, expirationTime);
                
//                 await sendVerificationEmail(user_email, token);

//                 db.prepare("UPDATE tokens SET send = ?").run(1);

//                 return {error: "Le compte n'est pas encore vérifié. Un code de vérification a été envoyée à votre boîte mail."}

//             }

//         }

//     } catch (error) {
//         console.error("Database error:", error);
//         return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
//     }

     
// }

// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------

export async function CheckToken(user_token){

    const token = xss(user_token?.token);

    if(!token || token.length !== 24){
        return { error: "Le code de réinitialisation n'est pas valide." };
    }
    
    try {
        const existingToken = db.prepare("SELECT * FROM tokens WHERE token = ?").get(token);
        
        if (!existingToken) {
            return { error: "Le code de réinitialisation  n'est pas valide." };
        } else { //sub_1
            if (existingToken.expiration_time > Date.now()) { // success

                db.prepare("UPDATE users SET active = ? WHERE email = ?")
                .run('on', existingToken.email);

                db.prepare("DELETE FROM tokens WHERE email = ?").run(existingToken.email);

                return { success: "Votre compte a été vérifié."};
            } else { //sub_2
                
                const newToken = generateVerificationCode();
                const newExpirationTime = Date.now() + 3600000;

                db.prepare("UPDATE tokens SET token = ?, expiration_time = ? WHERE email = ?")
                .run(newToken, newExpirationTime, existingToken.email);

                sendVerificationEmail(existingToken.email, newToken) 
                // db.prepare("UPDATE tokens SET send = ?").run(1);

                return { error: "Le code de vérification a expiré. Nous avons envoyé un autre code à votre e-mail."};
            }
        }
        
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
    }

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

// --------------------------------------------------
// --------------------------------------------------

export async function PasswordToken(user_email){ // send email that has
    
    const email = xss(user_email)

    if (!validator.isEmail(email)) {
        return { error: "L'adresse e-mail fournie n'est pas valide." };
    }

    try {
        const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (!existingUser) {
            return {error: "Aucun utilisateur n'est associé à cette adresse e-mail."}
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

            return {error: "Un code de vérification a été envoyée à votre boîte mail."}
        }

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
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

export async function PasswordReset(user){
    
    const password = {
        main_password  : xss(user?.mainPassword),
        match_password : xss(user?.matchPassword),
        reset_token    : xss(user?.token)
    }
    
    const errors = validateUserData(password.main_password);
    if (errors) return { error: errors };

    if (password.main_password !== password.match_password) {
        return {error: {password: "Les mots de passe ne correspondent pas."}}
    }

    if(!password.reset_token || password.reset_token.length !== 24){
        return { error: {password: "Le code de réinitialisation n'est pas valide."}};
    }

    try {
        const verify_token = await VerifyResetToken(password.reset_token); 
        if (verify_token?.error) return verify_token;

        const existingUser = db.prepare("SELECT password FROM users WHERE email = ?").get(verify_token);

        const isLikeOld = await bcrypt.compare(password.main_password, existingUser.password);
        if(isLikeOld) {
            return { error: {password: "Le nouveau mot de passe ne doit pas être identique à l'ancien."}};
        }

        const new_password = await bcrypt.hash(password.main_password, 10);
        
        db.prepare("UPDATE users SET password = ?").run('');

        return { success: true}//"Le mot de passe a été modifié avec succès."};
        
        console.log(isPasswordValid);
        // ---------------------------------------------

    } catch (error) {
        return handleDbError(error);
    }



    //verify password and match
    //verify token
    //change password


    // console.log(reset_token);
    
}




