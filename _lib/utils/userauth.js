import getDB from "@/_lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { SanitizeId } from "./sanitizedata";

export async function UserAuthenticated(){//perfect
    try {
        const db = getDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.warn("No session or user data found.");
            return null
        }
        
        const token = session.user.token;
        const email = session.user.email;

        const [row] = await db.query( "SELECT id FROM users WHERE email = ? AND token = ?", [email, token]);
        const user = row[0] || null;      

        if (!user) {
            console.info(`User not authenticated, email: ${email}`);
            return null;
        }
                
        return user.id;

    } catch (error) {
        console.error("Database error:", error);
        return null
    }
}

export async function UserAuthorized(value_id){
        
    try {
        const db = getDB();

        const user_id = await UserAuthenticated();

        const listing_id = await SanitizeId(value_id)
        if(!listing_id){
            console.warn(`Invalid or unsanitized listing_id by user_id ${user_id}`); //hack attemp
            return null;
        }

        const [row] = await db.query( "SELECT * FROM listings WHERE id = ? AND user_id = ?", [listing_id, user_id]);
        const listing = row[0] || null;  

        if (!listing) {
            console.warn(`User_id: ${user_id} not authorized to accesss listing_id ${listing_id}`) //hack attemp
            return null;
            }

        return user_id;

    } catch (error) {
        console.error("Database error:", error);
        return null
    }
}

export async function AdminAuthenticated(){
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.role) {
            console.warn("No session or user data found.");
            return null
        }

        const token = session.user.token;
        const email = session.user.email;
        const role  = session.user.role;

        const user = db.prepare("SELECT * FROM users WHERE email = ? AND token = ?").get(email, token);
        
        if (!user || user.role !== 'admin') {
            console.info(`Admin not authenticated, email: ${email}`);
            return null;
        }
        
        return user.id;

    } catch (error) {
        console.error("Database error:", error);
        return null
    }
}




// const listing = db.prepare("SELECT * FROM listings WHERE id = ? AND user_id = ?").get(listing_id, user_id);
