"use server";
import getDB from "@/_lib/db";

import bcrypt from "bcryptjs";
import xss from 'xss';
import { randomBytes } from 'crypto';
import nodemailer from "nodemailer";
import validator from 'validator';

import { RateLimiter } from "@/_lib/utils/ratelimiter";
import { verifyCaptcha } from "@/_lib/utils/captcha";

import { signupMessage } from "@/_com/dashboard/marketing/emails";

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
        const transporter = nodemailer.createTransport({
            host: 'mail.centres.ma',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            secure: true,
            port: 465,
        });

        const message = signupMessage(token);

        const mailOptions = {
            from: `Centres ${process.env.EMAIL_USER}`,
            to: email,
            subject: message.subject,
            html: message.text,
        };

        await transporter.sendMail(mailOptions);

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

        await conn.beginTransaction();

        user.password = await bcrypt.hash(user.password, 10);
        const code = generateUserCode();

        await conn.query(
            "INSERT INTO users (name, email, phone, password, token) VALUES (?, ?, ?, ?, ?)",
            [user.name, user.email, user.phone, user.password, code]
        );

        const token = generateVerificationCode();
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;

        await conn.query("DELETE FROM tokens WHERE email = ?", [user.email]);

        await conn.query("INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)",
            [user.email, token, expirationTime]
        );

        await conn.query("UPDATE tokens SET send = ? WHERE email = ?", [1, user.email]);

        await conn.commit();

        await sendVerificationEmail(user.email, token);

        return { success: true };

    } catch (error) {
        await conn.rollback();
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
    } finally {
        conn.release(); 
    }
}
