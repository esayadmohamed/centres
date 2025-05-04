import { AllListings, AllCities, AllHoods } from "@/_lib/centers/getdata";

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import Listings from "./Listings";

export default async function Centers() {
    
    const listings = await AllListings();
    const cities   = await AllCities();
    const hoods    = await AllHoods();
    
    return (         
        <main className="content">
            <Header />

            <Listings 
                listings_list={listings}
                cities_list={cities}
                hoods_list={hoods}
            />

            <Footer />
        </main>
    )
}

// git add .
// git commit -m "Made changes to my app"
// git push origin master