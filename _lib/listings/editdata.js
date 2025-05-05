'use server';
import getDB from "@/_lib/db";

import xss from 'xss';
import fs from 'node:fs/promises';
import path from 'node:path';

import { revalidatePath } from "next/cache";

import { UserAuthorized } from '@/_lib/utils/userauth';
import { SanitizeId } from '@/_lib/utils/sanitizedata';
import { SanitizeImage } from '@/_lib/utils/sanitizedata';

import { RateLimiter } from "@/_lib/utils/ratelimiter";

import { userListing } from './test';

const db = getDB();

// ---------------------------------------------------------------

export async function ModifyHood (value_id, new_value) {
    try {
        const rate_limiter = await RateLimiter('modify');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard." };
        }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        //------------------------------------------------------------------------- 

        if(typeof new_value !== 'string'){
            console.warn(`User ${user_id} is sending invalid info data for listing_id ${listing_id}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
        }

        const hood = xss(new_value).trim(); 

        if (!hood || hood.length < 2 || hood.length > 100 || /[<>{}[\];"\\\/!?@#$%^&*=`~|()]/g.test(hood)) {
            return { error:"Le quartier fourni n'est pas valide."}
        } 

        const [hoodSubmitted] = db.query("SELECT * FROM suggestedhoods WHERE listing_id = ?", [listing_id]);
        if(hoodSubmitted.length === 0){
            return {error: "Une suggestion de quartier a déjà été enregistrée."};
        }

        const [listing] = db.query("SELECT * FROM listings WHERE id = ?", [listing_id]);
        if(listing.length === 0){
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };   
        }

        await db.query(`INSERT INTO suggestedhoods (name, city, listing_id, user_id) VALUES (?, ?, ?, ?)`, 
            [hood, listing.city, listing.id, user_id]);

        revalidatePath(`/listings/${listing_id}`);

        const rows = await userListing(listing_id);
        if (rows?.error) {
            return { error:  "Une erreur est survenue. Veuillez réessayer plus tard." };  
        }
        return rows

    }catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };    
    }

}

// ---------------------------------------------------------------

