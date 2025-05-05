import cloudinary from '@/_lib/cloudinary';
import { NextResponse } from 'next/server';

import { CheckImage, InsertImage } from '@/_lib/listings/editdata';
import { userListing } from '@/_lib/listings/test';

export async function POST(req) { // translate errors to french

    const formData = await req.formData();

    const file = formData.get('file');
    const rawId = formData.get('id');
    const id = rawId ? parseInt(rawId, 10) : null;

    if (!file || !id) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const result = await CheckImage(id, file)
    if (!result || !result.success) {
        return NextResponse.json({ error: 'Image upload failed or invalid file' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (err, result) => {
            if (err) {
              return reject(NextResponse.json({ error: err.message }, { status: 500 }));
            }
      
            try {
                const file_name = `${result.public_id}.${result.format}`;
          
                const rows = await InsertImage(id, file_name)
                if (!rows) {
                    return NextResponse.json({ error: 'Impossible de supprimer l\'image ou image introuvable.' }, { status: 400 });
                }

                const listings = await userListing(id);
                if (listings.error) {
                    return NextResponse.json({ error: 'Échec de l\'actualisation de l\'annonce.' }, { status: 400 });
                } 

                resolve(NextResponse.json({
                    success: true,
                    listings,
                }));
        
            } catch (dbError) {
                console.error("Database error while saving image:", dbError);
                reject(NextResponse.json({ error: 'Failed to save image info to database' }, { status: 500 }));
            }
        }).end(buffer);
    });
      
}




    // return new Promise((resolve, reject) => {

    //     cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
            
    //         if (err) return reject(NextResponse.json({ error: err.message }, { status: 500 }));
            
    //         resolve(NextResponse.json(result));
        
    //     }).end(buffer);

    // });