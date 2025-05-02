import getDB from "@/_lib/db";

import { VerifyToken } from "@/_lib/auth/verify";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const db = getDB();

        const { searchParams } = new URL(req.url);
        const token_value = searchParams.get('token_value')
        
        const token = await VerifyToken(db, token_value);
        const session = await getServerSession(authOptions);
        
        const result = {
            token,
            session
        };

        return Response.json(result);

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