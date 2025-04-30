import { AllHoods } from "@/_lib/centers/getdata";

export async function GET(req) {
    try {
        const hoods = await AllHoods();

        if (!hoods || hoods.length === 0) {
            return new Response(JSON.stringify({ error: "No hoods found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ hoods }), { status: 200 });
    } catch (error) {
        console.error("Error fetching hoods:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
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