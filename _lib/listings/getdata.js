'use server';

// import db from "@/_lib/db";

// const sql = require('better-sqlite3');
// const db = sql('main.db');

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import xss from "xss";
import { SanitizeId } from "@/_lib/utils/sanitizedata";
import { UserAuthenticated } from "../utils/userauth";

import { revalidatePath } from "next/cache";

import { RateLimiterGet } from "@/_lib/utils/ratelimiter";

// --------------------------------------------------

import { getSessionData } from "../utils/session";


const handleDbError = (error) => {
    console.error("Database error:", error);
    return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
};

async function GetUser(email, token) {
    try {
        const row = db.prepare("SELECT * FROM users WHERE email = ? AND token = ?").get(email, token);
        if (!row) return null;
        return {
            id: row.id,
            name: row.name || '',
            email: row.email || '',
            number: row.number || '',
            token: row.token || ''
        };
    } catch (error) {
        return handleDbError(error);
    }
}

// async function isAuthenticated(){
//     try {
//         const session = await getServerSession(authOptions);

//         if (!session || !session.user) {
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }

//         const userToken = session.user.token;
//         const userEmail = session.user.email;

//         const user = await GetUser(userEmail, userToken); 

//         if (!user) {
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard."} };
//         }

//         return user.id;

//     } catch (error) {
//         return handleDbError(error);
//     }
// }

// --------------------------------------------------
// --------------------------------------------------

export async function userListing(value_id) {
    // console.log(value_id);
    

    try {
        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return {error:true}; 
        }

        const user_id = await isAuthenticated(); //2_Authenticate user
        if(user_id.error) {
            console.log('user is not authenticated', listing_id);
            return { error: true };
        }

        const listing = db.prepare("SELECT * FROM listings WHERE id = ? AND user_id = ?")
            .get(listing_id, user_id); //3_Authorise user
        if (!listing) {
            console.log(`user_id ${user_id} is not authorized`, listing_id);
            return { error: true };
        }
        
        if (listing.state === 'off') { //4_Check if Listing is not suspended
            return { error: true };
        } 

        const draft = listing.offers+listing.services+listing.subjects+listing.levels+listing.images;

        const images   = db.prepare("SELECT name FROM images WHERE listing_id = ?").all(listing_id).map(img => img.name);
        const offers   = db.prepare("SELECT name, icon FROM offers WHERE listing_id = ?").all(listing_id);
        const services = db.prepare("SELECT name, icon FROM services WHERE listing_id = ?").all(listing_id);
        const subjects = db.prepare("SELECT name, icon FROM subjects WHERE listing_id = ?").all(listing_id);
        const levels   = db.prepare("SELECT name, icon FROM levels WHERE listing_id = ?").all(listing_id);
        const reviews  = db.prepare("SELECT value, cleanliness, communication, location, overall FROM reviews WHERE listing_id = ?").all(listing_id);
        const newhood  = db.prepare("SELECT * FROM suggestedhoods WHERE listing_id = ?").all(listing_id);

        return { 
            ...listing,
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
        return handleDbError(error);
    }

}

export async function userListings(db) {

    try {

        const user_id = await getSessionData();
        console.log('user_id', user_id);

        // if(user_id.error) {
        //     return { error: true };
        // }

        
        return []
        

        // const listings = db.prepare("SELECT * FROM listings WHERE user_id = ?").all(user_id);

        const [listings] = await db.query("SELECT * FROM listings WHERE user_id = ?",[user_id]);
        if (listings.length === 0) { 
            return [];
        }

        const listings_ids = listings.map(listing => listing.id);

        const [images] = await db.query(`SELECT * FROM images WHERE listing_id IN (?)`, [listings_ids]);
        const [reviews] = await db.query(`SELECT listing_id, overall FROM reviews WHERE listing_id IN (?)`, [listings_ids]);
        const [suggestedhoods] = await db.query(`SELECT * FROM suggestedhoods WHERE listing_id IN (?)`, [listings_ids]);

        // const reviews = db.prepare(`
            // SELECT listing_id, overall FROM reviews WHERE listing_id IN (${listings_ids})`).all();

        // const images = db.prepare(` 
            // SELECT * FROM images WHERE listing_id IN (${listings_ids.join(",")})`).all();

        // const suggestedhoods = db.prepare(`
        //     SELECT * FROM suggestedhoods WHERE listing_id IN (${listings_ids})`).all();


        // console.log(suggestedhood);

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
            const suggestedhood  = suggestedhoods.filter(hood => hood.listing_id === listing.id).map(hood => hood.hood);
                        
            return {
                ...listing,
                images: listingImages,
                overall: reviewsByCenter[listing.id],
                suggesthood: suggestedhood[0],
                draft 
            };
        });
           
        // console.log(listingsWithDetails[0]);
        
        return listingsWithDetails
    } catch (error) {
        return handleDbError(error);
    }
}

