import getDB from "@/_lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function accessUser(){
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

        if (!user){
            console.info(`User not authenticated, email: ${email}`);
            return null;
        }
                
        // await delay(5000); 

        return { success: true };
        

    } catch (error) {
        console.error("Database error:", error);
        return null
    }
}

export async function accessAdmin(){
    try {
        const db = getDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.warn("No session or user data found.");
            return null
        }
        
        const token = session.user.token;
        const email = session.user.email;
        const role  = session.user.role;

        const [row] = await db.query( "SELECT id FROM users WHERE email = ? AND token = ? AND role = ?", 
            [email, token, role]);
        const admin = row[0] || null;      

        if (!admin){
            console.info(`Admin not authenticated, email: ${email}`);
            return null;
        }
                
        // await delay(5000); 

        return { success: true };

    } catch (error) {
        console.error("Database error:", error);
        return null
    }
}