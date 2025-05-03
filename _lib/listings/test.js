import getDB from "@/_lib/db";

export async function userListings() {
    try {
        const db = getDB();

        const [listings] = await db.query("SELECT * FROM listings");
        if (listings.length === 0) { 
            return [];
        }
        
        return listings
    } catch (error) {
        return handleDbError(error);
    }
}