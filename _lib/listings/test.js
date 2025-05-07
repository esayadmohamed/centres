import getDB from "@/_lib/db";

import { UserAuthenticated } from "@/_lib/utils/userauth";

import { SanitizeId } from "@/_lib/utils/sanitizedata";

// ----------------------------------------------------
// ----------------------------------------------------

export async function userListings() {
    try {
        const db = getDB();

        const user_id = await UserAuthenticated();
        if(!user_id) return [];

        const [listings] = await db.query("SELECT * FROM listings WHERE user_id = ?",[user_id]); //show all //AND state IN ('on', 'none', 'under')
        if (listings.length === 0) { 
            return [];
        }

        const listings_ids = listings.map(listing => listing.id);

        const [images] = await db.query(`SELECT * FROM images WHERE listing_id IN (?)`, [listings_ids]);
        const [reviews] = await db.query(`SELECT listing_id, overall FROM reviews WHERE listing_id IN (?)`, [listings_ids]);
        const [suggestedhoods] = await db.query(`SELECT * FROM suggestedhoods WHERE listing_id IN (?)`, [listings_ids]);

        const reviewsByCenter = {};
        listings.forEach(listing => {
            const centerReviews = reviews
                .filter(review => review.listing_id=== listing.id)
                .map(review => review.overall);

            reviewsByCenter[listing.id] = centerReviews.length > 0 
                ? centerReviews.reduce((sum, val) => sum + val, 0) / centerReviews.length 
                : null;
        });

        const listingsWithDetails = listings.map(listing => {
            const listingImages   = images.filter(image => image.listing_id === listing.id).map(image => image.name);
            const draft = listing.offers + listing.services + listing.subjects + listing.levels + listing.images;
            const suggestedrows  = suggestedhoods.filter(hood => hood.listing_id === listing.id).map(hood => hood.hood);
            const suggestedhood = suggestedrows[0] || null; 

            return {
                ...listing,
                images: listingImages,
                overall: reviewsByCenter[listing.id],
                suggesthood: suggestedhood,
                draft 
            };
        });
           
        // console.log(listingsWithDetails);
        
        return listingsWithDetails

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function userListing(value_id) {
    try {
        const db = getDB();

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return {error: true}; 
        }

        const user_id = await UserAuthenticated();
        if(!user_id) return { error: true };

        const [listing] = await db.execute("SELECT * FROM listings WHERE id = ? AND  user_id = ? AND state IN ('on', 'none')",  [listing_id, user_id]);

        if (listing.length === 0) { // allow user to edit blocked listings || listing.state === 'off'
            return { error: true };
        } 

        const draft = listing.offers+listing.services+listing.subjects+listing.levels+listing.images;

        const [rows] = await db.query("SELECT name FROM images WHERE listing_id = ?", [listing_id]);
        const images = rows.map(img => img.name);
        const [offers]   = await db.query("SELECT name, icon FROM offers WHERE listing_id = ?", [listing_id]);
        const [services] = await db.query("SELECT name, icon FROM services WHERE listing_id = ?", [listing_id]);
        const [subjects] = await db.query("SELECT name, icon FROM subjects WHERE listing_id = ?", [listing_id]);
        const [levels]   = await db.query("SELECT name, icon FROM levels WHERE listing_id = ?", [listing_id]);
        const [reviews]  = await db.query("SELECT value, cleanliness, communication, location, overall FROM reviews WHERE listing_id = ?", [listing_id]);
        const [newhood]   = await db.query("SELECT * FROM suggestedhoods WHERE listing_id = ?", [listing_id]);

        return { 
            listing,
            images,
            offers,
            levels,
            draft,
            subjects,
            services,
            reviews,
            newhood
        };

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }

}

// ----------------------------------------------------
// ----------------------------------------------------


export async function getCitiesList() {
    try{ 
        const db = getDB();

        const [cities] = await db.query("SELECT * FROM cities");
        
        if (cities.length === 0) return []; 
        
        return cities

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function getHoodsList() {
    try{ 
        const db = getDB();

        const [hoods] = await db.query("SELECT * FROM neighborhoods");

        if (hoods.length === 0) return []; 

        return hoods

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// ----------------------------------------------------
// ----------------------------------------------------

export async function getOffersList() {    
    try{ 
        const db = getDB();

        const [rows] = await db.query("SELECT * FROM offerslist");

        if (rows.length === 0) return []; 

        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function getServicesList() {
    try{ 
        const db = getDB();

        const [rows] = await db.query("SELECT * FROM serviceslist");

        if (rows.length === 0) return []; 

        return rows
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function getSubjectsList() {    
    try{ 
        const db = getDB();

        const [rows] = await db.query("SELECT * FROM subjectslist");

        if (rows.length === 0) return []; 

        return rows
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function getLevelsList() {
    try{ 
        const db = getDB();

        const [rows] = await db.query("SELECT * FROM levelslist");

        if (rows.length === 0) return []; 

        return rows
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function getReviewsList() {    
    try{ 
        const db = getDB();

        const [rows] = await db.query("SELECT * FROM reviewslist");

        if (rows.length === 0) return []; 

        return rows
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// ----------------------------------------------------
// ----------------------------------------------------









// const listing = db.prepare("SELECT * FROM listings WHERE id = ? AND user_id = ?")
//     .get(listing_id, user_id); //3_Authorise user
// if (!listing) {
//     console.log(`user_id ${user_id} is not authorized`, listing_id);
//     return { error: true };
// }