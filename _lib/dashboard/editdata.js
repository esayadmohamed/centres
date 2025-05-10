'use server'
import getDB from "@/_lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { revalidatePath } from "next/cache";

import { SanitizeId } from "@/_lib/utils/sanitizedata";
import { allListings, allUsers } from "./getdata";

import xss from "xss";

// -------------------------------------------------------------

const db = getDB();

async function AdminAuthenticate() {
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

        await db.query(`UPDATE ${table} SET name = ?, icon = ? WHERE id = ?`, [obj.name, obj.icon, obj.id]);

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