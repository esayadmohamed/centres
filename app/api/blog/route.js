import cloudinary from '@/_lib/cloudinary';
import { NextResponse } from 'next/server';

import { SanitizeArticle, InsertArticle } from "@/_lib/dashboard/editdata";
import { SanitizeImage } from '@/_lib/utils/sanitizedata';

export async function POST(req) {

    const formData = await req.formData();

    const title = formData.get('title');
    const content = formData.get('content');
    const file = formData.get('file');
    
    if (!title || !content || !file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const validImage = await SanitizeImage(file)
    if (!validImage) {
        return NextResponse.json({ error: 'Image upload failed or invalid file' }, { status: 400 });
    }

    const validArticle = await SanitizeArticle(title, content)
    if (validArticle?.error) {
        return NextResponse.json(validArticle, { status: 400 });
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
          
                const articles = await InsertArticle({title: title, content:content, image: file_name})
                if (articles.error) {
                    return NextResponse.json(articles, { status: 400 });
                }

                resolve(NextResponse.json({
                    success: true,
                    articles,
                }));
        
            } catch (dbError) {
                console.error("Database error while saving image:", dbError);
                reject(NextResponse.json({ error: 'Failed to save image info to database' }, { status: 500 }));
            }
        }).end(buffer);
    });
      
}
