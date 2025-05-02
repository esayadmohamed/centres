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
import dotenv from 'dotenv';

dotenv.config();

// ----------------------------------------------
// ----------------------------------------------

function validateData(new_mail) {
    let errors = {};

    if (!validator.isEmail(new_mail.email)) {
        errors.email = "Format d'e-mail invalide";
    }
    // -----------------------------------------------------------
    if (!new_mail.message || new_mail.message === "") {
        errors.message = "Le message n'est pas valide";
    } else if (new_mail.message.length > 300) {
        errors.message = "Le message ne doit pas dépasser 300 caractères";
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,-:?!']+$/.test(new_mail.message)) {
        errors.message = "Le message ne doit pas contenir de caractères spéciaux";
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

export async function ContactSupport(mail){

    const new_mail = {
        email: xss(mail?.email?.trim()),
        message: xss(mail?.message?.trim()),
    }
    
    const errors = validateData(new_mail);
    if (errors) return { error: errors };

    try{ 
        db.prepare(` INSERT INTO messages (email, message) VALUES (?, ?)`)
        .run(new_mail.email, new_mail.message)

        return {success: true}

    } catch (error) {
        console.error("Database error:", error);
        return {error: {server: "Le serveur ne répond pas. Veuillez réessayer plus tard."}}
    }

}