export async function allListings() {
    //validate Limit as an id
    // console.log(Limit);
    
    try {
        // const rate_limiter = await RateLimiterGet('home');
        // if(!rate_limiter){
        //     console.log('------------------- rate limit');
        //     return [];
        // } 

        const listings = db.prepare("SELECT * FROM listings").all();
        if (listings.length === 0) { 
            return [];
        }
        
        // if(Limit >= 8 || listings.length <= Limit){ //hit the limit or slow down
        //     return {error: 'Aucune annonce à afficher'}
        // }

        //create a system where when user reaches a limit it slows down

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
            name: listing.name,
            city: listing.city,
            hood: listing.hood,
            verified: listing.state,
            images: listing.pictures,
            overall: listing.overall,
        }));

        return filteredListings;
        
    } catch (error) {
        return handleDbError(error);
    }
}

export async function Listing(value_id) {
    try {
        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: { server: "404: La page est introuvable."} };
        }
        
        const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(listing_id);
        if (!listing) {
            return { error: { server: "404: La page est introuvable." } };
        }

        const draft = listing.offers+listing.services+listing.subjects+listing.levels+listing.images;

        if (listing.view === 'off' || draft < 5 ) {//|| state === 'none'
            return { error: { server: "404: La page est introuvable." } };
        } 

        const images   = db.prepare("SELECT name FROM images WHERE listing_id = ?").all(listing_id).map(img => img.name);
        const offers   = db.prepare("SELECT name, icon FROM offers WHERE listing_id = ?").all(listing_id);
        const services = db.prepare("SELECT name, icon FROM services WHERE listing_id = ?").all(listing_id);
        const subjects = db.prepare("SELECT name, icon FROM subjects WHERE listing_id = ?").all(listing_id);
        const levels   = db.prepare("SELECT name, icon FROM levels WHERE listing_id = ?").all(listing_id);
        const reviews  = db.prepare("SELECT value, cleanliness, communication, location, overall FROM reviews WHERE listing_id = ?").all(listing_id);

        return {
            ...listing,
            images,
            offers,
            levels,
            draft,
            subjects,
            services,
            reviews
        };

    } catch (error) {
        return handleDbError(error);
    }
}


export async function allFilteredListings(sort, filter) {
    
    try {
        // const data = await verifyAction(sort, filter)
        // if(!data) return [] 

        const rate_limiter = await RateLimiterGet('home');
        if(!rate_limiter){
            return [];
        }

        const data_sort = xss(sort).trim()
        const data_city = xss(filter.city).trim()
        const data_hood = xss(filter.hood).trim()

        const listings = db.prepare("SELECT * FROM listings WHERE city = ? and Hood = ?").all(data_city, data_hood);
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
            listing.view === "on" && (listing.state === 'none' || listing.state === 'on') &&
            (listing.levels + listing.subjects + listing.services + listing.offers + listing.images) === 5
        )
        .map(listing => ({
            id: listing.id,
            name: listing.name,
            city: listing.city,
            neighborhood: listing.hood,
            verified: listing.state,
            images: listing.pictures,
            overall: listing.overall,
        }));

        switch (data_sort) {
            case 'a-z':
                return filteredListings.sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                });
            
            case 'rank':
                return filteredListings.sort((a, b) => b.overall - a.overall); // Descending order (higher rank first)
    
            case 'verified':
                return filteredListings.sort((a, b) => {
                    if (a.verified === 'on' && b.verified === 'none') return -1;
                    if (a.verified === 'none' && b.verified === 'none') return 1;
                    return 0;
                });
    
            default:
                revalidatePath(`/`);
                return filteredListings;
        }

    } catch (error) {
        return handleDbError(error);
    }
}







