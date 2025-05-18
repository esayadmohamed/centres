"use server";
import getDB from "@/_lib/db";
import nodemailer from "nodemailer";
import buildMessage from "@/_com/dashboard/marketing/emails";

import { AdminAuthenticate } from "./editdata";

const db = getDB();

async function EmailsList() {
    try {
        const admin_id = await AdminAuthenticate();
        if(!admin_id) return null;

        const [emails] = await db.query('SELECT email FROM emails WHERE status = ?', [1]);

        return emails

        } catch (error) {
        console.error('Error fetching marketing emails:', error);
        return null;
    } 
}

export async function sendEmail() {
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

        const emailsList = await EmailsList();
        if(!emailsList){
             return { message: "An error occurred while fetching emails" };
        }

        if(emailsList.length === 0){
             return { message: "Marketing emails list is empty" };
        }
    
        const emails = emailsList.map((item)=> item.email)

        for (const email of emails) {
            
            const message = buildMessage(email);

            const mailOptions = {
                from: `Centres ${process.env.EMAIL_USER}`,
                to: email,
                subject: message.subject,
                html: message.text,
            };
            await transporter.sendMail(mailOptions);
        }

        return { message: "Marketing emails were sent successfully" };
    } catch (error) {
        console.error('Error sending marketing emails:', error);
        return { message: "An error occurred while sending emails" };
    }
}

export async function ModifyDatabase(value) {
    try { 

        const action = value.trim()

        const [rows] = await db.execute(action);
                
        return rows;

    } catch (error) {
        console.error("Database error:", error);
        return { error: "Database error!" };
    }
}
