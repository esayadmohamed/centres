'use server';
import db from "@/_lib/db";

// const sql = require("better-sqlite3");
// const db = sql("main.db");

import xss from 'xss';
import fs from 'node:fs/promises';
import path from 'node:path';

import { revalidatePath } from "next/cache";

import { UserAuthorized } from '@/_lib/utils/userauth';
import { SanitizeId } from '@/_lib/utils/sanitizedata';
import { SanitizeImage } from '@/_lib/utils/sanitizedata';

import { RateLimiter } from "@/_lib/utils/ratelimiter";

import { userListing } from './getdata';

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

        const hoodSubmitted = db.prepare("SELECT * FROM suggestedhoods WHERE listing_id = ?").get(listing_id);
        if(hoodSubmitted) return {error: "Une suggestion de quartier a déjà été enregistrée."};

        const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(listing_id);
        if(!listing) return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };   

        const transaction = db.transaction(() => {
            db.prepare(`INSERT INTO suggestedhoods (name, city, listing_id, user_id) VALUES (?, ?, ?, ?)`)
                .run(hood, listing.city, listing.id, user_id)
        })
        
        transaction();
        revalidatePath(`/listings/${listing_id}`);

        const rows = userListing(listing_id);
        if (rows.length === 0) return []; 
        return rows

    }catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };    
    }

}

// ---------------------------------------------------------------

export async function ModifyInfo (value_id, new_value) {
    try {
        const rate_limiter = await RateLimiter('modify');
        if(!rate_limiter){
            return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
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


        const transaction = db.transaction(() => {
            db.prepare(`UPDATE listings SET info = ?, state = ? WHERE id = ?`).run(info, 'none', listing_id);
        });

        transaction();
        revalidatePath(`/listings/${listing_id}`);

        const rows = userListing(listing_id);
        if (rows.length === 0) return []; 
        return rows

    }catch (error) {
        console.error("Database error:", error);
        return { error:  "Une erreur est survenue. Veuillez réessayer plus tard." };    
    }

}

// ---------------------------------------------------------------

export async function ModifyPhone(value_id, new_value) {
    try {
        const rate_limiter = await RateLimiter('modify');
        if(!rate_limiter){
            return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        }

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

        const transaction = db.transaction(() => {
            db.prepare(`UPDATE listings SET phone = ? WHERE id = ?`).run(phone, listing_id);
        });

        transaction();
        revalidatePath(`/listings/${listing_id}`);
        
        const rows = userListing(listing_id);
        if (rows.length === 0) return []; 
        return rows

    }catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
    }

}

// ---------------------------------------------------------------

