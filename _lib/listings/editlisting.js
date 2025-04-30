'use server'
import db from "@/_lib/db";

// const sql = require('better-sqlite3');
// const db = sql('main.db');
// db.pragma('foreign_keys = ON');

import { revalidatePath } from "next/cache";

import { UserAuthorized } from "@/_lib/utils/userauth";
import { SanitizeId } from "@/_lib/utils/sanitizedata";

import { RateLimiter } from "@/_lib/utils/ratelimiter";


// ----------------------------------------------

export async function removeListing (value_id) { 
    try {
        const rate_limiter = await RateLimiter('create');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return {error: "Une erreur est survenue. Veuillez réessayer plus tard."}; 
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return {error: "Une erreur est survenue. Veuillez réessayer plus tard."}; 
        }
        
        //------------------------------------------------------------------------- 

        db.prepare("DELETE FROM listings WHERE id = ?").run(listing_id);
        
        revalidatePath(`/listings`);

        return { success: true };
       
    } catch (error) {
        console.error("Database error:", error);
        return {error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function toggleListing (value_id){
    try {
        const rate_limiter = await RateLimiter('create');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        }
        
        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return {error: "Une erreur est survenue. Veuillez réessayer plus tard."}; 
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return {error: "Une erreur est survenue. Veuillez réessayer plus tard."}; 
        }

        //------------------------------------------------------------------------- 

        const result = db.prepare("SELECT view FROM listings WHERE id = ?").get(listing_id);
        if(result){
            if(result.view === 'on'){
                db.prepare(`UPDATE listings SET view = ? WHERE id = ?`).run('off', listing_id);
            } else {
                db.prepare(`UPDATE listings SET view = ? WHERE id = ?`).run('on', listing_id);
            }    
            
            revalidatePath(`/listings`);        
            return { success: true }
        } else{
            return {error: "Une erreur est survenue. Veuillez réessayer plus tard."};
        }

    } catch (error) {
        console.error("Database error:", error);
        return {error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

