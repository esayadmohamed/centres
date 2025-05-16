'use server'
import getDB from "@/_lib/db";

import { SanitizeId } from "@/_lib/utils/sanitizedata";

// -------------------------------------------------------------

export async function AllArticles() {
    try {
        const db = getDB();

        const [articles] = await db.query("SELECT * FROM blog WHERE view = 1 LIMIT 8");
        if (articles.length === 0) { 
            return [];
        }

        return articles.map((article) => ({
            id: article.id,
            image: article.image,
            title: article.title,
            content: article.content,
            created_at: article.created_at
        }));
        
    } catch (error) {
        console.error("Database error:", error);
        return [];
    }
}

export async function singleArticle(value_id) {
    try {
        const db = getDB();

        const article_id = await SanitizeId(value_id)
        if(!article_id) return null

        const [row] = await db.query("SELECT * FROM blog WHERE id = ?", [article_id]);
        const article = row[0] || null;
        if (!article) return null; 

        return { 
            id: article.id,
            image: article.image,
            title: article.title,
            content: article.content,
            created_at: article.created_at
        };

    } catch (error) {
        console.error("Database error:", error);
        return null
    }
}

export async function SuggestedArticles() {
    try {
        const db = getDB();

        const [articles] = await db.query("SELECT * FROM blog WHERE view = 1 LIMIT 2");
        if (articles.length === 0) { 
            return [];
        }

        return articles.map((article) => ({
            id: article.id,
            image: article.image,
            title: article.title,
            content: article.content,
            created_at: article.created_at
        }));
        
    } catch (error) {
        console.error("Database error:", error);
        return [];
    }
}

export async function GetMoreArticles(offset = 0) {
    try {
        const db = getDB();
        
        const num = await SanitizeId(offset)
        if(!num) {
            console.log('Error: limit intiger verification failed');
            return {error: "Il n'y a plus d'articles à afficher."}
        }

        const limit = 8;

        const [articles] = await db.query("SELECT * FROM blog WHERE view = 1 LIMIT ? OFFSET ?", [limit, offset]);
        if (articles.length === 0) { 
            return {error: "Il n'y a plus d'articles à afficher."}
        }

        return articles.map((article) => ({
            id: article.id,
            image: article.image,
            title: article.title,
            content: article.content,
            created_at: article.created_at
        }));
        
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}