"use server";
import getDB from "@/_lib/db";
import nodemailer from "nodemailer";
import { buildMessage } from "@/_lib/utils/emails";

import { AdminAuthenticate } from "./editdata";

const db = getDB();

export async function sendEmail(email) {
    try {
        const transporter = nodemailer.createTransport({
        host: 'mail.centres.ma',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        secure: true,
        port: 465,
        });

        const message = buildMessage(email);

        const mailOptions = {
            from: `Centres ${process.env.EMAIL_USER}`,
            to: email,
            subject: message.subject,
            html: message.text,
        };

        await transporter.sendMail(mailOptions);
        
        return {success: true}

    } catch (error) {
        console.error('Error sending marketing emails:', error);
        return { error: "An error occurred while sending emails" };
    }
}

export async function ModifyDatabase(value) {
    try {
        const action = value.trim();
        const [rows] = await db.execute(action);
        console.log(rows);
        
        return value.toUpperCase().includes('SELECT') ? rows : {success:true};
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Database error!" };
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