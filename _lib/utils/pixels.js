'use server'
const sql = require('better-sqlite3');
const db = sql('main.db');
db.pragma('foreign_keys = ON');


export async function GetMetaPixels() {
    try {
        const row = db.prepare('SELECT data FROM utils WHERE name = ?').get('facebook pixel');

        // Ensure that we get the data and handle the case where it's not found
        if (!row || !row.data) {
            return { error: "No Meta Pixel data found in the database" };
        }

        const pixelCode = row.data.replace(/\n/g, ""); 

        return pixelCode;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}
