'use server'
import getDB from "@/_lib/db";

import xss from 'xss';
import validator from 'validator';
import nodemailer from "nodemailer";
import { randomBytes } from 'crypto';

import { RateLimiter } from "@/_lib/utils/ratelimiter";
import { signupMessage } from "@/_com/dashboard/marketing/emails";

const db = getDB();

//---------------------------------------------

function generateVerificationCode() {
    return randomBytes(12).toString('hex');
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

export async function CheckUserStatus(email) {
    const db = getDB(); 

    if (typeof email !== 'string' || !validator.isEmail(email.trim())) {
        return { error: "Format d'e-mail n'est pas valide." };
    }

    const user_email = xss(email.trim().toLowerCase());
    const conn = await db.getConnection();

    try {
        const rate_limiter = await RateLimiter('login');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        }
        
        const [rows] = await conn.execute("SELECT * FROM users WHERE email = ?", [user_email]);
        const existingUser = rows[0] || null;

        // console.log(rows);
        

        if (!existingUser) {
            return { error: "L'e-mail ou le mot de passe est incorrect." };
        }

        if (existingUser.active === 'off') {
            return { error: "Le compte a été désactivé." };
        }

        if (existingUser.active === 'none') {
            const [tokenrows] = await conn.execute("SELECT send FROM tokens WHERE email = ?", [user_email]);
            const token_send = tokenrows[0]?.send ?? null;

            if (token_send > 0) {
                return {
                    error: "Le compte n'est pas encore vérifié. Un code de vérification a déjà été envoyé à votre boîte mail."
                };
            } else {
                const token = generateVerificationCode();
                const expirationTime = Math.floor(Date.now() / 1000) + 3600; 

                await conn.beginTransaction();

                await conn.execute("DELETE FROM tokens WHERE email = ?", [user_email]);

                await conn.execute(
                    "INSERT INTO tokens (email, token, expiration_time) VALUES (?, ?, ?)",
                    [user_email, token, expirationTime]
                );

                await conn.execute("UPDATE tokens SET send = ? WHERE email = ?", [1, user_email]);

                await conn.commit();

                await sendVerificationEmail(user_email, token);

                return {
                    error: "Le compte n'est pas encore vérifié. Un code de vérification a été envoyé à votre boîte mail."
                };
            }
        }

        return { success: true };

    } catch (error) {
        await conn.rollback();
        console.error("Database error:", error);
        return { error: "Le serveur ne répond pas. Veuillez réessayer plus tard." };
    } finally {
        conn.release();
    }
}
