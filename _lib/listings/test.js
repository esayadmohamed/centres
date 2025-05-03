import getDB from "@/_lib/db";

import { UserAuthenticated } from "../utils/userauth";

export async function userListings() {
    try {
        const db = getDB();

        const user_id = await UserAuthenticated();
        if(!user_id) [];

        const [listings] = await db.query("SELECT * FROM listings WHERE user_id = ?",[user_id]);
        if (listings.length === 0) { 
            return [];
        }

        const listings_ids = listings.map(listing => listing.id);

        const [images] = await db.query(`SELECT * FROM images WHERE listing_id IN (?)`, [listings_ids]);
        const [reviews] = await db.query(`SELECT listing_id, overall FROM reviews WHERE listing_id IN (?)`, [listings_ids]);

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

            return {
                ...listing,
                images: listingImages,
                overall: reviewsByCenter[listing.id],
                draft 
            };
        });
           
        
        return listingsWithDetails
    } catch (error) {
        return handleDbError(error);
    }
}










// const [suggestedhoods] = await db.query(`SELECT * FROM suggestedhoods WHERE listing_id IN (?)`, [listings_ids]);
// const reviews = db.prepare(`
// SELECT listing_id, overall FROM reviews WHERE listing_id IN (${listings_ids})`).all();
// const images = db.prepare(` 
// SELECT * FROM images WHERE listing_id IN (${listings_ids.join(",")})`).all();
// const suggestedhoods = db.prepare(`
//     SELECT * FROM suggestedhoods WHERE listing_id IN (${listings_ids})`).all();
// console.log(suggestedhood);
// const suggestedhood  = suggestedhoods.filter(hood => hood.listing_id === listing.id).map(hood => hood.hood);
// suggesthood: suggestedhood[0],
// console.log(listingsWithDetails[0]);