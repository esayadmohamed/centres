// so let me share 3 files (

//     export default async function Home() {
    
//         const local  = 'http://localhost:3000'
//         const vercel = 'https://centres.vercel.app'
    
//         const res = await fetch(`${vercel}/api/centres`, { cache: 'no-store' });
//         const data = await res.json();
//         const hoods = data?.map(item => item.name);
    
//         return (
//             <ul>
//                 <li>----------------------------------</li>
//                 {hoods?.map((item, id)=>
//                     <li key={id}> {item} </li>
//                 )}
//             </ul>
//         )
        
//     }) (import mysql from 'mysql2/promise';
    
//     let pool;
    
//     export default function getDB() {
//       if (!pool) {
//         pool = mysql.createPool({
//           host: process.env.DB_HOST, //'gateway01.us-west-2.prod.aws.tidbcloud.com', //
//           user: process.env.DB_USER, //'2KH4jG642GYeUug.root', //
//           password: process.env.DB_PASSWORD, //'8y01HPG54DRvj0GZ', //
//           database: 'main',
//           port: 4000,
//           ssl: {
//             rejectUnauthorized: true,
//           },
//         });
//       }
//       return pool;
//     }
//     ) (import getDB from "@/_lib/db";
    
//     export async function GET() {
//         try {
//             const db = getDB();
//             const [rows] = await db.query("SELECT name FROM neighborhoods");
            
//             return Response.json(rows);
    
//         } catch (err) {
//             console.error("API DB ERROR:", err);
//             return new Response("Internal Server Error", { status: 500 });
//         }
//     }
//     ) and they work fine