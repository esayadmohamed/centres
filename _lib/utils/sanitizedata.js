'use server'

import xss from "xss";
import sharp from "sharp";
import imageType from "image-type";

export async function SanitizeId(id){
    
    if(!id && id !== 0) return null

    if (typeof id === "string" && /^\d+$/.test(id)) {
        id = Number(id);
    }

    if (!Number.isInteger(id)) {
        console.error("Invalid input type, expected a number.");
        return null;
    }

    return id;
}

export async function SanitizeObject(obj){
    
    if(!obj) return null //1

    if(typeof obj !== 'object') return null //2
    if(Object.prototype.toString.call(obj) !== '[object Object]') return null

    if(!Object.hasOwn(obj, 'name') 
        || !Object.hasOwn(obj, 'info') 
        || !Object.hasOwn(obj, 'city') 
        || !Object.hasOwn(obj, 'hood')
        || !Object.hasOwn(obj, 'phone')){
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

export async function SanitizeImage(image) {
    
    if (!image) return null;
    
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/png", "image/jpeg", "image/bmp"];

    try {
        const arrayBuffer = await image.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        const result = await sharp(imageBuffer).metadata();

        if (!result) return null;  

        if (imageBuffer.length > maxSize) return null;  

        const type = await imageType(imageBuffer);
        if (!type || !allowedTypes.includes(type.mime)) return null;

        return {success: true}
        
    } catch (error) {
        console.error("Error SanitizeImage:", error);
        return null;
    }

}