export async function ModifyOffers(value_id, new_value) {
    try {
        const rate_limiter = await RateLimiter('modify');
        if(!rate_limiter){
            return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        //------------------------------------------------------------------------- 

        const db_table = "offers";
        const db_list = "offerslist"

        if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        
        const newValues = new_value.map((item) => xss(item));

        if(newValues.length === 0){
            return { error: { server: "Vous devez sélectionner au moins une valeur." } };
        }

        const count = db.prepare("SELECT COUNT(*) AS count FROM offerslist").get();
        if(newValues?.length > count?.count){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const previousValues = db.prepare(`SELECT name FROM ${db_table} WHERE listing_id = ?`)
            .all(listing_id).map(item => item.name); 
        
        const allValues = db.prepare(`SELECT name FROM ${db_list}`).all().map(item => item.name);

        const maliciousValues = newValues.filter(value => !allValues.includes(value));
        if(maliciousValues.length > 0){
            console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const result = db.transaction(() => { //row already locked
            for (const value of allValues) {
                if (previousValues.includes(value) && !newValues.includes(value)) {
                    const itemsCount = db.prepare(`SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ?`).get(listing_id).count;
                    if (itemsCount > 1) {
                        db.prepare(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`).run(value, listing_id);
                    } else {
                        console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
                        return { error: true};
                    }
                    
                    
                } else if (newValues.includes(value) && !previousValues.includes(value)) {
                    // db.prepare(`INSERT INTO ${db_table} (name, listing_id) VALUES (?, ?)`).run(value, listing_id);
                    const icon = db.prepare(`SELECT icon FROM ${db_list} WHERE name = ?`).get(value)
                    db.prepare(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`).run(value, listing_id, icon.icon);

                }
            }
            return { success: true };
        })();

        if (result?.error){
            return { error: { server: "Vous devez conserver au moins une valeur."} };
        }

        const listing = db.prepare(`SELECT ${db_table} FROM listings WHERE id = ?`).get(listing_id)
        if(listing && Object.values(listing)[0] === 0){
            db.prepare(`UPDATE listings SET ${db_table} = ? WHERE id = ?`).run(1, listing_id)
        }
        
        const rows = userListing(listing_id);
        if (rows.length === 0) return []; 
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
    }
}

export async function ModifyServices(value_id, new_value) {
    try {
        const rate_limiter = await RateLimiter('modify');
        if(!rate_limiter){
            return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        //------------------------------------------------------------------------- 

        const db_table = "services";
        const db_list = "serviceslist"

        if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        
        const newValues = new_value.map((item) => xss(item));

        if(newValues.length === 0){
            return { error: { server: "Vous devez sélectionner au moins une valeur." } };
        }

        const count = db.prepare("SELECT COUNT(*) AS count FROM offerslist").get();
        if(newValues?.length > count?.count){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const previousValues = db.prepare(`SELECT name FROM ${db_table} WHERE listing_id = ?`)
            .all(listing_id).map(item => item.name); 
        
        const allValues = db.prepare(`SELECT name FROM ${db_list}`).all().map(item => item.name);

        const maliciousValues = newValues.filter(value => !allValues.includes(value));
        if(maliciousValues.length > 0){
            console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        
        const result = db.transaction(() => { //row already locked
            for (const value of allValues) {
                if (previousValues.includes(value) && !newValues.includes(value)) {
                    const itemsCount = db.prepare(`SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ?`).get(listing_id).count;
                    if (itemsCount > 1) {
                        db.prepare(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`).run(value, listing_id);
                    } else {
                        console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
                        return { error: true};
                    }
                    
                } else if (newValues.includes(value) && !previousValues.includes(value)) {
                    const icon = db.prepare(`SELECT icon FROM ${db_list} WHERE name = ?`).get(value)
                    db.prepare(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`).run(value, listing_id, icon.icon);
                }
            }
            return { success: true };
        })();

        if (result?.error){
            return { error: { server: "Vous devez conserver au moins une valeur."} };
        }

        const listing = db.prepare(`SELECT ${db_table} FROM listings WHERE id = ?`).get(listing_id)
        if(listing && Object.values(listing)[0] === 0){
            db.prepare(`UPDATE listings SET ${db_table} = ? WHERE id = ?`).run(1, listing_id)
        }
        
        const rows = userListing(listing_id);
        if (rows.length === 0) return []; 
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
    }
}

export async function ModifySubjects(value_id, new_value) {
    try {
        const rate_limiter = await RateLimiter('modify');
        if(!rate_limiter){
            return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        //------------------------------------------------------------------------- 

        const db_table = "subjects";
        const db_list = "subjectslist"

        if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        
        const newValues = new_value.map((item) => xss(item));

        if(newValues.length === 0){
            return { error: { server: "Vous devez sélectionner au moins une valeur." } };
        }

        const count = db.prepare("SELECT COUNT(*) AS count FROM offerslist").get();
        if(newValues?.length > count?.count){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const previousValues = db.prepare(`SELECT name FROM ${db_table} WHERE listing_id = ?`)
            .all(listing_id).map(item => item.name); 
        
        const allValues = db.prepare(`SELECT name FROM ${db_list}`).all().map(item => item.name);

        const maliciousValues = newValues.filter(value => !allValues.includes(value));
        if(maliciousValues.length > 0){
            console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        
        const result = db.transaction(() => { //row already locked
            for (const value of allValues) {
                if (previousValues.includes(value) && !newValues.includes(value)) {
                    const itemsCount = db.prepare(`SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ?`).get(listing_id).count;
                    if (itemsCount > 1) {
                        db.prepare(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`).run(value, listing_id);
                    } else {
                        console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
                        return { error: true};
                    }
                } else if (newValues.includes(value) && !previousValues.includes(value)) {
                    // db.prepare(`INSERT INTO ${db_table} (name, listing_id) VALUES (?, ?)`).run(value, listing_id);
                    const icon = db.prepare(`SELECT icon FROM ${db_list} WHERE name = ?`).get(value)
                    db.prepare(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`).run(value, listing_id, icon.icon);        
                }
            }
            return { success: true };
        })();

        if (result?.error){
            return { error: { server: "Vous devez conserver au moins une valeur."} };
        }

        const listing = db.prepare(`SELECT ${db_table} FROM listings WHERE id = ?`).get(listing_id)
        if(listing && Object.values(listing)[0] === 0){
            db.prepare(`UPDATE listings SET ${db_table} = ? WHERE id = ?`).run(1, listing_id)
        }
        
        const rows = userListing(listing_id);
        if (rows.length === 0) return []; 
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
    }
}

export async function ModifyLevels(value_id, new_value) {
    try {
        const rate_limiter = await RateLimiter('modify');
        if(!rate_limiter){
            return { error: { server: "Le serveur est actuellement occupé, veuillez réessayer plus tard." } };
        }

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const user_id = await UserAuthorized(listing_id)
        if(!user_id){ 
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        //------------------------------------------------------------------------- 

        const db_table = "levels";
        const db_list = "levelslist"

        if(!Array.isArray(new_value) || !new_value.every(item => typeof item === 'string')){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        
        const newValues = new_value.map((item) => xss(item));

        if(newValues.length === 0){
            return { error: { server: "Vous devez sélectionner au moins une valeur." } };
        }

        const count = db.prepare("SELECT COUNT(*) AS count FROM offerslist").get();
        if(newValues?.length > count?.count){
            console.warn(`Possible malicious attempt detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }

        const previousValues = db.prepare(`SELECT name FROM ${db_table} WHERE listing_id = ?`)
            .all(listing_id).map(item => item.name); 
        
        const allValues = db.prepare(`SELECT name FROM ${db_list}`).all().map(item => item.name);

        const maliciousValues = newValues.filter(value => !allValues.includes(value));
        if(maliciousValues.length > 0){
            console.warn(`Possible malicious value detected! User ID: ${user_id}, Listing ID: ${listing_id}, Table: ${db_table}, Value: ${maliciousValues}`);
            return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
        }
        
        const result = db.transaction(() => { //row already locked
            for (const value of allValues) {
                if (previousValues.includes(value) && !newValues.includes(value)) {
                    const itemsCount = db.prepare(`SELECT COUNT(*) AS count FROM ${db_table} WHERE listing_id = ?`).get(listing_id).count;
                    if (itemsCount > 1) {
                        db.prepare(`DELETE FROM ${db_table} WHERE name = ? AND listing_id = ?`).run(value, listing_id);
                    } else {
                        console.log(`Invalid ${db_table} suggested for listing_id:`, listing_id);
                        return { error: true};
                    }
                } else if (newValues.includes(value) && !previousValues.includes(value)) {
                    // db.prepare(`INSERT INTO ${db_table} (name, listing_id) VALUES (?, ?)`).run(value, listing_id);
                    const icon = db.prepare(`SELECT icon FROM ${db_list} WHERE name = ?`).get(value)
                    db.prepare(`INSERT INTO ${db_table} (name, listing_id, icon) VALUES (?, ?, ?)`).run(value, listing_id, icon.icon);
                }
            }
            return { success: true };
        })();

        if (result?.error){
            return { error: { server: "Vous devez conserver au moins une valeur."} };
        }

        const listing = db.prepare(`SELECT ${db_table} FROM listings WHERE id = ?`).get(listing_id)
        if(listing && Object.values(listing)[0] === 0){
            db.prepare(`UPDATE listings SET ${db_table} = ? WHERE id = ?`).run(1, listing_id)
        }
        
        const rows = userListing(listing_id);
        if (rows.length === 0) return []; 
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };    
    }
}

// ---------------------------------------------------------------

async function InsertImage(file, listing_id) {

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
    try {
        const rate_limiter = await RateLimiter('image');
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

        const sanitization = await SanitizeImage(new_value);
        if (!sanitization) {
            console.log(`Invalid image file for listing ${listing_id}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; //hack attemp
        }

        //--------------------------------------------------------- 

        const file_name = await InsertImage(new_value, listing_id)
        if(!file_name) {
            console.log(`Unable to upload image file for listing: ${listing_id} in database`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; //hack attemp
        }

        const image_count = db.prepare('SELECT COUNT(*) AS total FROM images WHERE listing_id = ?').all(listing_id)
        if(image_count[0]?.total >= 3) {
            console.log(`Listing ${listing_id} already has 3 images, cannot upload more`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; //hack attemp
        }

        db.prepare(`INSERT INTO images (name, listing_id) VALUES (?, ?)`)
        .run(file_name, listing_id);

        const listing = db.prepare(`SELECT images FROM listings WHERE id = ?`).get(listing_id)
        if(listing && listing.images === 0){
            db.prepare(`UPDATE listings SET images = ? WHERE id = ?`).run(1, listing_id)
        }
        
        const listing_state = db.prepare(`SELECT state FROM listings WHERE id = ?`).get(listing_id)
        // console.log(listing_state.state);
        if(listing_state?.state !== 'none'){
            db.prepare(`UPDATE listings SET state = ? WHERE id = ?`).run('none', listing_id);
        }

        revalidatePath(`/listings/${listing_id}`); 

        const rows = userListing(listing_id);
        if (rows.length === 0) return []; 
        return rows

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };    
    }
}

export async function removeImage(value_id, fileName) {
    try {
        const rate_limiter = await RateLimiter('image');
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
        
        if(typeof fileName !== 'string'){
            console.warn(`User ${user_id} is sending invalid image_name for listing_id ${listing_id}`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

        const image_name = xss(fileName).trim(); 

        const existingImage = db.prepare("SELECT * FROM images WHERE name = ? AND listing_id = ?")
        .get(image_name, listing_id);
        if (!existingImage) {
            console.log(`image: ${image_name} and listing ${listing_id} dont match`);
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; //hack attemp
        }
        
        const imageCount = db.prepare("SELECT COUNT(*) AS count FROM images WHERE listing_id = ?").get(listing_id);
        if (imageCount.count <= 1) {
            return { error: "Opération échouée: chaque centre doit avoir au moins une image."};
        }

        const result = db.prepare("DELETE FROM images WHERE name = ?").run(image_name);
        const isImageDeleted = db.prepare("SELECT COUNT(*) AS count FROM images WHERE name = ?").get(image_name).count === 0;
        if (isImageDeleted) {
            const uploadDir = path.join(process.cwd(), "_upl/listings");
            const filePath = path.join(uploadDir, image_name);

            try {
                await fs.unlink(filePath);
                console.log("Image file deleted:", image_name);
            } catch (err) {
                console.error("Error deleting the image file:", err);
                return { error: "Une erreur est survenue. Veuillez réessayer plus tard." }; 
            }

            const rows = userListing(listing_id);
            if (rows.length === 0) return []; 
            return rows

        } else {
            console.log('Failed to delete image record from database');
            return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
        }

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };    
    }
}
