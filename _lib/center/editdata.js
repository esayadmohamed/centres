'use server';
import db from "@/_lib/db";
// const sql = require('better-sqlite3');
// const db = sql('main.db');

import xss from 'xss';

import { RateLimiterGet } from '@/_lib/utils/ratelimiter';
import { SanitizeId } from '@/_lib/utils/sanitizedata';
import { UserAuthenticated } from '@/_lib/utils/userauth';
import { revalidatePath } from "next/cache";

// --------------------------------------------------------
// --------------------------------------------------------

export async function AddReview(new_value){

    console.log(new_value);
    return

    // return list of true for user already reviews is success
    //revalidate path
    try{
        const result = await isAuthorized()
        if (result.error) return result;

        const user_id   = result.id;

        const isValidRating = (num) => {
            const parsedNum = Number(num);
            return !isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= 5;
        };

        if (!new_value.listing_id || !new_value.value || !new_value.cleanliness || !new_value.communication || !new_value.location) {
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        if (!isValidRating(new_value.value) ||
            !isValidRating(new_value.cleanliness) ||
            !isValidRating(new_value.communication) ||
            !isValidRating(new_value.location)) {
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const listing_id = new_value.listing_id;
        
        const existingReview = db.prepare("SELECT * FROM reviews WHERE user_id = ? AND listing_id = ?")
        .get(user_id, listing_id);
        if (existingReview) return { error: { server: "Vous avez déjà laissé un avis sur ce centre." } };

        db.prepare(`
            INSERT INTO reviews (user_id, listing_id, value, cleanliness, communication, location)
            VALUES (?, ?, ?, ?, ?, ?)`)
            .run(user_id, Number(listing_id), 
                    Number(new_value.value), 
                    Number(new_value.cleanliness), 
                    Number(new_value.communication), 
                    Number(new_value.location)
                );

        return { success: "Votre avis a été publié avec succès." };    

    } catch (error) {
        return handleDbError(error);
    }
    
}