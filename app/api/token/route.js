import getDB from "@/_lib/db";
import { VerifyToken } from "@/_lib/auth/verify";

export async function GET(req) {
    try {
        const db = getDB();

        const { searchParams } = new URL(req.url);
        const token_value = searchParams.get('token_value')
        
        const token = await VerifyToken(db, token_value);
        
        return Response.json(token);

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