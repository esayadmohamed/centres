'use server'
import getDB from "@/_lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { SanitizeId } from "@/_lib/utils/sanitizedata";
import xss from "xss";

// -------------------------------------------------------------

async function AdminAuthenticate() {
    try {
        const db = getDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.warn("No session or user data found.");
            return null
        }
        
        const token = session.user.token;
        const email = session.user.email;

        const [row] = await db.query( "SELECT id FROM users WHERE email = ? AND token = ? AND role = ?", 
            [email, token, 'admin']);

        const user = row[0] || null;      

        if (!user) {
            console.info(`Admin not authenticated, email: ${email}`);
            return null;
        }
                
        return {success: true}

    } catch (error) {
        console.error("Database error:", error);
        return null
    }
}

export async function allListings() {
    try {
        const db = getDB();

        const user_id = await AdminAuthenticate();
        if(!user_id) return [];

        const [listings] = await db.query("SELECT * FROM listings");
        if (listings.length === 0) { 
            return [];
        }

        return listings.map((listing) => ({
            id: listing.id,
            user_id: listing.user_id,
            name: listing.name,
            city: listing.city,
            hood: listing.hood,
            state: listing.state,
            created_at: listing.created_at
        }));

    } catch (error) {
        console.error("Database error:", error);
        return [];
    }
}

export async function singleListing(value_id) {
    try {
        const db = getDB();

        const user_id = await AdminAuthenticate();
        if(!user_id) return {error: 'Failed Admin Authentication.'}; 

        const listing_id = await SanitizeId(value_id)
        if(!listing_id) return {error: 'Listing id is not a number.'}; 

        const [row] = await db.query("SELECT * FROM listings WHERE id = ?", [listing_id]);
        const listing = row[0] || null;
        if (!listing) return {error: 'Listing does not exist.'}; 

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
            draft,
            levels,
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

export async function allUsers() {
    try {
        const db = getDB();

        const user_id = await AdminAuthenticate();
        if(!user_id) return [];
    
        const [users] = await db.query("SELECT * FROM users WHERE role = 'user'");
        if (users.length === 0) { 
            return [];
        }
                
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            active: user.active,
            created_at: user.created_at
        }));

    } catch (error) {
        console.error("Database error:", error);
        return [];
    }
}

export async function singleUser(value_id) {
    try {
        const db = getDB();

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Failed Admin Authentication.'}; 

        const user_id = await SanitizeId(value_id)
        if(!user_id) return {error: 'User id is not a number.'}; 

        const [row] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);
        const user = row[0] || null;
        if (!user) return {error: 'User does not exist.'}; 

        // const [tokens] = await db.query("SELECT * FROM tokens WHERE email = ?", [user.email]);
        // console.log(tokens);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            active: user.active,
            created_at: user.created_at
        };

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function allArticles() {
    try {
        const db = getDB();

        const user_id = await AdminAuthenticate();
        if(!user_id) return [];

        const [articles] = await db.query("SELECT * FROM blog");
        if (articles.length === 0) { 
            return [];
        }

        return articles.map((article) => ({
            id: article.id,
            image: article.image,
            title: article.title,
            content: article.content,
            created_at: article.created_at,
            view: article.view
        }));

    } catch (error) {
        console.error("Database error:", error);
        return [];
    }
}

export async function singleArticle(value_id) {
    try {
        const db = getDB();

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Failed Admin Authentication.'}; 

        const article_id = await SanitizeId(value_id)
        if(!article_id) return {error: 'Article id is not a number.'}; 

        const [row] = await db.query("SELECT * FROM blog WHERE id = ?", [article_id]);
        const article = row[0] || null;
        if (!article) return {error: 'Article does not exist.'}; 

        return { 
            id: article.id,
            image: article.image,
            title: article.title,
            content: article.content,
            created_at: article.created_at,
            view: article.view
        };

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// --------------------------------------------------------

export async function getDashData(table) {   
    
    if(typeof table !== 'string'){
        return { error: "TableName is not valid"};
    }

    const tableName = xss(table.trim())
    
    if(!["offerslist", 
        "serviceslist", 
        "subjectslist", 
        "levelslist", 

        "cities",
        "suggestedhoods",
        "tokens"
    ].includes(tableName)) return []
    
    try{ 
        const db = getDB();

        const [rows] = await db.query(`SELECT * FROM ${tableName}`);
        if (rows.length === 0) return []; 
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function getDashHoods(value_id) {  
    try{  
        const db = getDB();
        
        const city_id = await SanitizeId(value_id)
        if(!city_id) return {error: 'Value is not a number.'}; 

        const [rows] = await db.query(`SELECT * FROM neighborhoods WHERE city_id = ?`, [city_id]);
        return rows.length === 0 ? [] : rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Database error."};
    }
}

// --------------------------------------------------------

