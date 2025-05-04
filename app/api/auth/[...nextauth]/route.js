import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import validator from "validator";
import xss from 'xss';

import getDB from "@/_lib/db";

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
                    const db = getDB();
                    
                    const safe_email = validator.normalizeEmail(credentials.email);
                    const safe_password = xss(credentials.password).trim();
                    
                    if (!validator.isEmail(safe_email)) return null;

                    if (safe_password.length < 8 ||
                        !/[0-9]/.test(safe_password) ||
                        !/[A-Z]/.test(safe_password) ||
                        !/[!@#$%^&*(),.?":{}|<>]/.test(safe_password)) return null;

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
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;



// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------

























// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import validator from "validator";
// import xss from 'xss';
// import { NextResponse } from "next/server";

// const sql = require("better-sqlite3");
// const db = sql("main.db");

// async function verifyCaptcha(captchaToken){
//     const url = process.env.NODE_ENV === 'production'
//         ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/verify-captcha`
//         : 'http://localhost:3000/api/verify-captcha'; 

//     const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({captchaToken}),
//     });

//     const data = await res.json();
//     if (data.success) {
//         return { success: true }
//     } else {
//         return null
//     }
// }

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//                 captchaToken: { label: "captchaToken", type: "text" },
//             },
//             async authorize(credentials) {
//                 try {
//                     const safe_email = validator.normalizeEmail(credentials.email);
//                     const safe_password = xss(credentials.password).trim();
//                     const safe_token = xss(credentials.captchaToken).trim();

//                     // Uncomment if you need captcha verification
//                     // const captcha = await verifyCaptcha(safe_token);
//                     // if (!captcha) return null;

//                     if (!validator.isEmail(safe_email)) return null;

//                     if (safe_password.length < 8 ||
//                         !/[0-9]/.test(safe_password) ||
//                         !/[A-Z]/.test(safe_password) ||
//                         !/[!@#$%^&*(),.?":{}|<>]/.test(safe_password)) return null;

//                     const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(safe_email);
//                     if (!existingUser) return null;

//                     if (existingUser.active !== "on") return null;

//                     const isPasswordValid = await bcrypt.compare(safe_password, existingUser.password);
//                     if (!isPasswordValid) return null;

//                     return {
//                         id: existingUser.id.toString(),
//                         name: existingUser.token,
//                         email: existingUser.email,
//                         role: existingUser.role, // Add role here
//                     };
//                 } catch (error) {
//                     console.error("Authentication error:", error);
//                     return null;
//                 }
//             },
//         }),
//     ],
//     session: {
//         strategy: "jwt",
//         maxAge: 60 * 60,
//     },
//     jwt: {
//         maxAge: 60 * 60,
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.role = user.role;
//                 token.id = user.id;
//                 token.name = user.name;
//                 token.email = user.email;
//             }
//             return token;
//         },

//         async session({ session, token }) {
//             if (token) {
//                 session.user.role = token.role;
//                 session.user.id = token.id;
//             }
//             return session;
//         },
//     },
//     pages: {
//         signIn: "/",
//     },
// };

// const handler = NextAuth(authOptions);
// export const GET = handler;
// export const POST = handler;















// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import validator from "validator";
// import xss from 'xss';

// const sql = require("better-sqlite3");
// const db = sql("main.db");

// async function verifyCaptcha(captchaToken) {
//     const url = process.env.NODE_ENV === 'production'
//         ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/verify-captcha`
//         : 'http://localhost:3000/api/verify-captcha'; 

//     const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({captchaToken}),
//     });

//     const data = await res.json();
//     return data.success ? {success: true} : null;
// }

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//                 captchaToken: { label: "captchaToken", type: "text" },
//             },
//             async authorize(credentials) {
//                 try {
//                     const safe_email = validator.normalizeEmail(credentials.email);
//                     const safe_password = xss(credentials.password).trim();
//                     const safe_token = xss(credentials.captchaToken).trim();

//                     // Optional captcha check
//                     // const captcha = await verifyCaptcha(safe_token);
//                     // if (!captcha) return null;

//                     if (!validator.isEmail(safe_email)) return null;

//                     if (safe_password.length < 8 ||
//                         !/[0-9]/.test(safe_password) ||
//                         !/[A-Z]/.test(safe_password) ||
//                         !/[!@#$%^&*(),.?":{}|<>]/.test(safe_password)) return null;

//                     // Check if user exists
//                     const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(safe_email);
//                     if (!existingUser || existingUser.active !== "on") return null;

//                     const isPasswordValid = await bcrypt.compare(safe_password, existingUser.password);
//                     if (!isPasswordValid) return null;

//                     return {
//                         id: existingUser.id.toString(),
//                         name: existingUser.token,
//                         email: existingUser.email,
//                         role: existingUser.role,  // Ensure `role` is returned
//                     };
//                 } catch (error) {
//                     console.error("Authentication error:", error);
//                     return null;
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt(token, user) {
//             // On first authentication, the user object will be available
//             if (user) {
//                 token.role = user.role;  // Store the `role` in the token
//             }
//             return token;
//         },
//         async session(session, token) {
//             // Ensure that `role` is available in the session object
//             if (token && token.role) {
//                 session.user.role = token.role;
//             }
//             return session;
//         },
//         pages: {
//             signIn: "/",
//         },
//     },
// };

// const handler = NextAuth(authOptions);
// export const GET = handler;
// export const POST = handler;













// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// import bcrypt from "bcryptjs";
// import validator from "validator";
// import xss from 'xss';
// import { NextResponse } from "next/server";

// const sql = require("better-sqlite3");
// const db = sql("main.db");

// async function verifyCaptcha(captchaToken){

//     const url = process.env.NODE_ENV === 'production'
//         ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/verify-captcha`
//         : 'http://localhost:3000/api/verify-captcha'; 

//     const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({captchaToken}),
//     });

//   const data = await res.json();
//   if (data.success) {
//       return {success: true}
//   } else {
//       return null
//   }

// }

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//                 captchaToken: { label: "captchaToken", type: "text" },
//             },
//             async authorize(credentials) {
//                 try {
//                     const safe_email    = validator.normalizeEmail(credentials.email);
//                     const safe_password = xss(credentials.password).trim();
//                     const safe_token    = xss(credentials.captchaToken).trim();

//                     // const captcha = await verifyCaptcha(safe_token) //---1
//                     // if (!captcha) return null

//                     if (!validator.isEmail(safe_email)) return null //---2

//                     if ( //---3
//                         safe_password.length < 8 ||
//                         !/[0-9]/.test(safe_password) ||
//                         !/[A-Z]/.test(safe_password) ||
//                         !/[!@#$%^&*(),.?":{}|<>]/.test(safe_password)
//                     ) return null

//                     // -------------------------------

//                     const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(safe_email);
//                     if (!existingUser) return null;

//                     if (existingUser.active !== "on") return null;

//                     const isPasswordValid = await bcrypt.compare(safe_password, existingUser.password);
//                     if (!isPasswordValid) return null;

//                     return {
//                         id: existingUser.id.toString(),
//                         name: existingUser.token,
//                         email: existingUser.email,
//                         role: existingUser.role,
//                     };
//                 } catch (error) {
//                     console.error("Authentication error:", error);
//                     return null;
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt(token, user) {
//             if (user) {
//                 token.role = user.role; // Store role in the JWT token
//             }
//             return token;
//         },
//         async session(session, token) {
//             session.user.role = token.role; // Make role accessible in the session
//             return session;
//         },
//         pages: {
//             signIn: "/",
//         },
//     }
// };

// const handler = NextAuth(authOptions);
// export const GET = handler;
// export const POST = handler;








// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// import bcrypt from "bcryptjs";
// import validator from "validator";
// import xss from 'xss';
// import { NextResponse } from "next/server";

// const sql = require("better-sqlite3");
// const db = sql("main.db");

// async function verifyCaptcha(captchaToken){

//     const url = process.env.NODE_ENV === 'production'
//         ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/verify-captcha`
//         : 'http://localhost:3000/api/verify-captcha'; 

//     const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({captchaToken}),
//     });

//   const data = await res.json();
//   if (data.success) {
//       return {success: true}
//   } else {
//       return null
//   }

// }

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//                 captchaToken: { label: "captchaToken", type: "text" },
//             },
//             async authorize(credentials) {
//                 try {
//                     const safe_email    = validator.normalizeEmail(credentials.email);
//                     const safe_password = xss(credentials.password).trim();
//                     const safe_token    = xss(credentials.captchaToken).trim();

//                     // const captcha = await verifyCaptcha(safe_token) //---1
//                     // if (!captcha) return null

//                     if (!validator.isEmail(safe_email)) return null //---2

//                     if ( //---3
//                         safe_password.length < 8 ||
//                         !/[0-9]/.test(safe_password) ||
//                         !/[A-Z]/.test(safe_password) ||
//                         !/[!@#$%^&*(),.?":{}|<>]/.test(safe_password)
//                     ) return null

//                     // -------------------------------

//                     const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(safe_email);
//                     if (!existingUser) return null;

//                     if (existingUser.active !== "on") return null;

//                     const isPasswordValid = await bcrypt.compare(safe_password, existingUser.password);
//                     if (!isPasswordValid) return null;

//                     return {
//                         id: existingUser.id.toString(),
//                         name: existingUser.token,
//                         email: existingUser.email,
//                     };
//                 } catch (error) {
//                     console.error("Authentication error:", error);
//                     return null;
//                 }
//             },
//         }),
//     ],
//     session: {
//         strategy: "jwt",
//         maxAge: 60 * 60, // 1 hour session
//     },
//     jwt: {
//         maxAge: 60 * 60, // 1 hour
//     },
//     pages: {
//         signIn: "/",
//     },
// };

// const handler = NextAuth(authOptions);
// export const GET = handler;
// export const POST = handler;

