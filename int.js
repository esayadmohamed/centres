import getDB from "@/_lib/db";

export default async function dbex() {
    try {
        const db = getDB();
        const [rows] = await db.execute(`
            SELECT * FROM users
      `);


        return rows;
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

// images: [
//   'f590fbotkkdl93ehdkad.jpg',
//   'fjqijrrjm9sdi1d32t81',
//   'image_1746445792225_60023.png'
// ],


// CREATE TABLE suggestedhoods (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     city VARCHAR(255) NOT NULL,
//     listing_id INT NOT NULL,
//     user_id INT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
//     UNIQUE KEY unique_name_per_listing (name, listing_id)
// );