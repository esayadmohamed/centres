'use server'
import getDB from "@/_lib/db";

import { revalidatePath } from "next/cache";
import { UserAuthorized } from "@/_lib/utils/userauth";
import { SanitizeId } from "@/_lib/utils/sanitizedata";
import { RateLimiter } from "@/_lib/utils/ratelimiter";

import { userListings } from "./test";

const db = getDB();

// ----------------------------------------------

export async function removeListing (value_id) { 
    try {
        const rate_limiter = await RateLimiter('create');
        if(!rate_limiter){
            return null;
        }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return null;
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return null; 
        }
        
        await db.execute("DELETE FROM listings WHERE id = ?", [listing_id]);
        
        revalidatePath(`/listings`);

        return {success: true}

    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
}

export async function toggleListing (value_id){
    try {
        const rate_limiter = await RateLimiter('create');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard." };
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

        const [rows] = await db.execute("SELECT view FROM listings WHERE id = ?",[listing_id]);
        const result = rows[0] || null;

        if(result){
            if(result.view === 'on'){
                await db.query("UPDATE listings SET view = ? WHERE id = ?", ['off', listing_id]);
            } else {
                await db.query("UPDATE listings SET view = ? WHERE id = ?", ['on', listing_id]);
            }    
            
            revalidatePath(`/listings`);     
            
            const listings = await userListings();
            
            return listings;
        } else{
            return {error: "Une erreur est survenue. Veuillez réessayer plus tard."};
        }

    } catch (error) {
        console.error("Database error:", error);
        return {error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}
