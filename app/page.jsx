import Centers from "./centres/page"

// import getDB from "@/_lib/db";
// async function dbex() {
//     try { // UPDATE listings SET state = 'on' // DELETE FROM listings WHERE name = 'Al Wafae'
//         const db = getDB();
//         const [rows] = await db.execute(`
//             UPDATE listings SET state = 'under' WHERE id = 210023
//         `);
//             // SELECT id FROM listings
//         // console.log(rows);

//         return rows;
//     } catch (error) {
//         console.error("Database error:", error);
//         return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
//     }
// }


export default async function Home() {

    // const aa = await dbex();
    
    
    return <Centers />

}



// git add .
// git commit -m "Made changes to my app"
// git push origin master




// import Centers from "./centres/page";


// import { AllHoods } from "@/_lib/centers/getdata";
    // console.log(hoods);
    // const hoodsList = await AllHoods();
    // const hoods = hoodsList?.map(item => item.name);

    // console.log('log data:', hoods);
    // console.log('-----------');
    // console.log('DB_HOST:', process.env.DB_HOST);
// import { getBaseUrl } from "@/_lib/utils/getBaseUrl";
// const baseurl = getBaseUrl();
// const res = await fetch(`${baseurl}/api/centres`, { cache: 'no-store' });
// const data = await res.json();
// const hoods = data?.hoods?.map(item => item.name);





// const local  = 'http://localhost:3000'
// const vercel = 'https://centres.vercel.app'

// import Centers from "./centres/page"
// <Centers />

// const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
// const data = await res.json();

// git add .
// git commit -m "Made changes to my app"
// git push origin master