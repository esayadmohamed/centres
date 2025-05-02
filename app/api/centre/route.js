import getDB from "@/_lib/db";

import { GetListing, GetSuggested, getUserReview, getReviewsList } from '@/_lib/center/getdata';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const db = getDB();

        const { searchParams } = new URL(req.url);
        const center_id = parseInt(searchParams.get('center_id'), 10);
        
        const listing = await GetListing(db, center_id);
        const suggested = await GetSuggested(db, listing.city);
        const isReviewed = await getUserReview(db, center_id);
        const ReviewsList = await getReviewsList(db);
        
        const session = await getServerSession(authOptions);

        const result = {
            listing,
            suggested,
            isReviewed,
            ReviewsList,
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