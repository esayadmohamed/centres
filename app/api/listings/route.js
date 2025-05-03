import getDB from "@/_lib/db";

import { userListings } from "@/_lib/listings/getdata";

export async function GET() {
    try {
        const db = getDB();
        const listings = await userListings(db);

        console.log(listings);
        

        return Response.json([]);

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