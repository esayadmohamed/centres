'use server'
// const sql = require('better-sqlite3');
// const db = sql('main.db');
// db.pragma('foreign_keys = ON');
import db from "@/_lib/db";

import xss from 'xss';
import validator from 'validator';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
import { randomBytes } from 'crypto';

dotenv.config();

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

async function verifyCaptcha(captchaToken) {
    const url = process.env.NODE_ENV === 'production'
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/verify-captcha`
        : 'http://localhost:3000/api/verify-captcha'; 

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ captchaToken }),
        });

        // Vérifie si la réponse est correcte
        if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
        }

        const text = await res.text(); // Récupère la réponse brute
        console.log("Réponse brute:", text);

        if (!text) {
            throw new Error("Réponse vide du serveur");
        }

        const data = JSON.parse(text); // Convertit en JSON

        if (data.success) {
            return { success: true };
        } else {
            return null;
        }

    } catch (error) {
        console.error("Erreur dans verifyCaptcha:", error.message);
        return null;
    }
}

export async function CheckUserStatus(email){
    
    const user_email = xss(email)

    // const captcha = await verifyCaptcha(user_captcha)
    // if (!captcha) return { error: "La vérification Captcha est invalide." };

    if (!validator.isEmail(user_email)) {
        return { error: "Format d'e-mail n'est pas valide." };
    }

    try {
        const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(user_email);
        if (!existingUser) {
            return {error: "L'e-mail ou le mot de passe est incorrect."}
        }
        if (existingUser.active !== 'on' && existingUser.active !== 'none') {
            return {error: "Le compte a été désactivé."}
        }
        if (existingUser.active === 'none') {
            const token_send =  db.prepare("SELECT send FROM tokens WHERE email = ?").get(user_email);

            if(token_send?.send > 0) {
                return {error: "Le compte n'est pas encore vérifié. Un code de vérification a déjà été envoyée à votre boîte mail."}
            } else {
                
                db.prepare("DELETE FROM tokens WHERE email = ?").run(user_email);
                
                const token = generateVerificationCode();
                const expirationTime = Date.now() + 3600000;
                
                db.prepare("INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)")
                .run(user_email, token, expirationTime);
                
                await sendVerificationEmail(user_email, token);

                db.prepare("UPDATE tokens SET send = ?").run(1);

                return {error: "Le compte n'est pas encore vérifié. Un code de vérification a été envoyée à votre boîte mail."}

            }

        }

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
    }

     
}