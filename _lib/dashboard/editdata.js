'use server'
import getDB from "@/_lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { revalidatePath } from "next/cache";

import { SanitizeId } from "@/_lib/utils/sanitizedata";
import validator from "validator";
import { RateLimiter } from "@/_lib/utils/ratelimiter";

import { allListings, allUsers } from "./getdata";

import xss from "xss";

// -------------------------------------------------------------

const db = getDB();

export async function AdminAuthenticate() {
    try {
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

export async function ApproveListing(value_id){
    try {
        const user_id = await AdminAuthenticate();
        if(!user_id) return {error: 'Failed Admin Authentication.'}; 

        const listing_id = await SanitizeId(value_id)
        if(!listing_id) return {error: 'Listing id is not a number.'}; 

        const [row] = await db.query("SELECT * FROM listings WHERE id = ?", [listing_id]);
        const listing = row[0] || null;
        if (!listing) return { error:'Listing not found by id', listing_id};

        await db.query(`UPDATE listings SET state = ? WHERE id = ?`, ['on', listing_id])

        revalidatePath(`/dashboard`);

        const listings = await allListings(); 
        if(listings.length === 0) return { error:'Unable to update listings'};

        return listings;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function SuspendListing(value_id){
    try {
        const user_id = await AdminAuthenticate();
        if(!user_id) return {error: 'Failed Admin Authentication.'}; 

        const listing_id = await SanitizeId(value_id)
        if(!listing_id) return {error: 'Listing id is not a number.'}; 

        const [row] = await db.query("SELECT * FROM listings WHERE id = ?", [listing_id]);
        const listing = row[0] || null;
        if (!listing) return { error:'Listing not found by id', listing_id};

        await db.query(`UPDATE listings SET state = ? WHERE id = ?`, ['off', listing_id])

        revalidatePath(`/dashboard`);

        const listings = await allListings(); 
        if(listings.length === 0) return { error:'Unable to update listings'};

        return listings;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// -------------------------------------------------------------

export async function ApproveUser(value_id){
    try {        
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Failed Admin Authentication.'}; 

        const user_id = await SanitizeId(value_id)
        if(!user_id) return {error: 'User id is not a number.'}; 

        const [row] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);
        const user = row[0] || null;
        if (!user) return { error:'User not found by id', user_id};

        await db.query(`UPDATE users SET active = ? WHERE id = ?`, ['on', user_id])

        // ---------------------------------------------------------------------------

        const [listings] = await db.query("SELECT * FROM listings WHERE user_id = ?", [user_id]);

        const updatePromises = listings.map(listing => {
            return db.query("UPDATE listings SET state = ? WHERE id = ?", ['under', listing.id]);
        });
        
        if (listings.length !== 0) {
            await Promise.all(updatePromises);
        }
        
        // ---------------------------------------------------------------------------

        revalidatePath(`/dashboard`);

        const users = await allUsers(); 
        if(users.length === 0) return { error:'Unable to update user'};

        return users;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function SuspendUser(value_id){
    try {        
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Failed Admin Authentication.'}; 

        const user_id = await SanitizeId(value_id)
        if(!user_id) return {error: 'User id is not a number.'}; 

        const [row] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);
        const user = row[0] || null;
        if (!user) return { error:'User not found by id', user_id};

        await db.query(`UPDATE users SET active = ? WHERE id = ?`, ['off', user_id])

        // ---------------------------------------------------------------------------

        const [listings] = await db.query("SELECT * FROM listings WHERE user_id = ?", [user_id]);

        const updatePromises = listings.map(listing => {
            return db.query("UPDATE listings SET state = ? WHERE id = ?", ['off', listing.id]);
        });
        
        if (listings.length !== 0) {
            await Promise.all(updatePromises);
        }
        
        // ---------------------------------------------------------------------------

        revalidatePath(`/dashboard`);

        const users = await allUsers(); 
        if(users.length === 0) return { error:'Unable to update user'};

        return users;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function RemoveUser(value_id){
    try {        
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Failed Admin Authentication.'}; 

        const user_id = await SanitizeId(value_id)
        if(!user_id) return {error: 'User id is not a number.'}; 

        const [row] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);
        const user = row[0] || null;
        if (!user) return { error:'User not found by id', user_id};

        await db.query(`DELETE FROM users WHERE id = ?`, [user_id]);

        revalidatePath(`/dashboard`);

        const users = await allUsers(); 
        if(users.length === 0) return { error:'Unable to update user'};

        return users;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// -------------------------------------------------------------

export async function EditSelects(obj, table) {        
    
    if( !obj || !table ||typeof table !== 'string' ||typeof obj !== 'object' 
        || !obj.id || !obj.name || !obj.icon){
        return {error: 'Invalid data'}
    }

    if(!["offerslist", "serviceslist", "subjectslist", "levelslist", ].includes(table)){
        return {error: 'Invalid table name'}
    } 
    
    try{ 
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Failed Admin Authentication.'}; 

        const [rows] = await db.query(`SELECT * FROM ${table}`)
        if (rows.length === 0) return {error: `${table} Table is empty`}

        //update saved offers
        const [row] = await db.query(`SELECT icon FROM ${table} WHERE id = ?`, [obj.id]); //
        const icon = row[0].icon || null
        if (!icon) return { error: `Icon not found for id ${obj.id}` };
        
        const [existingIcon] = await db.query(
            `SELECT * FROM ${table} WHERE LOWER(name) = LOWER(?) AND icon = ?`, 
            [obj.name, obj.icon]);

        if (existingIcon.length !== 0) {
            return { error: "Value already exists" };
        }

        const baseTable = table.replace('list', '');

        // const [icons] = await db.query(`SELECT * FROM ${baseTable} WHERE icon = ?`, [icon]);
        await db.query(`UPDATE ${table} SET name = ?, icon = ? WHERE id = ?`, [obj.name, obj.icon, obj.id]);
        await db.query(`UPDATE ${baseTable} SET icon = ? WHERE icon = ?`, [obj.icon, icon]);

        revalidatePath(`/dashboard`);

        const [data] = await db.query(`SELECT * FROM ${table}`)
        return data

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue."};
    }
}

export async function AddSelects(obj, table){   
    
    if( !obj || !table ||typeof table !== 'string' ||typeof obj !== 'object' 
        || !obj.name || !obj.icon){
        return {error: 'Invalid data'}
    }

    if(!["offerslist", "serviceslist", "subjectslist", "levelslist", ].includes(table)){
        return {error: 'Invalid table name'}
    } 

    try{ 
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Failed Admin Authentication.'}; 

        const [rows] = await db.query(`SELECT * FROM ${table}`)
        if (rows.length === 0) return {error: `${table} Table is empty`}

        const result = rows.find(item => item.name === obj.name);
        if(result) return {error:'Value already exists'}

        else console.log(result);
        
        await db.query(`INSERT INTO ${table} (name, icon) VALUES (?, ?)`, [obj.name, obj.icon]);

        revalidatePath(`/dashboard`);

        const [data] = await db.query(`SELECT * FROM ${table}`)
        return data

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue."};
    }
}

export async function RemoveSelects(id, table){  
    
    if(typeof id !== 'number' || !id && id !== 0 || !table || typeof table !== 'string'){
        return {error: 'Invalid data'}
    }

    if(!["offerslist", "serviceslist", "subjectslist", "levelslist", ].includes(table)){
        return {error: 'Invalid table name'}
    } 

    try{ 
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Failed Admin Authentication.'}; 

        const [row] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [id])
        const select = row[0] || null
        if (!select) return {error: `Item not found`}

        const baseTable = table.replace('list', '');
        
        await db.query(`DELETE FROM ${baseTable} WHERE name = ? and icon = ?`, [select.name, select.icon]);
        await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);

        revalidatePath(`/dashboard`);

        const [data] = await db.query(`SELECT * FROM ${table}`)
        return data

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue."};
    }
}

// -------------------------------------------------------------

export async function AddCity(value) {        
        
    if(!value || typeof value !== 'string'){
        return {error: "Value is not a string."}
    }

    const city = xss(value.trim());

    try{ 
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const [existingCity] = await db.query(`SELECT * FROM cities WHERE LOWER(name) = LOWER(?)`, [city]);
        if (existingCity.length !== 0) {
            return { error: "City already exists" };
        }

        await db.query(`INSERT INTO cities (name) VALUES (?)`, [city]);

        revalidatePath(`/dashboard`);

        const [rows] = await db.query(`SELECT * FROM cities`);
        return rows.length === 0 ? [] : rows;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function AddHood(value_name, value_id) { 

    if(!value_name || typeof value_name !== 'string'){
        return {error: "Value is not a string."}
    }

    const hood = xss(value_name.trim())
    
    try{ 
        const city_id = await SanitizeId(value_id)
        if(!city_id) return {error: 'CityId is not a number.'}; 

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const [existingHood] = await db.query(
            `SELECT * FROM neighborhoods WHERE LOWER(name) = LOWER(?) AND city_id = ?`, [hood, city_id]);
        if (existingHood.length !== 0) {
            return { error: "Hood already exists" };
        }

        await db.query(`INSERT INTO neighborhoods (name, city_id) VALUES (?, ?)`, [hood, city_id]);

        revalidatePath(`/dashboard`);

        const [rows] = await db.query(`SELECT * FROM neighborhoods WHERE city_id = ?`, [city_id]);
        return rows.length === 0 ? [] : rows;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function RemoveHood(cityId, hoodName) {   
         
    if(!hoodName || typeof hoodName !== 'string'){
        return {error: "Hood value is not a string."}
    }

    const hood_name = xss(hoodName.trim())

    try{ 
        const city_id = await SanitizeId(cityId)
        if(!city_id) return {error: 'CityId is not a number.'}; 

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        await db.query(`UPDATE listings SET hood = 'Autre quartier' WHERE hood = ?`, [hood_name]);
        
        await db.query(`DELETE FROM neighborhoods WHERE city_id = ? AND name = ?`,[city_id, hood_name]);

        revalidatePath(`/dashboard`);

        const [rows] = await db.query(`SELECT * FROM neighborhoods WHERE city_id = ?`, [city_id]);
        return rows.length === 0 ? [] : rows;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function RemoveCity(id) {    
    try{ 
        const city_id = await SanitizeId(id)
        if(!city_id) return {error: 'CityId is not a number.'}; 

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        await db.query(`DELETE FROM cities WHERE id = ?`, [city_id]);

        revalidatePath(`/dashboard`);

        const [rows] = await db.query(`SELECT * FROM cities`);
        return rows.length === 0 ? [] : rows;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

// -------------------------------------------------------------

export async function ApproveHood(data) {   
    
    if (!data || typeof data !== 'object') {
        return { error: "Data is not a valid object" };
    }
    
    if ( !data.name || !data.city 
      || typeof data.name !== 'string' || typeof data.city !== 'string') {
      return { error: "Object contains invalid string values." };
    }
        
    try{ 
        const hood_name = xss(data.name).trim();
        const city_name = xss(data.city).trim();

        const hood_id = await SanitizeId(data.id)
        const listing_id = await SanitizeId(data.listing_id)

        if(!hood_id || !listing_id) {
            return {error: 'Object contains invalid numbers.'}; 
        }

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        // ---------------------------------------

        const [row] = await db.query(`SELECT * FROM cities WHERE name = ?`, [city_name]);
        const city = row[0] || null;
        
        const [hood] = await db.query(
            `SELECT * FROM neighborhoods WHERE LOWER(name) = LOWER(?) AND city_id = ?`, [hood_name, city.id]);
        if(hood.length !== 0){ 
            return { error: "Hood already exists" };
        }

        await db.query("UPDATE listings SET hood = ? WHERE id = ?", [hood_name, listing_id]);
        await db.query(`INSERT INTO neighborhoods (name, city_id) VALUES (?, ?)`, [hood_name, city.id]);
        await db.query(`DELETE FROM suggestedhoods WHERE id = ?`, [hood_id]);

        revalidatePath(`/dashboard`);

        const [rows] = await db.query(`SELECT * FROM suggestedhoods`)
        return rows.length === 0 ? [] : rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function RejectHood(id) {       
    try{ 
        const hood_id = await SanitizeId(id)
        if(!hood_id) {
            return {error: 'Invalid neighborhood ID'}; 
        }

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const [existingHood] = await db.query(`SELECT * FROM suggestedhoods WHERE id = ?`, [hood_id]);
        if (existingHood.length === 0) {
            return { error: "Neighborhood suggestion not found." };
        }

        await db.query(`DELETE FROM suggestedhoods WHERE id = ?`, [hood_id]);

        revalidatePath(`/dashboard`);

        const [rows] = await db.query(`SELECT * FROM suggestedhoods`);
        return rows.length === 0? [] : rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

// -------------------------------------------------------------

export async function RemoveToken(id) {   
    try{ 
        const token_id = await SanitizeId(id)
        if(!token_id) return {error: 'CityId is not a number.'}; 

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 
        
        await db.query(`DELETE FROM tokens WHERE id = ?`,[token_id]);

        revalidatePath(`/dashboard`);

        const [rows] = await db.query(`SELECT * FROM tokens`);
        return rows.length === 0 ? [] : rows;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

// -------------------------------------------------------------

export async function SanitizeArticle(value_title, value_content) {        
    
    if(!value_title || typeof value_title !== 'string'){
        return {error: 'Article title or content is not valid'}; 
    }

    const title = xss(value_title.trim());

    try{ 
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const [existingArticle] = await db.query(`SELECT * FROM blog WHERE LOWER(title) = LOWER(?)`, [title]);
        if (existingArticle.length !== 0) {
            return { error: "Article already exists" };
        } else{
            return {success: true};
        }

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function InsertArticle(obj) {        
    
    if(!obj || typeof obj !== 'object' ||
        !Object.hasOwn(obj, 'title') || !Object.hasOwn(obj, 'content') || !Object.hasOwn(obj, 'image') ){
        return {error: 'Article object data is not valid'}; 
    }   

    const title = xss(obj.title.trim());
    const content = xss(obj.content.trim());
    const image = xss(obj.image.trim());

    try{ 
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        await db.query(`INSERT INTO blog (title, content, image) VALUES (?, ?, ?)`, 
            [title, content, image]);

        revalidatePath(`/dashboard`);

        const [rows] = await db.query(`SELECT * FROM blog`);
        return rows.length === 0 ? [] : rows;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function ToggleArticle(id) {            
    try{ 
        const article_id = await SanitizeId(id)
        if(!article_id) return {error: 'Article_id is not a number.'}; 

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const [rows] = await db.query(`SELECT view FROM blog WHERE id = ?`, [article_id]);
        if (!rows[0]) return { error: 'Article does not exist.' };

        const view = rows[0].view;

        await db.query(`UPDATE blog SET view = ? WHERE id = ?`, [view === 0? 1 : 0, article_id])

        revalidatePath(`/dashboard`);

        const [article] = await db.query("SELECT * FROM blog WHERE id = ?", [article_id]);
        if (!article[0]) return { error: 'Article does not exist.' };

        return { 
            id: article[0].id,
            image: article[0].image,
            title: article[0].title,
            content: article[0].content,
            created_at: article[0].created_at,
            view: article[0].view
        };

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function RemoveArticle(id) {            
    try{ 
        const article_id = await SanitizeId(id)
        if(!article_id) return {error: 'Article_id is not a number.'}; 

        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const [rows] = await db.query(`SELECT * FROM blog WHERE id = ?`, [article_id]);
        if (!rows[0]) return { error: 'Article does not exist.' };

        await db.query(`DELETE FROM blog WHERE id = ?`, [article_id]);

        return {success: true}

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

// -------------------------------------------------------------

export async function CreateCenter(obj) {     
    
    if(!obj || typeof obj !== 'object' || !obj.name || !obj.city){
        return {error: 'Invalid object tyoe or data.'}; 
    }

    const name = xss(obj.name.trim())
    const city = xss(obj.city.trim())

    try{          
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const [existingCenter] = await db.query(
            `SELECT * FROM centers WHERE LOWER(name) = LOWER(?) AND city = ?`, [name, city]);

        if (existingCenter.length !== 0) {
            return { error: "Center already exists" };
        }

        await db.query(`INSERT INTO centers (name, city) VALUES (?, ?)`, [name, city]);

        revalidatePath(`/dashboard`);

        const [data] = await db.query(`SELECT * FROM centers`)
        return data.sort((a, b) => b.id - a.id);

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function RemoveCenter(id) {     
    try{          
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const center_id = await SanitizeId(id)
        if(!center_id) return {error: 'Center id is not a number.'}; 

        await db.query(`DELETE FROM centers WHERE id = ?`, [center_id]);

        revalidatePath(`/dashboard`);

        const [data] = await db.query(`SELECT * FROM centers`)
        return data

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

// -------------------------------------------------------------

export async function AddEmail(id, value) {     
    try{          
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const center_id = await SanitizeId(id)
        if(!center_id) return {error: 'Center id is not a number.'}; 

        const email = validator.normalizeEmail(value);        
        if (!validator.isEmail(value)) return {error: 'Email is not valid.'}; 

        const [existingEmail] = await db.query(
            `SELECT * FROM emails WHERE LOWER(email) = LOWER(?) AND center_id = ?`, [email, center_id]);

        if (existingEmail.length !== 0) {
            return { error: "Email already exists" };
        }

        await db.query(`INSERT INTO emails (email, center_id) VALUES (?, ?)`, [email, center_id]);

        revalidatePath(`/dashboard`);

        const [data] = await db.query(`SELECT * FROM emails WHERE center_id = ?`, [center_id])
        return data.map((item)=>item.email)

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function RemoveEmail(id, value) {     
    try{          
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const center_id = await SanitizeId(id)
        if(!center_id) return {error: 'Center id is not a number.'}; 

        const email = validator.normalizeEmail(value);        
        if (!validator.isEmail(value)) return {error: 'Email is not valid.'}; 

        const [existingEmail] = await db.query(
            `SELECT * FROM emails WHERE LOWER(email) = LOWER(?) AND center_id = ?`, [email, center_id]);

        if (existingEmail.length === 0) {
            return { error: "Email does not exists" };
        }

        await db.query(`DELETE FROM emails WHERE email = ? AND center_id = ?`, [email, center_id]);

        revalidatePath(`/dashboard`);

        const [data] = await db.query(`SELECT * FROM emails WHERE center_id = ?`, [center_id])
        return data.map((item)=>item.email)

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function AddNumber(id, value) {     
    try{          
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const center_id = await SanitizeId(id)
        if(!center_id) return {error: 'Center id is not a number.'}; 

        if(!value || typeof value !== 'string' || !/^(05|06|07)\d{8}$/.test(value)){
            return {error: 'Number value is invalid.'}; 
        }


        const number = xss(value.trim())

        const [existingNumber] = await db.query(
            `SELECT * FROM numbers WHERE number = ? AND center_id = ?`, [number, center_id]);

        if (existingNumber.length !== 0) {
            return { error: "Number already exists" };
        }

        await db.query(`INSERT INTO numbers (number, center_id) VALUES (?, ?)`, [number, center_id]);

        revalidatePath(`/dashboard`);

        const [data] = await db.query(`SELECT * FROM numbers WHERE center_id = ?`, [center_id])
        return data.map((item)=>item.number)

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

export async function RemoveNumber(id, value) {     
    try{          
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return {error: 'Admin Authentication Failed.'}; 

        const center_id = await SanitizeId(id)
        if(!center_id) return {error: 'Center id is not a number.'}; 

        if(!value || typeof value !== 'string' || !/^(05|06|07)\d{8}$/.test(value)){
            return {error: 'Number value is invalid.'}; 
        }

        const number = xss(value.trim())

        const [existingNumber] = await db.query(
            `SELECT * FROM numbers WHERE number = ? AND center_id = ?`, [number, center_id]);

        if (existingNumber.length === 0) {
            return { error: "Number does not exists" };
        }

        await db.query(`DELETE FROM numbers WHERE number = ? AND center_id = ?`, [number, center_id]);

        revalidatePath(`/dashboard`);

        const [data] = await db.query(`SELECT * FROM numbers WHERE center_id = ?`, [center_id])
        return data.map((item)=>item.number)

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}

// -------------------------------------------------------------

export async function Unsubscribe(value) {     ///translate error to french
    
    if(!value || typeof value !== 'string'){
        return {error: "L'email n'est pas valide."}
    }

    const email = validator.normalizeEmail(value); 

    if (!email || !validator.isEmail(email)) {
        return {error: "L'email n'est pas valide."}
    }

    try{          
        const rate_limiter = await RateLimiter('unsubscribe');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard."};
        }

        const [existingEmail] = await db.query(
            `SELECT * FROM emails WHERE email = ? AND status = ?`, [email, 1]);

        if (existingEmail.length === 0) {
            return { error: "L'email n'existe pas" };
        }

        await db.query(`UPDATE emails SET status = ? WHERE email = ?`, [0, email])

        return {success:'Vous vous êtes désabonné avec succès.'}

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
    }
}



