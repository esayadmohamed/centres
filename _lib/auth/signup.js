"use server";
import getDB from "@/_lib/db";

import bcrypt from "bcryptjs";
import xss from 'xss';
import { randomBytes } from 'crypto';
import nodemailer from "nodemailer";
import validator from 'validator';

import { RateLimiter } from "@/_lib/utils/ratelimiter";

const db = getDB();

// ----------------------------------------------------
// ---------------------------------------------------- 

function generateVerificationCode() {
    return randomBytes(12).toString('hex');
}

function generateUserCode() {
    return randomBytes(6).toString('hex');
}

// ----------------------------------------------------

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

function SanitizeObject(obj){
    
    if(!obj) return null //1

    if(typeof obj !== 'object') return null //2
    if(Object.prototype.toString.call(obj) !== '[object Object]') return null

    if(!Object.hasOwn(obj, 'name') 
        || !Object.hasOwn(obj, 'email') 
        || !Object.hasOwn(obj, 'phone') 
        || !Object.hasOwn(obj, 'password')){
        return null
    }

    if(typeof obj.name !== 'string'
        || typeof obj.email !== 'string'
        || typeof obj.phone !== 'string'
        || typeof obj.password !== 'string'){
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

export async function CreateUser(user_data) {    
    try {
        const rate_limiter = await RateLimiter('create');
        if(!rate_limiter){
            return { error: {server: "Le serveur est actuellement occupé, veuillez réessayer plus tard."}};
        }

        const data = SanitizeObject(user_data)
        if(!data){
            console.warn("Craete an account: Invalid input type, expected a object.");
            return { error: {server: "Une erreur est survenue. Veuillez réessayer plus tard."}};
        }
        
        const user = {
            name: xss(user_data.name).trim(),
            email: xss(user_data.email).trim(),
            phone: xss(user_data.phone).trim(),
            password: xss(user_data.password).trim()
        }

        // ------------------------
        const errors = validateData(user);
        if (errors) {
            console.log('validation error:', user);
            return { error: errors };
        }

        // ------------------------
        const existingPhone = db.prepare("SELECT * FROM users WHERE phone = ?").get(user.phone);
        if (existingPhone) return {error: {phone: "Le numéro de téléphone est déjà utilisé."}}

        const existingEmail = db.prepare("SELECT * FROM users WHERE email = ?").get(user.email);
        if (existingEmail) return {error: {email: "L'adresse e-mail est déjà utilisée."}}

        // ------------------------
        user.password = await bcrypt.hash(user.password, 10);

        const code = generateUserCode();

        const stmt = db.prepare(` INSERT INTO users (name, email, phone, password, token) VALUES (?, ?, ?, ?, ?)`);
        stmt.run(user.name, user.email, user.phone, user.password, code);

        const token = generateVerificationCode();
        const expirationTime = Date.now() + 3600000;
    
        db.prepare("DELETE FROM tokens WHERE email = ?").run(user.email); //cleanup
        db.prepare("INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)")
        .run(user.email, token, expirationTime);

        await sendVerificationEmail(user.email, token);

        db.prepare("UPDATE tokens SET send = ?").run(1);
        
        return { success: true };

    } catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
    }

}