export async function ModifyInfo (value_id, new_value) {
    try {
        // const rate_limiter = await RateLimiter('modify');
        // if(!rate_limiter){
        //     return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        // }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        
        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        //------------------------------------------------------------------------- 

        if(typeof new_value !== 'string'){
            console.warn(`User ${user_id} is sending invalid info data for listing_id ${listing_id}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const info = xss(new_value).trim(); 

        if (!info || info === "" || info < 10) {
            return { error:  "Le description fourni n'est pas valide." }
        } else if (info.length > 500) {
            return { error: "La description ne doit pas dépasser 500 caractères" }
        } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,-:?!']+$/.test(info)) {
            return { error: "Le description ne doit pas contenir de caractères spéciaux" }
        }

        await db.query(`UPDATE listings SET info = ?, state = ? WHERE id = ?`, [info, 'none', listing_id]);

        revalidatePath(`/listings/${listing_id}`);

        const rows = await userListing(listing_id);
        if (rows?.error) {
            return { error:  "Une erreur est survenue. Veuillez réessayer plus tard." };  
        }
        return rows

    }catch (error) {
        console.error("Database error:", error);
        return { error:  "Une erreur est survenue. Veuillez réessayer plus tard." };    
    }

}

// ---------------------------------------------------------------

export async function ModifyPhone(value_id, new_value) {
    try {
        // const rate_limiter = await RateLimiter('modify');
        // if(!rate_limiter){
        //     return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        // }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        //------------------------------------------------------------------------- 

        if(typeof new_value !== 'string'){
            console.warn(`User ${user_id} is sending invalid phone data for listing_id ${listing_id}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const phone = xss(new_value).trim(); 

        if (!phone || phone === ""
            || !/^(05|06|07)\d{8}$/.test(phone) ) {
                return { error: { phone: "Le numéro de téléphone fourni n'est pas valide"} }
        } 

        db.query(`UPDATE listings SET phone = ? WHERE id = ?`, [phone, listing_id]);

        revalidatePath(`/listings/${listing_id}`);
        
        const rows = await userListing(listing_id);
        if (rows?.error) {
            return { error:  "Une erreur est survenue. Veuillez réessayer plus tard." };  
        }
        return rows

    }catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
    }

}

// ---------------------------------------------------------------

export async function ModifyOffers(value_id, new_value) {
    try {
        // const rate_limiter = await RateLimiter('modify');
        // if(!rate_limiter){
        //     return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        // }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        //------------------------------------------------------------------------- 

        const db_table = "offers";
        const db_list = "offerslist"

        if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        
        const newValues = new_value.map((item) => xss(item));

        if(newValues.length === 0){
            return { error: "Vous devez sélectionner au moins une valeur." };
        }

        const [countrow] = await db.query(`SELECT COUNT(*) AS count FROM ${db_list}`)
        const count = countrow[0] || null

        if(newValues?.length > count?.count){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const [previousRows] = await db.query(`SELECT name FROM ${db_table} WHERE listing_id = ?`, [listing_id])
        const previousValues = previousRows.map(item => item.name); 
        
        const [allRows] = await db.query(`SELECT name FROM ${db_list}`);
        const allValues = allRows.map(item => item.name);

        const maliciousValues = newValues.filter(value => !allValues.includes(value));
        if(maliciousValues.length > 0){
            console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
        
            for (const value of allValues) {
                if (previousValues.includes(value) && !newValues.includes(value)) {
                    const [countRows] = await connection.query(
                        `SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ? FOR UPDATE`,
                        [listing_id]
                    );
                    const itemsCount = countRows[0].count;
        
                    if (itemsCount > 1) {
                        await connection.query(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`,
                            [value, listing_id]
                        );
                    } else {
                        console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
                        await connection.rollback();
                        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
                    }
        
                } else if (newValues.includes(value) && !previousValues.includes(value)) {
                    const [iconRows] = await connection.query(`SELECT icon FROM ${db_list} WHERE name = ?`,
                        [value]
                    );
        
                    if (iconRows.length > 0) {
                        const icon = iconRows[0].icon;
                        await connection.query(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`,
                            [value, listing_id, icon]
                        );
                    } else {
                        console.log(`Icon not found for value:`, value);
                    }
                }
            }
        
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
        
        const [listing] = await db.query(`SELECT ${db_table} FROM listings WHERE id = ?`, [listing_id])
        if (listing.length !== 0 && Object.values(listing[0])[0] === 0) {
            await db.query(`UPDATE listings SET ${db_table} = ? WHERE id = ?`, [1, listing_id])
        }
        
        const rows = await userListing(listing_id);
        if (rows?.error) {
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; 
        }
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function ModifyServices(value_id, new_value) {
    try {
        // const rate_limiter = await RateLimiter('modify');
        // if(!rate_limiter){
        //     return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        // }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        //------------------------------------------------------------------------- 

        const db_table = "services";
        const db_list = "serviceslist"

        if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        
        const newValues = new_value.map((item) => xss(item));

        if(newValues.length === 0){
            return { error: "Vous devez sélectionner au moins une valeur." };
        }

        const [countrow] = await db.query(`SELECT COUNT(*) AS count FROM ${db_list}`)
        const count = countrow[0] || null

        if(newValues?.length > count?.count){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const [previousRows] = await db.query(`SELECT name FROM ${db_table} WHERE listing_id = ?`, [listing_id])
        const previousValues = previousRows.map(item => item.name); 
        
        const [allRows] = await db.query(`SELECT name FROM ${db_list}`);
        const allValues = allRows.map(item => item.name);

        const maliciousValues = newValues.filter(value => !allValues.includes(value));
        if(maliciousValues.length > 0){
            console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
        
            for (const value of allValues) {
                if (previousValues.includes(value) && !newValues.includes(value)) {
                    const [countRows] = await connection.query(
                        `SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ? FOR UPDATE`,
                        [listing_id]
                    );
                    const itemsCount = countRows[0].count;
        
                    if (itemsCount > 1) {
                        await connection.query(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`,
                            [value, listing_id]
                        );
                    } else {
                        console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
                        await connection.rollback();
                        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
                    }
        
                } else if (newValues.includes(value) && !previousValues.includes(value)) {
                    const [iconRows] = await connection.query(`SELECT icon FROM ${db_list} WHERE name = ?`,
                        [value]
                    );
        
                    if (iconRows.length > 0) {
                        const icon = iconRows[0].icon;
                        await connection.query(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`,
                            [value, listing_id, icon]
                        );
                    } else {
                        console.log(`Icon not found for value:`, value);
                    }
                }
            }
        
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
        
        const [listing] = await db.query(`SELECT ${db_table} FROM listings WHERE id = ?`, [listing_id])
        if (listing.length !== 0 && Object.values(listing[0])[0] === 0) {
            await db.query(`UPDATE listings SET ${db_table} = ? WHERE id = ?`, [1, listing_id])
        }
        
        const rows = await userListing(listing_id);
        if (rows?.error) {
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; 
        }
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function ModifySubjects(value_id, new_value) {
    try {
        // const rate_limiter = await RateLimiter('modify');
        // if(!rate_limiter){
        //     return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        // }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        //------------------------------------------------------------------------- 

        const db_table = "subjects";
        const db_list = "subjectslist"

        if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        
        const newValues = new_value.map((item) => xss(item));

        if(newValues.length === 0){
            return { error: "Vous devez sélectionner au moins une valeur." };
        }

        const [countrow] = await db.query(`SELECT COUNT(*) AS count FROM ${db_list}`)
        const count = countrow[0] || null

        if(newValues?.length > count?.count){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const [previousRows] = await db.query(`SELECT name FROM ${db_table} WHERE listing_id = ?`, [listing_id])
        const previousValues = previousRows.map(item => item.name); 
        
        const [allRows] = await db.query(`SELECT name FROM ${db_list}`);
        const allValues = allRows.map(item => item.name);

        const maliciousValues = newValues.filter(value => !allValues.includes(value));
        if(maliciousValues.length > 0){
            console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
        
            for (const value of allValues) {
                if (previousValues.includes(value) && !newValues.includes(value)) {
                    const [countRows] = await connection.query(
                        `SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ? FOR UPDATE`,
                        [listing_id]
                    );
                    const itemsCount = countRows[0].count;
        
                    if (itemsCount > 1) {
                        await connection.query(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`,
                            [value, listing_id]
                        );
                    } else {
                        console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
                        await connection.rollback();
                        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
                    }
        
                } else if (newValues.includes(value) && !previousValues.includes(value)) {
                    const [iconRows] = await connection.query(`SELECT icon FROM ${db_list} WHERE name = ?`,
                        [value]
                    );
        
                    if (iconRows.length > 0) {
                        const icon = iconRows[0].icon;
                        await connection.query(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`,
                            [value, listing_id, icon]
                        );
                    } else {
                        console.log(`Icon not found for value:`, value);
                    }
                }
            }
        
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
        
        const [listing] = await db.query(`SELECT ${db_table} FROM listings WHERE id = ?`, [listing_id])
        if (listing.length !== 0 && Object.values(listing[0])[0] === 0) {
            await db.query(`UPDATE listings SET ${db_table} = ? WHERE id = ?`, [1, listing_id])
        }
        
        const rows = await userListing(listing_id);
        if (rows?.error) {
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; 
        }
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function ModifyLevels(value_id, new_value) {
    try {
        // const rate_limiter = await RateLimiter('modify');
        // if(!rate_limiter){
        //     return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        // }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        //------------------------------------------------------------------------- 

        const db_table = "levels";
        const db_list = "levelslist"

        if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }
        
        const newValues = new_value.map((item) => xss(item));

        if(newValues.length === 0){
            return { error: "Vous devez sélectionner au moins une valeur." };
        }

        const [countrow] = await db.query(`SELECT COUNT(*) AS count FROM ${db_list}`)
        const count = countrow[0] || null

        if(newValues?.length > count?.count){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const [previousRows] = await db.query(`SELECT name FROM ${db_table} WHERE listing_id = ?`, [listing_id])
        const previousValues = previousRows.map(item => item.name); 
        
        const [allRows] = await db.query(`SELECT name FROM ${db_list}`);
        const allValues = allRows.map(item => item.name);

        const maliciousValues = newValues.filter(value => !allValues.includes(value));
        if(maliciousValues.length > 0){
            console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard."};
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
        
            for (const value of allValues) {
                if (previousValues.includes(value) && !newValues.includes(value)) {
                    const [countRows] = await connection.query(
                        `SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ? FOR UPDATE`,
                        [listing_id]
                    );
                    const itemsCount = countRows[0].count;
        
                    if (itemsCount > 1) {
                        await connection.query(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`,
                            [value, listing_id]
                        );
                    } else {
                        console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
                        await connection.rollback();
                        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
                    }
        
                } else if (newValues.includes(value) && !previousValues.includes(value)) {
                    const [iconRows] = await connection.query(`SELECT icon FROM ${db_list} WHERE name = ?`,
                        [value]
                    );
        
                    if (iconRows.length > 0) {
                        const icon = iconRows[0].icon;
                        await connection.query(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`,
                            [value, listing_id, icon]
                        );
                    } else {
                        console.log(`Icon not found for value:`, value);
                    }
                }
            }
        
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
        
        const [listing] = await db.query(`SELECT ${db_table} FROM listings WHERE id = ?`, [listing_id])
        if (listing.length !== 0 && Object.values(listing[0])[0] === 0) {
            await db.query(`UPDATE listings SET ${db_table} = ? WHERE id = ?`, [1, listing_id])
        }
        
        const rows = await userListing(listing_id);
        if (rows?.error) {
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; 
        }
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// ---------------------------------------------------------------

async function UploadImage(file, listing_id) {

    try {
        if (!file) {
            return { error: { image: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const uploadDir = path.join(process.cwd(), "_upl/listings");
        await fs.mkdir(uploadDir, { recursive: true });

        const fileExtension = file.name.split('.').pop();
        const newFileName = `image_${Date.now()}_${listing_id}.${fileExtension}`;
        const filePath = path.join(uploadDir, newFileName);

        const arrayBuffer = await file.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, imageBuffer);

        return newFileName

    } catch (error) {
        console.error("Error saving image:", error);
        return null
    }
}

export async function ModifyImage(value_id, new_value) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        console.log(value_id);

        const listing_id = await SanitizeId(value_id);
        if (!listing_id) {
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const user_id = await UserAuthorized(listing_id);
        if (!user_id) {
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const sanitization = await SanitizeImage(new_value);
        if (!sanitization) {
            console.log(`Invalid image file for listing ${listing_id}`);
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; // Hack attempt
        }

        //---------------------------------------------------------

        const file_name = await UploadImage(new_value, listing_id);
        if (!file_name) {
            console.log(`Unable to upload image file for listing: ${listing_id} in database`);
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; // Hack attempt
        }

        // Ensure the listing has less than 3 images
        const [countRows] = await connection.query(
            'SELECT COUNT(*) AS total FROM images WHERE listing_id = ? FOR UPDATE', [listing_id]);
        const image_count = countRows[0]?.total || 0;

        if (image_count >= 3) {
            console.log(`Listing ${listing_id} already has 3 images, cannot upload more`);
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        await connection.query(`INSERT INTO images (name, listing_id) VALUES (?, ?)`, [file_name, listing_id]);

        // Update the 'images' field in listings if it's the first image
        const [listingRows] = await connection.query(
            'SELECT images FROM listings WHERE id = ? FOR UPDATE', [listing_id]);
        if (listingRows[0]?.images === 0) {
            await connection.query('UPDATE listings SET images = ? WHERE id = ?', [1, listing_id]);
        }

        // Set the listing state to 'none' if it's not already
        const [stateRows] = await connection.query(
            'SELECT state FROM listings WHERE id = ? FOR UPDATE', [listing_id]);
        if (stateRows[0]?.state !== 'none') {
            await connection.query('UPDATE listings SET state = ? WHERE id = ?', ['none', listing_id]);
        }

        // Revalidate the path for caching
        revalidatePath(`/listings/${listing_id}`);

        // Get updated listing data
        const rows = await userListing(listing_id);
        if (rows?.error) {
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        // Commit the transaction after all queries are successful
        await connection.commit();
        return rows;

    } catch (error) {
        console.error("Database error:", error);
        await connection.rollback();
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    } finally {
        connection.release();
    }
}

export async function removeImage(value_id, fileName) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const listing_id = await SanitizeId(value_id);
        if (!listing_id) {
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const user_id = await UserAuthorized(listing_id);
        if (!user_id) {
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        if (typeof fileName !== 'string') {
            console.warn(`User ${user_id} is sending invalid image_name for listing_id ${listing_id}`);
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const image_name = xss(fileName).trim();

        // Check if image exists in the database
        const [existingImage] = await connection.query(
            "SELECT * FROM images WHERE name = ? AND listing_id = ? FOR UPDATE",
            [image_name, listing_id]
        );
        if (existingImage.length === 0) {
            console.log(`Image: ${image_name} and listing ${listing_id} don't match`);
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; // Hack attempt
        }

        // Ensure at least 1 image remains in the listing
        const [imageCount] = await connection.query(
            "SELECT COUNT(*) AS count FROM images WHERE listing_id = ? FOR UPDATE",
            [listing_id]
        );
        if (imageCount[0].count <= 1) {
            await connection.rollback();
            return { error: "Opération échouée: chaque centre doit avoir au moins une image." };
        }

        // Delete image from database
        const [result] = await connection.query(
            "DELETE FROM images WHERE name = ? AND listing_id = ?",
            [image_name, listing_id]
        );

        // Check if image is successfully deleted
        const [isImageDeleted] = await connection.query(
            "SELECT COUNT(*) AS count FROM images WHERE name = ? AND listing_id = ?",
            [image_name, listing_id]
        );
        if (isImageDeleted[0]?.count === 0) {
            const uploadDir = path.join(process.cwd(), "_upl/listings");
            const filePath = path.join(uploadDir, image_name);

            try {
                await fs.unlink(filePath);
                console.log("Image file deleted:", image_name);
            } catch (err) {
                console.error("Error deleting the image file:", err);
                await connection.rollback();
                return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
            }

            const rows = await userListing(listing_id);
            if (rows?.error) {
                await connection.rollback();
                return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
            }

            await connection.commit();
            return rows;
        } else {
            console.log('Failed to delete image record from database');
            await connection.rollback();
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

    } catch (error) {
        console.error("Database error:", error);
        await connection.rollback();
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    } finally {
        connection.release();
    }
}


// export async function ModifyImage(value_id, new_value) {
//     try {
//         console.log(value_id);
//         // const rate_limiter = await RateLimiter('image');
//         // if(!rate_limiter){
//         //     return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard." };
//         // }

//         const listing_id = await SanitizeId(value_id)
        

//         if(!listing_id){ 
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
//         }

        
//         const user_id = await UserAuthorized(listing_id)
//         if(!user_id){ 
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
//         }

//         const sanitization = await SanitizeImage(new_value);
//         if (!sanitization) {
//             console.log(`Invalid image file for listing ${listing_id}`);
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; //hack attemp
//         }

//         //--------------------------------------------------------- 

//         const file_name = await UploadImage(new_value, listing_id)
//         if(!file_name) {
//             console.log(`Unable to upload image file for listing: ${listing_id} in database`);
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; //hack attemp
//         }

//         const [countRows] = await db.query(
//             'SELECT COUNT(*) AS total FROM images WHERE listing_id = ? FOR UPDATE', [listing_id]);
//         const image_count = countRows[0]?.total || 0;

//         if (image_count >= 3) {
//             console.log(`Listing ${listing_id} already has 3 images, cannot upload more`);
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
//         }

//         await db.query(`INSERT INTO images (name, listing_id) VALUES (?, ?)`, [file_name, listing_id]);

//         const [listingRows] = await db.query(
//             'SELECT images FROM listings WHERE id = ? FOR UPDATE', [listing_id]);

//         if (listingRows[0]?.images === 0) {
//             await db.query('UPDATE listings SET images = ? WHERE id = ?', [1, listing_id]);
//         }
        
//         const [stateRows] = await db.query(
//             'SELECT state FROM listings WHERE id = ? FOR UPDATE', [listing_id] );
    
//         if (stateRows[0]?.state !== 'none') {
//             await db.query('UPDATE listings SET state = ? WHERE id = ?', ['none', listing_id]);
//         }

//         revalidatePath(`/listings/${listing_id}`); 

//         const rows = await userListing(listing_id);
//         if (rows?.error) {
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; 
//         }
//         return rows

//     } catch (error) {
//         console.error("Database error:", error);
//         return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };    
//     }
// }

// export async function removeImage(value_id, fileName) {
//     try {
//         // const rate_limiter = await RateLimiter('image');
//         // if(!rate_limiter){
//         //     return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard." };
//         // }

//         const listing_id = await SanitizeId(value_id)
//         if(!listing_id){ 
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
//         }

//         const user_id = await UserAuthorized(listing_id)
//         if(!user_id){ 
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
//         }
        
//         if(typeof fileName !== 'string'){
//             console.warn(`User ${user_id} is sending invalid image_name for listing_id ${listing_id}`);
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
//         }

//         const image_name = xss(fileName).trim(); 

//         const [existingImage] = await db.query("SELECT * FROM images WHERE name = ? AND listing_id = ?", [image_name, listing_id]);
//         if (existingImage.length === 0) {
//             console.log(`image: ${image_name} and listing ${listing_id} dont match`);
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; //hack attemp
//         }
        
//         const [imageCount] = await db.query("SELECT COUNT(*) AS count FROM images WHERE listing_id = ?", [listing_id]);
//         if (imageCount[0].count <= 1) {
//             return { error: "Opération échouée: chaque centre doit avoir au moins une image."};
//         }

//         const [result] = await db.query("DELETE FROM images WHERE name = ?", [image_name]);
        
//         const [isImageDeleted] = await db.query("SELECT COUNT(*) AS count FROM images WHERE name = ?", [image_name]).count === 0;
//         if (isImageDeleted) {
//             const uploadDir = path.join(process.cwd(), "_upl/listings");
//             const filePath = path.join(uploadDir, image_name);

//             try {
//                 await fs.unlink(filePath);
//                 console.log("Image file deleted:", image_name);
//             } catch (err) {
//                 console.error("Error deleting the image file:", err);
//                 return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; 
//             }

//             const rows = await userListing(listing_id);
//             if (rows?.error) {
//                 return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; 
//             }
//             return rows

//         } else {
//             console.log('Failed to delete image record from database');
//             return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
//         }

//     } catch (error) {
//         console.error("Database error:", error);
//         return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };    
//     }
// }






        // const image_count = db.prepare('SELECT COUNT(*) AS total FROM images WHERE listing_id = ?').all(listing_id)
        // if(image_count[0]?.total >= 3) {
        //     console.log(`Listing ${listing_id} already has 3 images, cannot upload more`);
        //     return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; //hack attemp
        // }
        // const listing = db.prepare(`SELECT images FROM listings WHERE id = ?`).get(listing_id)
        // if(listing && listing.images === 0){
        //     db.prepare(`UPDATE listings SET images = ? WHERE id = ?`).run(1, listing_id)
        // }
                // const listing_state = db.prepare(`SELECT state FROM listings WHERE id = ?`).get(listing_id)
        // if(listing_state?.state !== 'none'){
        //     db.prepare(`UPDATE listings SET state = ? WHERE id = ?`).run('none', listing_id);
        // }
// export async function ModifyServices(value_id, new_value) {
//     try {
//         const rate_limiter = await RateLimiter('modify');
//         if(!rate_limiter){
//             return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
//         }

//         const listing_id = await SanitizeId(value_id)
//         if(!listing_id){ 
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }

//         const user_id = await UserAuthorized(listing_id)
//         if(!user_id){ 
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
//         //------------------------------------------------------------------------- 

        // const db_table = "services";
        // const db_list = "serviceslist"

//         if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
//             console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
        
//         const newValues = new_value.map((item) => xss(item));

//         if(newValues.length === 0){
//             return { error: { server: "Vous devez sélectionner au moins une valeur." } };
//         }

//         const count = db.prepare("SELECT COUNT(*) AS count FROM offerslist").get();
//         if(newValues?.length > count?.count){
//             console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }

//         const previousValues = db.prepare(`SELECT name FROM ${db_table} WHERE listing_id = ?`)
//             .all(listing_id).map(item => item.name); 
        
//         const allValues = db.prepare(`SELECT name FROM ${db_list}`).all().map(item => item.name);

//         const maliciousValues = newValues.filter(value => !allValues.includes(value));
//         if(maliciousValues.length > 0){
//             console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
        
//         const result = db.transaction(() => { //row already locked
//             for (const value of allValues) {
//                 if (previousValues.includes(value) && !newValues.includes(value)) {
//                     const itemsCount = db.prepare(`SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ?`).get(listing_id).count;
//                     if (itemsCount > 1) {
//                         db.prepare(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`).run(value, listing_id);
//                     } else {
//                         console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
//                         return { error: true};
//                     }
                    
//                 } else if (newValues.includes(value) && !previousValues.includes(value)) {
//                     const icon = db.prepare(`SELECT icon FROM ${db_list} WHERE name = ?`).get(value)
//                     db.prepare(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`).run(value, listing_id, icon.icon);
//                 }
//             }
//             return { success: true };
//         })();

//         if (result?.error){
//             return { error: { server: "Vous devez conserver au moins une valeur."} };
//         }

//         const listing = db.prepare(`SELECT ${db_table} FROM listings WHERE id = ?`).get(listing_id)
//         if(listing && Object.values(listing)[0] === 0){
//             db.prepare(`UPDATE listings SET ${db_table} = ? WHERE id = ?`).run(1, listing_id)
//         }
        
//         const rows = userListing(listing_id);
//         if (rows.length === 0) return []; 
//         return rows

//     } catch (error) {
//         console.error("Database error:", error);
//         return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
//     }
// }

// export async function ModifySubjects(value_id, new_value) {
//     try {
//         const rate_limiter = await RateLimiter('modify');
//         if(!rate_limiter){
//             return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
//         }

//         const listing_id = await SanitizeId(value_id)
//         if(!listing_id){ 
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }

//         const user_id = await UserAuthorized(listing_id)
//         if(!user_id){ 
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
//         //------------------------------------------------------------------------- 

//         const db_table = "subjects";
//         const db_list = "subjectslist"

//         if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
//             console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
        
//         const newValues = new_value.map((item) => xss(item));

//         if(newValues.length === 0){
//             return { error: { server: "Vous devez sélectionner au moins une valeur." } };
//         }

//         const count = db.prepare("SELECT COUNT(*) AS count FROM offerslist").get();
//         if(newValues?.length > count?.count){
//             console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }

//         const previousValues = db.prepare(`SELECT name FROM ${db_table} WHERE listing_id = ?`)
//             .all(listing_id).map(item => item.name); 
        
//         const allValues = db.prepare(`SELECT name FROM ${db_list}`).all().map(item => item.name);

//         const maliciousValues = newValues.filter(value => !allValues.includes(value));
//         if(maliciousValues.length > 0){
//             console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
        
//         const result = db.transaction(() => { //row already locked
//             for (const value of allValues) {
//                 if (previousValues.includes(value) && !newValues.includes(value)) {
//                     const itemsCount = db.prepare(`SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ?`).get(listing_id).count;
//                     if (itemsCount > 1) {
//                         db.prepare(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`).run(value, listing_id);
//                     } else {
//                         console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
//                         return { error: true};
//                     }
//                 } else if (newValues.includes(value) && !previousValues.includes(value)) {
//                     // db.prepare(`INSERT INTO ${db_table} (name, listing_id) VALUES (?, ?)`).run(value, listing_id);
//                     const icon = db.prepare(`SELECT icon FROM ${db_list} WHERE name = ?`).get(value)
//                     db.prepare(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`).run(value, listing_id, icon.icon);        
//                 }
//             }
//             return { success: true };
//         })();

//         if (result?.error){
//             return { error: { server: "Vous devez conserver au moins une valeur."} };
//         }

//         const listing = db.prepare(`SELECT ${db_table} FROM listings WHERE id = ?`).get(listing_id)
//         if(listing && Object.values(listing)[0] === 0){
//             db.prepare(`UPDATE listings SET ${db_table} = ? WHERE id = ?`).run(1, listing_id)
//         }
        
//         const rows = userListing(listing_id);
//         if (rows.length === 0) return []; 
//         return rows

//     } catch (error) {
//         console.error("Database error:", error);
//         return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
//     }
// }

// export async function ModifyLevels(value_id, new_value) {
//     try {
//         const rate_limiter = await RateLimiter('modify');
//         if(!rate_limiter){
//             return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
//         }

//         const listing_id = await SanitizeId(value_id)
//         if(!listing_id){ 
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }

//         const user_id = await UserAuthorized(listing_id)
//         if(!user_id){ 
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
//         //------------------------------------------------------------------------- 

//         const db_table = "levels"; ModifyLevels
//         const db_list = "levelslist"

//         if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
//             console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
        
//         const newValues = new_value.map((item) => xss(item));

//         if(newValues.length === 0){
//             return { error: { server: "Vous devez sélectionner au moins une valeur." } };
//         }

//         const count = db.prepare("SELECT COUNT(*) AS count FROM offerslist").get();
//         if(newValues?.length > count?.count){
//             console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }

//         const previousValues = db.prepare(`SELECT name FROM ${db_table} WHERE listing_id = ?`)
//             .all(listing_id).map(item => item.name); 
        
//         const allValues = db.prepare(`SELECT name FROM ${db_list}`).all().map(item => item.name);

//         const maliciousValues = newValues.filter(value => !allValues.includes(value));
//         if(maliciousValues.length > 0){
//             console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
//             return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
        
//         const result = db.transaction(() => { //row already locked
//             for (const value of allValues) {
//                 if (previousValues.includes(value) && !newValues.includes(value)) {
//                     const itemsCount = db.prepare(`SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ?`).get(listing_id).count;
//                     if (itemsCount > 1) {
//                         db.prepare(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`).run(value, listing_id);
//                     } else {
//                         console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
//                         return { error: true};
//                     }
//                 } else if (newValues.includes(value) && !previousValues.includes(value)) {
//                     // db.prepare(`INSERT INTO ${db_table} (name, listing_id) VALUES (?, ?)`).run(value, listing_id);
//                     const icon = db.prepare(`SELECT icon FROM ${db_list} WHERE name = ?`).get(value)
//                     db.prepare(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`).run(value, listing_id, icon.icon);
//                 }
//             }
//             return { success: true };
//         })();

//         if (result?.error){
//             return { error: { server: "Vous devez conserver au moins une valeur."} };
//         }

//         const listing = db.prepare(`SELECT ${db_table} FROM listings WHERE id = ?`).get(listing_id)
//         if(listing && Object.values(listing)[0] === 0){
//             db.prepare(`UPDATE listings SET ${db_table} = ? WHERE id = ?`).run(1, listing_id)
//         }
        
//         const rows = userListing(listing_id);
//         if (rows.length === 0) return []; 
//         return rows

//     } catch (error) {
//         console.error("Database error:", error);
//         return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
//     }
// }

