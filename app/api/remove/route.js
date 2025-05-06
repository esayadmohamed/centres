import cloudinary from '@/_lib/cloudinary';
import { NextResponse } from 'next/server';

import { RemoveImage } from '@/_lib/listings/editdata';
import { userListing } from '@/_lib/listings/test';

export async function POST(req) {
    
    const formData = await req.formData();
  
    const imageName = formData.get('imageName');
    const fileName  = imageName.split('.')[0];

    const rawId = formData.get('id');
    const id = rawId ? parseInt(rawId, 10) : null;

    if (!imageName || !id) {
        return NextResponse.json({ error: 'Aucun identifiant ou nom d\'image fourni.' }, { status: 400 });
    }

    try {
        const rows = await RemoveImage(id, imageName);
        if (!rows) {
            return NextResponse.json({ error: 'Impossible de supprimer l\'image ou image introuvable.' }, { status: 400 });
        }

        const result = await cloudinary.uploader.destroy(fileName, { invalidate: true });
        if (result.result !== 'ok') {
            return NextResponse.json({ error: 'Échec de la suppression de l\'image.' }, { status: 400 });
        } 
        
        const listings = await userListing(id);

        if (listings.error) {
            return NextResponse.json({ error: 'Échec de l’actualisation de l\'annonce.' }, { status: 400 });
        } 

        return NextResponse.json({ 
            success: true, listings
        });

    } catch (err) {
        console.error('Erreur lors de la suppression de l\'image :', err);
        return NextResponse.json({ error: 'Échec de la suppression de l\'image.', message: err.message }, { status: 500 });
    }
}
 


