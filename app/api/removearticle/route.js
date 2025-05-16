'use server';

import cloudinary from '@/_lib/cloudinary';
import { NextResponse } from 'next/server';

import { RemoveArticle } from '@/_lib/dashboard/editdata';
import { allArticles } from '@/_lib/dashboard/getdata';

export async function POST(req) {
    
    const formData = await req.formData();
  
    const imageName = formData.get('imageName');
    const fileName  = imageName.split('.')[0];

    const rawId = formData.get('id');
    const id = rawId ? parseInt(rawId, 10) : null;

    try {
        const rows = await RemoveArticle(id);
        if (rows.error) {
            return NextResponse.json(rows, { status: 400 });
        }

        const result = await cloudinary.uploader.destroy(fileName, { invalidate: true });
        if (result.result !== 'ok') {
            return NextResponse.json({ error: 'Échec de la suppression de l\'image.' }, { status: 400 });
        } 
        
        const articles = await allArticles();

        if (articles.error) {
            return NextResponse.json({ error: 'Échec de l’actualisation des articles.' }, { status: 400 });
        } 

        return NextResponse.json({ 
            success: true, articles
        });

    } catch (err) {
        console.error('Erreur lors de la suppression de l\'image :', err);
        return NextResponse.json({ error: 'Échec de la suppression de l\'image.', message: err.message }, { status: 500 });
    }
}
 


