// /app/api/centres/route.js (App Router) or /pages/api/centres.js (Pages Router)

import { AllListings, AllCities, AllHoods } from "@/_lib/centers/getdata";

export async function GET(req) {
  const listings = await AllListings();
  const cities = await AllCities();
  const hoods = await AllHoods();

  return Response.json({ listings, cities, hoods });
}
