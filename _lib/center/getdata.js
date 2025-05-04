'use server';
import getDB from "@/_lib/db";

import xss from 'xss';
import { SanitizeId } from '@/_lib/utils/sanitizedata';
import { UserAuthenticated } from '@/_lib/utils/userauth';

// --------------------------------------------------------
// --------------------------------------------------------

export async function GetListing(value_id) {
    try {
        const db = getDB();

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return null;
        }
        
        const [listing] = await db.query("SELECT * FROM listings WHERE id = ? AND view = 'on' AND state = 'on'",  [listing_id]);
        if (!listing || listing.length === 0) {
            return null
        }
        
        const [rows] = await db.query("SELECT name FROM images WHERE listing_id = ?", [listing_id]);
        const images = rows.map(img => img.name);
        const [offers]   = await db.query("SELECT name, icon FROM offers WHERE listing_id = ?", [listing_id]);
        const [services] = await db.query("SELECT name, icon FROM services WHERE listing_id = ?", [listing_id]);
        const [subjects] = await db.query("SELECT name, icon FROM subjects WHERE listing_id = ?", [listing_id]);
        const [levels]   = await db.query("SELECT name, icon FROM levels WHERE listing_id = ?", [listing_id]);
        const [reviews]  = await db.query("SELECT value, cleanliness, communication, location, overall FROM reviews WHERE listing_id = ?", [listing_id]);

        return {
            ...listing[0],
            images,
            offers,
            levels,
            subjects,
            services,
            reviews
        };

    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
}

export async function GetSuggested(value) {
    try {
        const db = getDB();

        if (typeof value !== 'string'){
            console.warn("City value must be a string.");
            return null;
        }

        const city = xss(value).trim()

        const [listings] = await db.query("SELECT * FROM listings WHERE city = ? AND view = 'on' AND state = 'on' LIMIT 3", [city]);
        if (listings.length === 0) { 
            return [];
        }
        
        const listings_ids = listings.map(listing => listing.id);

        const [images]  = await db.query(`SELECT * FROM images WHERE listing_id IN (?)`, [listings_ids]);
        const [reviews] = await db.query(`SELECT listing_id, overall FROM reviews WHERE listing_id IN (?)`, [listings_ids]);

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
            (listing.levels + listing.subjects + listing.services + listing.offers + listing.images) === 5
        )
        .map(listing => ({
            id: listing.id,
            name: listing.name,
            city: listing.city,
            hood: listing.hood,
            images: listing.pictures,
            overall: listing.overall,
        }));
        
        const sortedListings = filteredListings.sort((a, b) => b.overall - a.overall);

        return sortedListings;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function getUserReview(center_id) {    
    try {
        const db = getDB();

        const user_id = await UserAuthenticated();
        if(!user_id || user_id.error) {
            return null
        }

        const [listings] = await db.query( "SELECT * FROM reviews WHERE user_id = ? AND listing_id = ?", 
            [user_id, center_id]);
        
        if (listings.length === 0) return null
        return {success: true}

    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
}

export async function getReviewsList() {    
    try{ 
        const db = getDB();

        const [rows] = await db.query("SELECT * FROM reviewslist");
        if (rows.length === 0) {
            return []; 
        }
        return rows
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}