// --------------------------------------------------
// --------------------------------------------------


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

        if(!Object.hasOwn(data, 'sort') || !Object.hasOwn(data, 'city') || !Object.hasOwn(data, 'hood')){
            console.warn("Filter object must contain 'sort', 'city' and 'hood' properties.");
            return null
        }

        if (typeof data.sort !== 'string' || typeof data.city !== 'string' || typeof data.hood !== 'string'){
            console.warn("Object values must be a string.");
            return null;
        }

        // || filter.sort.trim() === '' //|| filter.city.trim() === '' //|| filter.hood.trim() === ''

        const sort = xss(data.sort).trim()
        const city = xss(data.city).trim()
        const hood = xss(data.hood).trim()

        if (!["a-z", "rank", "verification"].includes(sort)) {
            console.warn(`Invalid sort value: ${sort}`);
            return null;
        }
        if(city !== ''){ //skip if city is empty
            const city_id = db.prepare("SELECT id FROM cities WHERE name = ?").get(city);
            if (!city_id) { 
                console.warn(`Invalid city value: ${city}`);
                return null;
            }
            if(hood !== ''){ //skip if hood is empty
                const is_hood = db.prepare("SELECT * FROM neighborhoods WHERE city_id = ? AND NAME = ?").get(city_id.id, hood);
                if (!is_hood) { 
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

export async function getListings(limit, data){ 
    try {
        // const rate_limiter = await RateLimiterGet('home');
        // if(!rate_limiter) return []; 
        // //set time out before moving one
        
        const obj = await verifyObject(data)
        if(!obj) {
            console.log('Error: object verification failed');
            return [];
        }

        const num = await SanitizeId(limit)
        if(!num) {
            console.log('Error: limit intiger verification failed');
            return [];
        }
        
        const sort = xss(data.sort).trim()
        const city = xss(data.city).trim()
        const hood = xss(data.hood).trim()
        // const limit = more === 8 ? 8 : more;

        const listings = (() => {
            switch (true) {
                case city === '':
                    return db.prepare("SELECT * FROM listings LIMIT ?").all(limit);
                
                case city !== '' && hood === '':
                    return db.prepare("SELECT * FROM listings WHERE city = ? LIMIT ?").all(city, limit);
                
                case city !== '' && hood !== '':
                    return db.prepare("SELECT * FROM listings WHERE city = ? AND hood = ? LIMIT ?").all(city, hood, limit);
                
                default:
                    return db.prepare("SELECT * FROM listings LIMIT ?").all(limit);
            }
        })();
             
        
        if(listings.length !== limit && listings.length < limit-7){ //hit the limit or slow down //Limit >= 8 || 
            console.error('No more listings to show');
            return {error: 'Aucune annonce à afficher'}
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
            listing.view === "on" && (listing.state === 'none' || listing.state === 'on') &&
            (listing.levels + listing.subjects + listing.services + listing.offers + listing.images) === 5
        )
        .map(listing => ({
            id: listing.id,
            name: listing.name,
            city: listing.city,
            hood: listing.hood,
            verified: listing.state,
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
                return filteredListings.sort((a, b) => b.overall - a.overall); // Descending order (higher rank first)
    
            case 'verification':
                return filteredListings.sort((a, b) => {
                    if (a.verified === 'on' && b.verified === 'none') return -1;
                    if (a.verified === 'none' && b.verified === 'none') return 1;
                    return 0;
                });
    
            default:
                return filteredListings;
        }   
        
             
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}


// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------










// ==================================================

export async function getUserListings() {
    try {
        const user_id = await isAuthenticated();
        if(user_id.error) {
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard."} };
        }

        const listings = db.prepare("SELECT * FROM centers WHERE user_id = ?").all(user_id);
        if (listings.length === 0) { 
            return [];
        }

        const listings_ids = listings.map(listing => listing.id);

        const reviews = db.prepare(`
            SELECT listing_id, overall FROM reviews WHERE listing_id IN (${listings_ids})`).all();

        const images = db.prepare(` 
            SELECT * FROM images WHERE listing_id IN (${listings_ids.join(",")})`).all();

        const offers = db.prepare(`
            SELECT * FROM offers WHERE listing_id IN (${listings_ids.join(",")})`).all();
    
        const levels = db.prepare(`
            SELECT * FROM levels WHERE listing_id IN (${listings_ids.join(",")})`).all();

        const subjects = db.prepare(`
            SELECT * FROM subjects WHERE listing_id IN (${listings_ids.join(",")})`).all();

        const services = db.prepare(`
            SELECT * FROM services WHERE listing_id IN (${listings_ids.join(",")})`).all();

        const reviewsByCenter = {};
        listings.forEach(listing => {
            const centerReviews = reviews
                .filter(review => review.listing_id === listing.id)
                .map(review => review.overall);

            reviewsByCenter[listing.id] = centerReviews.length > 0 
                ? centerReviews.reduce((sum, val) => sum + val, 0) / centerReviews.length 
                : null;
        });

        const centersWithDetails  = listings.map(listing => {
            const listingImages   = images.filter(image => image.listing_id === listing.id).map(image => image.name);
            const listingOffers   = offers.filter(offer => offer.listing_id === listing.id).map(offer => offer.name);
            const listingLevels   = levels.filter(level => level.listing_id === listing.id).map(level => level.name);
            const listingSubjects = subjects.filter(subject => subject.listing_id === listing.id).map(subject => subject.name);
            const listingServices = services.filter(service => service.listing_id === listing.id).map(service => service.name);

            const draft = (listingImages.length > 0 ? 1 : 0) +
                (listingOffers.length > 0 ? 1 : 0) +
                (listingLevels.length > 0 ? 1 : 0) +
                (listingSubjects.length > 0 ? 1 : 0) +
                (listingServices.length > 0 ? 1 : 0);

            return {
                ...listing,
                images: listingImages,
                offers: listingOffers,
                levels: listingLevels,
                subjects: listingSubjects,
                services: listingServices,
                overall: reviewsByCenter[listing.id],
                draft 
            };
        });
                
        return centersWithDetails
    } catch (error) {
        return handleDbError(error);
    }
}

export async function getUserListing(center_id) {
    if(!Number.isInteger(center_id)){
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard."} };
    }

    try {
        const user_id = await isAuthenticated();
        if(user_id.error) {
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard."} };
        }

        const listing = db.prepare("SELECT * FROM centers WHERE id = ? AND user_id = ?").get(center_id, user_id);
        if (!listing) {
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const images = db.prepare("SELECT name FROM images WHERE listing_id = ?").all(center_id).map(img => img.name);
        const offers = db.prepare("SELECT name FROM offers WHERE listing_id = ?").all(center_id).map(offer => offer.name);
        const levels = db.prepare("SELECT name FROM levels WHERE listing_id = ?").all(center_id).map(level => level.name);
        const subjects = db.prepare("SELECT name FROM subjects WHERE listing_id = ?").all(center_id).map(subject => subject.name);
        const services = db.prepare("SELECT name FROM services WHERE listing_id = ?").all(center_id).map(service => service.name);

        // const services = db.prepare("SELECT name, icon FROM services WHERE center_id = ?").all(center_id);

        return {
            ...listing,
            images,
            offers,
            levels,
            subjects,
            services
        };

    } catch (error) {
        return handleDbError(error);
    }
}
    
export async function getUserReviews() {    
    try {
        const user_id = await isAuthenticated();
        if(user_id.error) {
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard."} };
        }
        
        const listings = db.prepare("SELECT * FROM reviews WHERE user_id = ?").all(user_id);
        if (listings.length === 0) { 
            return [];
        }

        return listings

    } catch (error) {
        return handleDbError(error);
    }
}

export async function getUserReview(center_id) {    
    try {
        const user_id = await isAuthenticated();
        if(user_id.error) {
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard."} };
        }
        
        const listings = db.prepare("SELECT * FROM reviews WHERE user_id = ? AND listing_id = ?")
        .get(user_id, center_id);
        
        if (!listings) return {review: false}
        return {review: true}

    } catch (error) {
        return handleDbError(error);
    }
}



// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------


export async function getOffersList() {    
    try{ 
        const rows = db.prepare("SELECT * FROM offerslist").all();
        if (rows.length === 0) {
            return []; 
        }
        return rows
        // .map(item => item.name);
    } catch (error) {
        return handleDbError(error);
    }
}

export async function getServicesList() {
    try{ 
        const rows = db.prepare("SELECT * FROM serviceslist").all();
        if (rows.length === 0) {
            return []; 
        }
        return rows
        // .map(item => item.name);
    } catch (error) {
        return handleDbError(error);
    }
}

export async function getSubjectsList() {    
    try{ 
        const rows = db.prepare("SELECT * FROM subjectslist").all();
        if (rows.length === 0) {
            return []; 
        }
        return rows
        // .map(item => item.name);
    } catch (error) {
        return handleDbError(error);
    }
}

export async function getLevelsList() {
    try{ 
        const rows = db.prepare("SELECT * FROM levelslist").all();
        if (rows.length === 0) {
            return []; 
        }
        return rows
        // .map(item => item.name);
    } catch (error) {
        return handleDbError(error);
    }
}

export async function getDescriptionsList() {
    try{ 
        const descriptions = db.prepare("SELECT * FROM descriptions").all();
        if (descriptions.length === 0) {
            return []; 
        }
        return descriptions
        // .map(item => item.description);
    } catch (error) {
        return handleDbError(error);
    }
}

export async function getReviewsList() {    
    try{ 
        const rows = db.prepare("SELECT * FROM reviewslist").all();
        if (rows.length === 0) {
            return []; 
        }
        return rows
    } catch (error) {
        return handleDbError(error);
    }
}

// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------

export async function getCitiesList() {
    try{ 
        const cities = db.prepare("SELECT * FROM cities").all();
        if (cities.length === 0) {
            return []; 
        }
        return cities
        // .map(item => item.name);
    } catch (error) {
        return handleDbError(error);
    }
}

export async function getNeighborhoodsList() {
    try{ 
        const neighborhoods = db.prepare("SELECT * FROM neighborhoods").all();
        if (neighborhoods.length === 0) {
            return []; 
        }
        return neighborhoods
        // .map(item => item.name);
    } catch (error) {
        return handleDbError(error);
    }
}
