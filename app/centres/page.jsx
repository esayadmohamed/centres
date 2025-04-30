'use server';
import { AllListings, AllCities, AllHoods } from "@/_lib/centers/getdata";

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import Listings from "./Listings";

export default async function Centers() {

    const listings_list = await AllListings(); 
    const cities_list = await AllCities();
    const hoods_list  = await AllHoods();

    return (         
        <main className="content">
            <Header />
            <Listings 
                listings_list={listings_list}
                cities_list={cities_list}
                hoods_list={hoods_list}
            />
            <Footer /> 
        </main>
    )
}

