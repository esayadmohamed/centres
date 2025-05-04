'use server';
import getDB from "@/_lib/db";

import xss from 'xss';
import { SanitizeId } from '@/_lib/utils/sanitizedata';
// import { RateLimiterGet } from '@/_lib/utils/ratelimiter';

// --------------------------------------------------------
// --------------------------------------------------------

export async function AllListings() {
    try {
        const db = getDB();

        const [listings] = await db.query("SELECT * FROM listings WHERE view = 'on' AND state = 'on' LIMIT 12");
        if (listings.length === 0) { 
            return [];
        }
        
        const listings_ids = listings.map(listing => listing.id);

        const [images] = await db.query(`SELECT * FROM images WHERE listing_id IN (?)`, [listings_ids]);
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
        
        const sortedListings = filteredListings.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });

        return sortedListings;
        
    } catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
    }
}

export async function AllCities() {
    try{ 
        const db = getDB();

        const [cities] = await db.query("SELECT * FROM cities");
        if (cities.length === 0) {
            return []; 
        }
        return cities
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function AllHoods() {
    try{ 
        const db = getDB();

        const [neighborhoods] = await db.query("SELECT * FROM neighborhoods");
        if (neighborhoods.length === 0) {
            return []; 
        }
        return neighborhoods
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// --------------------------------------------------------
// --------------------------------------------------------

async function verifyObject(data) {
    try {
        const db = getDB();

        if(!data) return null
        
        if(typeof data !== 'object'){
            console.warn("Data must be an object.");
            return null
        }

        if(Object.prototype.toString.call(data) !== '[object Object]'){
            console.warn("Data must be an object.");
            return null;
        }

        if(!Object.hasOwn(data, 'sort') || !Object.hasOwn(data, 'city') || !Object.hasOwn(data, 'hood')){
            console.warn("Filter object must contain 'sort', 'city' and 'hood' properties.");
            return null
        }

        if (typeof data.sort !== 'string' || typeof data.city !== 'string' || typeof data.hood !== 'string'){
            console.warn("Object values must be a string.");
            return null;
        }

        const sort = xss(data.sort).trim()
        const city = xss(data.city).trim()
        const hood = xss(data.hood).trim()

        if (!["a-z", "rank", "verification"].includes(sort)) {
            console.warn(`Invalid sort value: ${sort}`);
            return null;
        }

        if(city !== ''){ //skip if city is empty
            const [city_id] = await db.query("SELECT id FROM cities WHERE name = ?", [city]);
            
            if (city_id.length === 0) { 
                console.warn(`Invalid city value: ${city}`);
                return null;
            }            

            if(hood !== ''){ //skip if hood is empty
                const [is_hood] = await db.query("SELECT * FROM neighborhoods WHERE city_id = ? AND NAME = ?", [city_id[0].id, hood]);
                if (is_hood.length === 0) { 
                    console.warn(`Invalid hood value: ${hood}`);
                    return null;
                }
            }
        }

        return{success: true}

    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
}

export async function FilterListings(data){ 
    try {
        const db = getDB();
        
        const obj = await verifyObject(data)
        if(!obj) {
            console.log('Error: object verification failed');
            return {error: "Une erreur est survenue. Veuillez réessayer plus tard."};
        }

        const limit = 12;
        const sort = xss(data.sort).trim()
        const city = xss(data.city).trim()
        const hood = xss(data.hood).trim()

        const [listings] = await (async () => {
            switch (true) {
                case city === '':
                    return db.query("SELECT * FROM listings WHERE view = 'on' AND state = 'on' LIMIT ?", [limit]);
                
                case hood === '':
                    return db.query("SELECT * FROM listings WHERE  city = ? AND view = 'on' AND state = 'on' LIMIT ?", [city, limit]);
                
                case hood !== '':
                    return db.query("SELECT * FROM listings WHERE city = ? AND hood = ? AND view = 'on' AND state = 'on' LIMIT ?", [city, hood, limit]);

                default:
                    return db.query("SELECT * FROM listings WHERE view = 'on' AND state = 'on' LIMIT ?", [limit]);
            }
        })();
                   
        if(listings.length === 0) {
            return {error: "Aucune annonce n'a été trouvée."}
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

        switch (sort) {
            case 'a-z':
                return filteredListings.sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                });
            
            case 'rank':
                return filteredListings.sort((a, b) => b.overall - a.overall);
    
            default:
                return filteredListings;
        }   
         
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// --------------------------------------------------------
// --------------------------------------------------------

export async function GetMoreListings(offset = 0, data){ 
    try {
        const db = getDB();
 
        const obj = await verifyObject(data)
        if(!obj) {
            console.log('Error: object verification failed');
            return {error: true};
        }

        const num = await SanitizeId(offset)
        if(!num) {
            console.log('Error: limit intiger verification failed');
            return {error: true};
        }

        const limit = 12;
        const sort = xss(data.sort).trim()
        const city = xss(data.city).trim()
        const hood = xss(data.hood).trim()

        const [listings] = await (async () => {
            switch (true) {
                case city === '':
                    return db.query("SELECT * FROM listings WHERE view = 'on' AND state = 'on' LIMIT ? OFFSET ?", [limit, offset]);
                
                case hood === '':
                    return db.query("SELECT * FROM listings WHERE city = ? AND view = 'on' AND state = 'on' LIMIT ? OFFSET ?", [city, limit, offset]);
                
                case hood !== '':
                    return db.query("SELECT * FROM listings WHERE city = ? AND hood = ? AND view = 'on' AND state = 'on' LIMIT ? OFFSET ?", [city, hood, limit, offset]);

                default:
                    return db.query("SELECT * FROM listings WHERE view = 'on' AND state = 'on' LIMIT ? OFFSET ?", [limit, offset]);
            }
        })();      

        if(listings.length === 0) {
            return {error: "Il n'y a plus d'annonces à afficher."}
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

        switch (sort) {
            case 'a-z':
                return filteredListings.sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                });
            
            case 'rank':
                return filteredListings.sort((a, b) => b.overall - a.overall);
    
            default:
                return filteredListings;
        }   
              
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}


