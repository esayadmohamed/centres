'use server'
import getDB from "@/_lib/db";

import xss from "xss";
import bcrypt from "bcryptjs";

import { revalidatePath } from "next/cache";
import { UserAuthenticated } from "@/_lib/utils/userauth";

import { RateLimiter } from "@/_lib/utils/ratelimiter";

// --------------------------------------------------------

export async function GetUserData(){
    try {
        const db = getDB();

        const user_id = await UserAuthenticated();
        if(!user_id) return null

        const [row] = await db.execute("SELECT * FROM users WHERE id = ?",  [user_id]);
        const user = row[0] || null
        if(!user) return null

        const date = new Date(user.created_at);
        const formattedDate = `${date.toLocaleString('fr-FR', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('fr-FR', { month: 'long' }).slice(1)} ${date.getFullYear()}`;

        return {
            name: user.name || '',
            email: user.email || '',
            number: user.phone || '',
            created_at: formattedDate || ''
        };

    } catch (error) {
        console.error("Database error:", error);
        return null
    }
}

// --------------------------------------------------------

export async function ModifyUsername(value) {    
    try {
        const db = getDB();

        const rate_limiter = await RateLimiter('account');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        }

        const user_id = await UserAuthenticated();
        if(!user_id) return { error: "Une erreur est survenue." };

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);
        if(!user) return { error: "Une erreur est survenue." };

        if (!value || typeof value !== 'string' 
            || value.length < 3 || value.length > 50
            || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(value) ) {
            return { error: "Le nom fourni n'est pas valide." }
        } 

        const safename = xss(value).trim();
        const name = safename.charAt(0).toUpperCase() + safename.slice(1);

        if(user.name === name){
            return { error: "Le nom fourni n'est pas valide." }
        } 

        db.prepare(`UPDATE users SET name = ? WHERE id = ?`).run(name, user_id);
        
        const userData = await GetUserData();
        
        revalidatePath(`/account`);
        return userData;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// --------------------------------------------------------

export async function ModifyPhone(value) {
    try {
        const db = getDB();
        
        const rate_limiter = await RateLimiter('account');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        }

        const user_id = await UserAuthenticated();
        if(!user_id) return { error: "Une erreur est survenue." };

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);
        if(!user) return { error: "Une erreur est survenue." };
        console.log(user);
        
        if (!value || !/^(05|06|07)\d{8}$/.test(value)) {
            return { error: "Le numéro de téléphone fourni n'est pas valide." }
        } 

        const phone = xss(value)?.trim();

        if(user.phone === phone){
            return { error: "Le numéro de téléphone fourni n'est pas valide." }
        } 

        db.prepare(`UPDATE users SET phone = ? WHERE id = ?`).run(phone, user_id);

        const userData = await GetUserData();
        
        revalidatePath(`/account`);
        return userData;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// --------------------------------------------------------

export async function ModifyPassword(value) {
    try {
        const db = getDB();

        const rate_limiter = await RateLimiter('account');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        }
        
        const user_id = await UserAuthenticated();
        if(!user_id) return { error: "Une erreur est survenue." };

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);
        if(!user) return { error: "Une erreur est survenue." };

        if (!value || value.length < 8 || value.length > 50
            || !/[0-9]/.test(value)
            || !/[A-Z]/.test(value)
            || !/[!@#$%^&*(),.?":{}|<>]/.test(value)
        ) {
            return { error: "Le Mot de passe fourni n'est pas valide." }
        }

        const safepassword = xss(value).trim();

        const samePassword = await bcrypt.compare(safepassword, user.password);

        if(samePassword){
            return { error: "Le nouveau mot de passe doit être différent de l'ancien." }
        }

        const password = await bcrypt.hash(safepassword, 10);
        
        db.prepare(`UPDATE users SET password = ? WHERE id = ?`).run(password, user_id);
        
        revalidatePath(`/account`);
        return {success: true};

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// --------------------------------------------------------

export async function ModifyActive(value) {
    try { 
        const db = getDB();

        const user_id = await UserAuthenticated();
        if(!user_id) return { error: "Une erreur est survenue." };

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);
        if(!user) return { error: "Une erreur est survenue." };

        if (!value || typeof value !== 'string' ) {
            return { error: "Le mot de passe est incorrect." };
        } 

        const password = xss(value).trim();

        const samePassword = await bcrypt.compare(password, user.password);

        if(!samePassword){
            return { error: "Le mot de passe est incorrect." }
        }

        db.prepare(`UPDATE users SET active = ? WHERE id = ?`).run('off',user_id);

        const transaction = db.transaction(() => {
            db.prepare(`UPDATE listings SET state = ? WHERE user_id = ?`).run('off', user_id)
        })

        transaction();

        return { success: true }

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}