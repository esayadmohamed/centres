import getDB from "@/_lib/db";


async function AllHoods(db) {
    try{ 
        const [neighborhoods] = await db.query("SELECT * FROM neighborhoods");
        if (neighborhoods.length === 0) {
            return []; 
        }
        return neighborhoods
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
    }
}

export async function GET() {
    try {
        const db = getDB();
        const rows = await AllHoods(db);
        // const [rows] = await db.query("SELECT name FROM neighborhoods");
        
        return Response.json(rows);

    } catch (err) {
        console.error("API DB ERROR:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}




// import {  AllHoods } from "@/_lib/centers/getdata";

// export async function GET(req) {

//     const hoods = await AllHoods();

//     return Response.json({  hoods });
// }


  // const listings = await AllListings();
  // const cities = await AllCities();
//AllListings, AllCities,
  //listings, cities,