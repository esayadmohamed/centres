"use server";
import getDB from "@/_lib/db";

import bcrypt from "bcryptjs";
import xss from 'xss';
import { randomBytes } from 'crypto';
import nodemailer from "nodemailer";
import validator from 'validator';

import { RateLimiter } from "@/_lib/utils/ratelimiter";
import { verifyCaptcha } from "@/_lib/utils/captcha";

const db = getDB();

// ----------------------------------------------------
// ---------------------------------------------------- 

function generateVerificationCode() {
    return randomBytes(12).toString('hex');
}

function generateUserCode() {
    return randomBytes(6).toString('hex');
}

async function sendVerificationEmail(email, token) {
    try {
        // Create a transporter with Gmail settings
        const transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: 'mail.centres.ma',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            secure: true, // Using SSL
            port: 465, // Standard SSL port
        });

        const verificationLink = `https://www.centres.ma//auth/signup/${token}`;

        const mailOptions = {
            from: `Centres ${process.env.EMAIL_USER}`,
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
                        <p style="font-size: 14px; color: #666; margin-top: 20px;">Ce lien expirera dans 60 minutes.</p>
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

function SanitizeObject(obj){
    
    if(!obj) return null

    if(typeof obj !== 'object') return null
    if(Object.prototype.toString.call(obj) !== '[object Object]') return null

    if(!Object.hasOwn(obj, 'name') 
        || !Object.hasOwn(obj, 'email') 
        || !Object.hasOwn(obj, 'phone') 
        || !Object.hasOwn(obj, 'password')
        || !Object.hasOwn(obj, 'captchaToken')){
        return null
    }

    if(typeof obj.name !== 'string'
        || typeof obj.email !== 'string'
        || typeof obj.phone !== 'string'
        || typeof obj.password !== 'string'
        // || typeof obj.captchaToken !== 'string'
    ){
        return null
    }

    return obj;
}

function validateData(user) {
    let errors = {};

    if (!user.name 
        || user.name === ""
        || user.name.length < 2 
        || user.name.length > 50 
        || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(user.name) ) {
            errors.name = "Le prénom fourni n'est pas valide";
    }

    // -----------------------------------------------------------

    if (!validator.isEmail(user.email) || user.email.length > 100 ) {
        errors.email = "Format d'e-mail invalide";
    }
    
    // -----------------------------------------------------------
    
    if (!user.phone || !/^(05|06|07)\d{8}$/.test(user.phone)) {
        errors.phone = "Format de numero invalide";
    }

    // -----------------------------------------------------------
    
    if (user.password.length < 8) {
        errors.password = "Mot de passe invalide";
        errors.long = "Au moins 8 caractères";
    }
    if (user.password.length > 50){
        errors.password = "Mot de passe invalide";
        errors.long = "Mot de passe n'est pas valide";
    }
    if (!/[0-9]/.test(user.password)) {
        errors.password = "Mot de passe invalide";
        errors.number = "Au moins un chiffre (1, 2, 3 ...)";
    }
    if (!/[A-Z]/.test(user.password)) {
        errors.password = "Mot de passe invalide";
        errors.uppercase = "Au moins une lettre majuscule (A, B, C ...)";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(user.password)) {
        errors.password = "Mot de passe invalide";
        errors.character = "Au moins un caractère spécial (@, -, / ...)";
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

// export async function verifyCaptcha(captchaToken) {
//     const url = process.env.NODE_ENV === 'production'
//       ? `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/recaptcha`
//       : 'http://localhost:3000/api/recaptcha';
  
//     try {
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ captchaToken }),
//       });
  
//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error(`Erreur HTTP: ${res.status}`, errorText);
//         return null;
//       }
  
//       const data = await res.json();
//       return data.success ? { success: true } : null;
  
//     } catch (error) {
//       console.error("Erreur dans verifyCaptcha:", error.message);
//       return null;
//     }
// }
  
export async function CreateUser(user_data) {

    const conn = await db.getConnection();
    
    try {
        const rate_limiter = await RateLimiter('signup');
        if(!rate_limiter){
            return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        }

        const data = SanitizeObject(user_data);
        if (!data) {
            console.warn("Create an account: Invalid input type, expected an object.");
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        
        if(!data.captchaToken || typeof data.captchaToken !== 'string'){
            return { error: { captcha: "Vous devez compléter le CAPTCHA pour continuer." } };
        }

        const user = {
            name: xss(data.name).trim(),
            email: xss(data.email).trim().toLowerCase(),
            phone: xss(data.phone).trim(),
            password: xss(data.password).trim(),
            captchaToken: xss(data.captchaToken).trim()
        };

        const captcha = await verifyCaptcha(user.captchaToken)
        if (!captcha) {
            return { error: { captcha: "Échec de la vérification du CAPTCHA." } };
        }
        
        const errors = validateData(user);
        if (errors) {
            console.log('validation error:', user);
            return { error: errors };
        }

        const [existingPhone] = await db.query("SELECT * FROM users WHERE phone = ?", [user.phone]);
        if (existingPhone.length > 0) {
            return { error: { phone: "Le numéro de téléphone est déjà utilisé." } };
        }

        const [existingEmail] = await db.query("SELECT * FROM users WHERE email = ?", [user.email]);
        if (existingEmail.length > 0) {
            return { error: { email: "L'adresse e-mail est déjà utilisée." } };
        }

        // Begin transaction
        await conn.beginTransaction();

        user.password = await bcrypt.hash(user.password, 10);
        const code = generateUserCode();

        await conn.query(
            "INSERT INTO users (name, email, phone, password, token) VALUES (?, ?, ?, ?, ?)",
            [user.name, user.email, user.phone, user.password, code]
        );

        const token = generateVerificationCode();
        // const expirationTime = Date.now() + 3600000;
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;

        await conn.query("DELETE FROM tokens WHERE email = ?", [user.email]);
        await conn.query("INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)",
            [user.email, token, expirationTime]
        );

        await conn.query("UPDATE tokens SET send = ? WHERE email = ?", [1, user.email]);

        await conn.commit(); // All DB operations succeeded

        await sendVerificationEmail(user.email, token); // Safe to do after commit

        return { success: true };

    } catch (error) {
        await conn.rollback(); // Undo all DB operations
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
    } finally {
        conn.release(); // Always release connection
    }
}
