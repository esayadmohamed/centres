'use server';
import cloudinary from '@/_lib/cloudinary';
import { NextResponse } from 'next/server';

import { removeListing } from "@/_lib/listings/editlisting";
import { userListings } from '@/_lib/listings/test';

export async function POST(req, res) {
    
    const body = await req.json(); 
    const imagesList = body.images;
    const id = body.id;
  
    //validate image array

    try {
        const rows = await removeListing(id, imagesList)        
        if (!rows) {
            return NextResponse.json({ error: 'Impossible de supprimer l\'image ou image introuvable.' }, { status: 400 });
        }

        if ( Array.isArray(imagesList) || imagesList.length !== 0 || imagesList.every(img => typeof img === 'string') ) {
            const images = imagesList.map(name => name.split('.').slice(0, -1).join('.'));
            
            const promises = images.map(fileName => 
                cloudinary.uploader.destroy(fileName, { invalidate: true })
            );

            await Promise.all(promises); 
        }

        const listings = await userListings(id);
        
        if (listings.error) {
            return NextResponse.json({ error: 'Échec de l\'actualisation de l\'annonce.' }, { status: 400 });
        } 

        return NextResponse.json({ 
            success: true, listings
        });

    } catch (err) {
        console.error('Erreur lors de la suppression de l\'image :', err);
        return NextResponse.json({ error: 'Échec de la suppression de l\'image.', message: err.message }, { status: 500 });
    }
}
 

// const result = await cloudinary.uploader.destroy(fileName, { invalidate: true });
// if (result.result !== 'ok') {
//     return NextResponse.json({ error: 'Échec de la suppression de l\'image.' }, { status: 400 });
// } 
