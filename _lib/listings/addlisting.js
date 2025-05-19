'use server';
import getDB from "@/_lib/db";

import xss from 'xss';
import { revalidatePath } from "next/cache";

import { UserAuthenticated } from '@/_lib/utils/userauth';
// import { SanitizeObject } from '@/_lib/utils/sanitizedata';

import { RateLimiter } from '@/_lib/utils/ratelimiter';
import { verifyCaptcha } from "@/_lib/utils/captcha";

const db = getDB();

// --------------------------------------------------------
// --------------------------------------------------------

function SanitizeObject(obj){
    
    if(!obj) return null

    if(typeof obj !== 'object') return null
    if(Object.prototype.toString.call(obj) !== '[object Object]') return null

    if(!Object.hasOwn(obj, 'name') 
        || !Object.hasOwn(obj, 'info') 
        || !Object.hasOwn(obj, 'phone')
        || !Object.hasOwn(obj, 'city')
        || !Object.hasOwn(obj, 'hood')
        || !Object.hasOwn(obj, 'captchaToken')){
        return null
    }

    if(typeof obj.name !== 'string'
        || typeof obj.info !== 'string'
        || typeof obj.phone !== 'string'
        || typeof obj.city !== 'string'
        || typeof obj.hood !== 'string'){
        return null
    }

    return obj;
}

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
    // } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,-:?!']+$/.test(inputs.info)) {
    //     errors.info = "Le description ne doit pas contenir de caractères spéciaux";
    // }
    } else if (/[<>{}\[\]();\\`\/&|$^%#@~]/.test(inputs.info)) {
        errors.info = "Le description ne doit pas contenir de caractères spéciaux";
    }

    if (!inputs.city || inputs.city === "" || inputs.city.length < 2 || inputs.city.length > 50) {
        errors.location = "La ville fourni n'est pas valide";
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(inputs.city)) {
        errors.location = "La ville fourni n'est pas valide";
    } else if (!inputs.hood || inputs.hood === "" || inputs.hood.length < 2 || inputs.hood.length > 50) {
        errors.location = "La quartier fourni n'est pas valide";
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(inputs.hood)) {
        errors.location = "Le quartier fourni n'est pas valide";
    } 

    if (!inputs.phone || inputs.phone === "") {
        errors.phone = "Le numéro de téléphone fourni n'est pas valide";
    }  else if (!/^(05|06|07)\d{8}$/.test(inputs.phone)){ 
        errors.phone = "Le numéro de téléphone fourni n'est pas valide";
    }

    return Object.keys(errors).length > 0 ? errors : null;

}

async function verifyUserData(inputs, user_id) {
    let errors = {};
    try{ 
        const [names] = await db.query("SELECT name FROM listings WHERE user_id = ?",[user_id]);
        const name_list = names.length > 0 ? names.map(item => item.name.toLowerCase()) : [];
        const duplicate = name_list.includes(inputs.name.toLowerCase())
        if (duplicate) errors.name = "Une annonce avec ce nom existe déjà";

        const [city] = await db.query("SELECT * FROM cities WHERE name = ?",[inputs.city]);
        const [hood] = await db.query("SELECT * FROM neighborhoods WHERE name = ? AND city_id = ?",[inputs.hood, city[0].id]);

        if (city.length === 0) errors.location = "L'emplacement fournie n'est pas valide";
        if (hood.length === 0) errors.location = "L'emplacement fournie n'est pas valide";

        return Object.keys(errors).length > 0 ? errors : null;
    } catch (error) {
        console.error("Database error:", error);
        return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
    }
}

export async function CreateListing (data){
    try{ 
        const rate_limiter = await RateLimiter('create');
        if(!rate_limiter){
            return { error: "Le serveur est actuellement occupé, veuillez réessayer plus tard." };
        }
        
        const user_id = await UserAuthenticated()
        if(!user_id){
            return {error: {server: "Une erreur est survenue. Veuillez réessayer plus tard."}}; 
        }
        
        const [count] = await db.query("SELECT COUNT(*) AS count FROM listings WHERE user_id = ?",[user_id]);
        if(count[0].count >= 10){
            return {error: {server: "Vous ne pouvez pas créer plus de 10 annonces."}};
        }

        const obj_value = await SanitizeObject (data)
        if(!obj_value){ 
            console.warn(`User_id: ${user_id} is sending malicious data to create a listing}`);
            return {error: {server: "Une erreur est survenue. Veuillez réessayer plus tard."}}; 
        }

        if(!data.captchaToken || typeof data.captchaToken !== 'string'){
            return { error: { captcha: "Vous devez compléter le CAPTCHA pour continuer." } };
        }

        const inputs = {
            name: xss(obj_value.name).trim(),
            info: xss(obj_value.info).trim(),
            city: xss(obj_value.city).trim(),
            hood: xss(obj_value.hood).trim(),
            phone: xss(obj_value.phone).trim(),
            captchaToken: xss(data.captchaToken).trim()
        }
     
        const captcha = await verifyCaptcha(inputs.captchaToken)
        if (!captcha) {
            return { error: { captcha: "Échec de la vérification du CAPTCHA." } };
        }

        const validationErrors = validateUserData(inputs);
        if (validationErrors) {
            return {error: validationErrors};
        }        

        const verificationErrors = await verifyUserData(inputs, user_id);
        if (verificationErrors) {            
            return {error: verificationErrors};
        }
        
        const [result] = await db.query(`INSERT INTO listings (user_id, name, info, city, hood, phone) VALUES (?, ?, ?, ?, ?, ?)`
            ,[user_id, inputs.name, inputs.info, inputs.city, inputs.hood, inputs.phone]);
                    
        const center_id = result.insertId; 
        
        revalidatePath(`/listings`);

        return { center_id: center_id } 
        
    } catch (error) {
        console.error("Database error:", error);
        return {error: {server: "Une erreur est survenue. Veuillez réessayer plus tard."}};    
    }

}


