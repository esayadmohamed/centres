import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import validator from "validator";
import xss from 'xss';

import getDB from "@/_lib/db";
const db = getDB();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    console.log('start____________________');
                    
                    const safe_email = validator.normalizeEmail(credentials.email);
                    const safe_password = xss(credentials.password).trim();
                    
                    if (!validator.isEmail(safe_email)) return null;

                    if (safe_password.length < 8 ||
                        !/[0-9]/.test(safe_password) ||
                        !/[A-Z]/.test(safe_password) ||
                        !/[!@#$%^&*(),.?":{}|<>]/.test(safe_password)) return null;

                    // const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(safe_email);
                    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [safe_email]);
                    const existingUser = rows[0] || null;
                    
                    if (!existingUser) return null;

                    if (existingUser.active !== "on") return null;

                    const isPasswordValid = await bcrypt.compare(safe_password, existingUser.password);
                    if (!isPasswordValid) return null;

                    return {
                        email: existingUser.email,
                        role: existingUser.role,
                        token: existingUser.token,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60,
    },
    jwt: {
        maxAge: 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.email = user.email;
                token.token = user.token;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.token = token.token;
            }
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
}