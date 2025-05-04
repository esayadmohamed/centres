'use server';
import getDB from "@/_lib/db";

import { UserAuthenticated, UserAuthorized } from '@/_lib/utils/userauth';
import { revalidatePath } from "next/cache";

// --------------------------------------------------------
// --------------------------------------------------------

async function verifyObject(data) {
    try {
        if(!data) return null
        
        if(typeof data !== 'object'){
            console.warn("Data must be an object.");
            return null
        }

        if(Object.prototype.toString.call(data) !== '[object Object]'){
            console.warn("Data must be an object.");
            return null;
        }

        if(!Object.hasOwn(data, 'listing_id') || !Object.hasOwn(data, 'value') || !Object.hasOwn(data, 'cleanliness')
            || !Object.hasOwn(data, 'communication') || !Object.hasOwn(data, 'location')){
            console.warn("Filter object must contain 5 review items");
            return null
        }

        if ( typeof data.listing_id !== 'number' || typeof data.value !== 'number' ||
            typeof data.cleanliness !== 'number' || typeof data.communication !== 'number' ||
            typeof data.location !== 'number' ) {
            console.warn("Object values must be a number.");
            return null;
        }

        return{success: true}

    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
}

export async function AddReview(data){
    try{
        const db = getDB();

        const user_id = await UserAuthenticated()
        if (!user_id) return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }

        const obj = await verifyObject(data);
        if(!obj) return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }

        const isValidRating = (num) => {
            const parsedNum = Number(num);
            return !isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= 5;
        };

        if (!isValidRating(data.value) ||
            !isValidRating(data.cleanliness) ||
            !isValidRating(data.communication) ||
            !isValidRating(data.location)) {
                return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }
        }

        const listing_id = data.listing_id;
        
        const [existingReview] = await db.query("SELECT * FROM reviews WHERE user_id = ? AND listing_id = ?", [user_id, listing_id]);
        if (existingReview.length !== 0) {
            return { error: "Vous avez déjà laissé un avis sur ce centre." }
        }

        await db.query(`INSERT INTO reviews (user_id, listing_id, value, cleanliness, communication, location)
            VALUES (?, ?, ?, ?, ?, ?)`, 
                [user_id, Number(listing_id), Number(data.value), Number(data.cleanliness), 
                Number(data.communication), Number(data.location)]);


        revalidatePath(`/centres/${listing_id}`); 

        return { success: "Votre avis a été publié avec succès." };    

    } catch (error) {
        console.error("Database error:", error);
        return { error: "1 = Une erreur est survenue. Veuillez réessayer plus tard." }
    }
    
}