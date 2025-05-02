import getDB from "@/_lib/db";

import { AllListings, AllCities, AllHoods } from "@/_lib/centers/getdata";

export async function GET() {
    try {
        const db = getDB();
        const listings = await AllListings(db);
        const cities = await AllCities(db);
        const hoods = await AllHoods(db);
        
        const result = {
          listings,
          cities,
          hoods
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