'use server';
import db from "@/_lib/db";

// const sql = require("better-sqlite3");
// const db = sql("main.db");

import xss from 'xss';
import { revalidatePath } from "next/cache";

import { UserAuthenticated } from '@/_lib/utils/userauth';
import { SanitizeObject } from '@/_lib/utils/sanitizedata';

import { RateLimiter } from '@/_lib/utils/ratelimiter';

// -----------------------------------------

const handleDbError = (error) => {
    console.error("Database error:", error);
    return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
};

function validateUserData(inputs) {
    
    let errors = {};

    if (!inputs.name 
        || inputs.name === ""
        || inputs.name.length < 2 
        || inputs.name.length > 50 
        || !/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s,.'"-]+$/.test(inputs.name) ) {
            errors.name = "Le nom fourni n'est pas valide";
    }

    if (!inputs.info || inputs.info === "" || inputs.info.length < 10) {
        errors.info = "La description fourni n'est pas valide";
    } else if (inputs.info.length > 500) {
        errors.info = "La description ne doit pas dépasser 500 caractères";
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,-:?!']+$/.test(inputs.info)) {
        errors.info = "Le description ne doit pas contenir de caractères spéciaux";
    }

    if (!inputs.city || inputs.city === "" || inputs.city.length < 2 || inputs.city.length > 50) {
        errors.city = "La ville fourni n'est pas valide";
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(inputs.city)) {
        errors.city = "La ville fourni n'est pas valide";
    } 
    
    if (!inputs.hood || inputs.hood === "" || inputs.hood.length < 2 || inputs.hood.length > 50) {
        errors.hood = "La quartier fourni n'est pas valide";
    } else 
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(inputs.hood)) {
        errors.hood = "Le quartier fourni n'est pas valide";
    } 

    if (!inputs.phone || inputs.phone === "") {
        errors.phone = "Le numéro de téléphone fourni n'est pas valide";
    }  else if (!/^(05|06|07)\d{8}$/.test(inputs.phone)){ 
        errors.phone = "Le numéro de téléphone fourni n'est pas valide";
    }

    return Object.keys(errors).length > 0 ? errors : null;

}

function verifyUserData(inputs, user_id) {
    let errors = {};
    
    try{ 
        const names = db.prepare("SELECT name FROM listings WHERE user_id = ?").all(user_id);
        const name_list = names.length > 0 ? names.map(item => item.name.toLowerCase()) : [];
        const duplicate = name_list.includes(inputs.name.toLowerCase())
        if (duplicate) errors.name = "Une annonce avec ce nom existe déjà";

        const city = db.prepare(`SELECT * FROM cities WHERE name = ?`).get(inputs.city);
        const neighborhood = db.prepare(`SELECT * FROM neighborhoods WHERE name = ? AND city_id = ?`).get(inputs.hood, city.id);
        
        if (!city) errors.location = "L'emplacement fournie n'est pas valide";
        if (!neighborhood) errors.location = "L'emplacement fournie n'est pas valide";

        return Object.keys(errors).length > 0 ? errors : null;
    } catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
    }
}

// -----------------------------------------

export async function CreateListing (data){
    try{ 
        const rate_limiter = await RateLimiter('create');
        if(!rate_limiter){
            return { error: {server: "Le serveur est actuellement occupé, veuillez réessayer plus tard."}};
        }

        const user_id = await UserAuthenticated()
        if(!user_id){
            return {error: {server: "Une erreur est survenue. Veuillez réessayer plus tard."}}; 
        }
        
        const count = db.prepare('SELECT COUNT(*) AS count FROM listings WHERE user_id = ?').get(user_id)

        if(count.count >= 10){
            return {error: {server: "Vous ne pouvez pas créer plus de 10 annonces."}};
        }

        const obj_value = await SanitizeObject (data)
        if(!obj_value){ 
            console.warn(`User_id: ${user_id} is sending malicious data to create a listing}`);
            return {error: {server: "Une erreur est survenue. Veuillez réessayer plus tard."}}; 
        }

        const inputs = {
            name: xss(obj_value.name).trim(),
            info: xss(obj_value.info).trim(),
            city: xss(obj_value.city).trim(),
            hood: xss(obj_value.hood).trim(),
            phone: xss(obj_value.phone).trim(),
        }
     
        const validationErrors = validateUserData(inputs);
        if (validationErrors) {
            return {error: validationErrors};
        }
        
        const verificationErrors = verifyUserData(inputs, user_id);
        if (verificationErrors) {            
            return {error: verificationErrors};
        }
        
        const stmt = db.prepare(` INSERT INTO listings (user_id, name, info, city, hood, phone)
            VALUES (?, ?, ?, ?, ?, ?)`)
            
        const result = stmt.run(user_id, inputs.name, inputs.info, inputs.city, inputs.hood, inputs.phone);

        const center_id = result.lastInsertRowid; 
        
        revalidatePath(`/listings`);

        return { center_id: center_id } 
        
    } catch (error) {
        console.error("Database error:", error);
        return {error: {server: "Une erreur est survenue. Veuillez réessayer plus tard."}};    
    }

}


