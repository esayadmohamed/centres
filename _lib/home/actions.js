"use server";
import getDB from "@/_lib/db";

import { SanitizeId } from "../utils/sanitizedata";

// ---------------------------

export async function IntPixels() {
    try {
        const db = getDB();

        const [result] = await db.execute('INSERT INTO pixels () VALUES ()');

        return result?.insertId || null

    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
}



export async function ModifyPixels(id) {
    if(!id) return null
    try {
        const db = getDB();

        const pixels_id = await SanitizeId(id)
        if(!pixels_id) return null;

        await db.execute('UPDATE pixels SET hook = 1 WHERE id = ?', [pixels_id]);

        return true;

    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
}


// const emailsList = [{email: 'esayadmohamed@gmail.com'}]
// if(!emailsList){
//      return { message: "An error occurred while fetching emails" };
// }

// if(emailsList.length === 0){
//      return { message: "Marketing emails list is empty" };
// }

// const emails = emailsList.map((item)=> item.email)

// for (const email of emails) {
    
//     const message = buildMessage(email);

//     const mailOptions = {
//         from: `Centres ${process.env.EMAIL_USER}`,
//         to: email,
//         subject: message.subject,
//         html: message.text,
//     };
//     await transporter.sendMail(mailOptions);
// }

// ------------------------------------------

// async function EmailsList() {

// }