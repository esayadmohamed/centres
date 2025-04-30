'use server'
import db from "@/_lib/db";

// const sql = require('better-sqlite3');
// const db = sql('main.db');
// db.pragma('foreign_keys = ON');

import xss from "xss";
import { SanitizeId } from "@/_lib/utils/sanitizedata";
import { revalidatePath } from "next/cache";
import { UserAuthorized } from "@/_lib/utils/userauth";


export async function GetAllListings() {    
    try {
        const listings = db.prepare("SELECT * FROM listings").all();
        if (listings.length === 0) { 
            return [];
        }
        
        const listings_ids = listings.map(listing => listing.id);

        const images  = db.prepare(`SELECT * FROM images WHERE listing_id IN (${listings_ids.join(",")})`).all();
        const reviews = db.prepare(`SELECT listing_id, overall FROM reviews WHERE listing_id IN (${listings_ids})`).all();
        
        const reviewsByCenter = {};
        listings.forEach(listing => {
            const centerReviews = reviews
                .filter(review => review.listing_id === listing.id)
                .map(review => review.overall);

            reviewsByCenter[listing.id] = centerReviews.length > 0 
                ? centerReviews.reduce((sum, val) => sum + val, 0) / centerReviews.length 
                : null;
        });
        
        const allListings  = listings.map(listing => {
            const listingImages   = images.filter(image => image.listing_id === listing.id).map(image => image.name);
            return {
                ...listing,
                pictures: listingImages,
                overall: reviewsByCenter[listing.id]
            };
        });

        const filteredListings = allListings.filter(listing => 
            listing.view === "on" &&
            (listing.levels + listing.subjects + listing.services + listing.offers + listing.images) === 5
        )
        .map(listing => ({
            id: listing.id,
            user_id: listing.user_id,
            name: listing.name,
            city: listing.city,
            hood: listing.hood,
            info: listing.info,
            phone: listing.phone,
            state: listing.state,
            images: listing.pictures,
            overall: listing.overall,
            created_at: listing.created_at
        }));

        return filteredListings;
        
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function GetAllUsers() {    
    try {
        const users = db.prepare("SELECT * FROM users").all();
        if (users.length === 0) { 
            return [];
        }

        const users_list = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            active: user.active,
            created_at: user.created_at
        }));


        return users_list;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function ApproveListing(value_id){
    try {
        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return {error:true}; 
        }

        const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(listing_id);
        if (!listing) {
            console.log(listing_id, 'listing not found');
            return { error:`Listing: ${listing_id} not found` };
        }

        db.prepare(`UPDATE listings SET state = ? WHERE id = ?`).run('on', listing_id)

        revalidatePath(`/dashboard`);
        return { success: true };

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function SuspendListing(value_id){
    try {
        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return {error:true}; 
        }

        const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(listing_id);
        if (!listing) {
            console.log(listing_id, 'listing not found');
            return { error:`Listing: ${listing_id} not found` };
        }

        db.prepare(`UPDATE listings SET state = ? WHERE id = ?`).run('off', listing_id)

        revalidatePath(`/dashboard`);
        return { success: true };

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function ApproveUser(value_id){
    try {
        const user_id = await SanitizeId(value_id)
        if(!user_id){ 
            return {error:"Id value is not a valid Intiger"}; 
        }

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);
        if (!user) {
            console.log(user_id, 'user not found');
            return { error:`User: ${user_id} not found` };
        }

        db.prepare(`UPDATE users SET active = ? WHERE id = ?`).run('on', user_id)

        revalidatePath(`/dashboard`);
        return { success: true };

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function SuspendUser(value_id){
    try {
        const user_id = await SanitizeId(value_id)
        if(!user_id){ 
            return {error:"Id value is not a valid Intiger"}; 
        }

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);
        if (!user) {
            console.log(listing_id, 'user not found');
            return { error:`User: ${user_id} not found` };
        }

        db.prepare(`UPDATE users SET active = ? WHERE id = ?`).run('off', user_id)

        revalidatePath(`/dashboard`);
        return { success: true };

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// ------------------------------------------------

async function GetUser(email, token) {
    
    const row = db.prepare("SELECT * FROM users WHERE email = ? AND token = ?").get(email, token);
    if (!row) return null;
    
    return {
        id: row.id,
        name: row.name || '',
        email: row.email || '',
        number: row.number || '',
        token: row.token || '',
        password: row.password || '',
    };
    
}









import fs from 'node:fs/promises';
import path from 'node:path';

import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import Nextauth from "@/pages/api/auth/[...nextauth]";



const handleDbError = (error) => {
    console.error("Database error:", error);
    return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
};



async function isAuthorized() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const userToken = session.user.name;
        const userEmail = session.user.email;
        const user = await GetUser(userEmail, userToken); // get user

        if (!user) {
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard."} };
        }

        return user;

    } catch (error) {
        return handleDbError(error);
    }

}

// -----------------------------------

export async function GetUserData(){

    const result = await isAuthorized()
    if (result.error) {
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
    }

    const user = {
        name: result.name,
        email: result.email,
        number: result.number
    }

    return user

}

// -----------------------------------

export async function ModifyUsername(new_value) {
    try {
        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return {error: "Une erreur est survenue. Veuillez réessayer plus tard."}; 
        }
        
        const safename = xss(new_value)?.trim();
        const name = safename.charAt(0).toUpperCase() + safename.slice(1);

        if (!name || name.length < 3) {
            return { error: { server: "Le nom fourni n'est pas valide."} }
        } else if (name.length > 50) {
            return { error: { server: "Le nom ne doit pas dépasser 50 caractères." } };
        } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(name)) {
            return { error: { server: "Le nom fourni n'est pas valide" } }
        }

        db.prepare(`UPDATE users SET name = ? WHERE id = ?`).run(name, user_id);
        
        // const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);

        // const date = new Date(user.created_at);
        // const formattedDate = `${date.toLocaleString('fr-FR', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('fr-FR', { month: 'long' }).slice(1)} ${date.getFullYear()}`;

        // return {
        //     name: user.name || '',
        //     email: user.email || '',
        //     number: user.phone || '',
        //     created_at: formattedDate || ''
        // };

        return{success:true}

    } catch (error) {
        return handleDbError(error);
    }
}

export async function ModifyPhone(new_value) {
    try {
        const result = await isAuthorized()
        if (result.error) return result;

        const user_id = result.id;

        const phone = xss(new_value)?.trim();

        if (!phone) {
            return { error: { phone: "Le numéro de téléphone fourni n'est pas valide"} }
        } else if (!/^(05|06|07)\d{8}$/.test(phone)){ 
            return { error: { phone: "Le numéro de téléphone fourni n'est pas valide"} }
        }

        db.prepare(`UPDATE users SET number = ? WHERE id = ?`).run(phone, user_id);
        
        return { success: "Votre Numéro de téléphone a été modifié avec succès." }

    } catch (error) {
        return handleDbError(error);
    }
}

// -----------------------------------

function validatePassword(password) {
    let errors = {};

    if (password.length < 8) {
        errors.password = "Mot de passe invalide";
        errors.long = "Au moins 8 caractères";
    }
    if (!/[0-9]/.test(password)) {
        errors.password = "Mot de passe invalide";
        errors.number = "Ajouter au moins un chiffre (1, 2, 3 ...)";
    }
    if (!/[A-Z]/.test(password)) {
        errors.password = "Mot de passe invalide";
        errors.uppercase = "Ajouter au moins une lettre majuscule (A, B, C ...)";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.password = "Mot de passe invalide";
        errors.character = "Ajouter au moins un caractère spécial (@, -, / ...)";
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

export async function ModifyPassword(new_value) {
    try {
        const result = await isAuthorized()
        if (result.error) return result;

        const user_id = result.id;
        const user_password = result.password;

        const safepassword = xss(new_value)?.trim();

        const errors = validatePassword(safepassword);
        if (errors) return { error: errors };
        
        const samePassword = await bcrypt.compare(safepassword, user_password);

        if(samePassword){
            return { error: { server: "Le nouveau mot de passe doit être différent de l'ancien."} }
        }

        const password = await bcrypt.hash(safepassword, 10);
        
        db.prepare(`UPDATE users SET password = ? WHERE id = ?`).run(password, user_id);
        
        return { success: "Votre Mot de passe a été modifié avec succès." }

    } catch (error) {
        return handleDbError(error);
    }
}

// -----------------------------------

export async function ModifyActive(value) {
    try {  
        const result = await isAuthorized()
        if (result.error) return result;
        
        const user_id = result.id;
        const user_password = result.password;

        const password = xss(value)

        if (!password || password.length < 3 || password.length > 50) {
            return { error: { server: "Le mot de passe est incorrect."} }
        } 
        
        const samePassword = await bcrypt.compare(password, user_password);

        if(!samePassword){
            return { error: { server: "Le mot de passe est incorrect."} }
        }

        db.prepare(`UPDATE users SET active = ? WHERE id = ?`).run('off',user_id);
        
        return { success: "Votre compte a été désactivé avec succès." }
    } catch (error) {
        return handleDbError(error);
    }
}