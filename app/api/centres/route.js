import {  AllHoods } from "@/_lib/centers/getdata";

export async function GET() {
    try {
        // const db = getDB();
        // const [hoods] = await db.query("SELECT name FROM neighborhoods");

        const hoods = await AllHoods();

        return Response.json(hoods);

    } catch (err) {
        console.error("API DB ERROR:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}








// 

// export async function GET(req) {

//     const hoods = await AllHoods();

//     return Response.json({  hoods });
// }


// const listings = await AllListings();
// const cities = await AllCities();
//AllListings, AllCities,
//listings, cities,