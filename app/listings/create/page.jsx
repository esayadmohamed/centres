'use server'
import { Authenticator } from "@/app/Providers";
import { getCitiesList, getHoodsList } from "@/_lib/listings/test";

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import CreateContent from "./Content";

export default async function ListingCreate() {
    
    const citiesList = await getCitiesList();
    const hoodsList  = await getHoodsList();

    return (
        <Authenticator>
            <main className="content">
                <Header />
                <CreateContent 
                    cities_list = {citiesList}
                    hoods_list = {hoodsList}
                />                
                <Footer /> 
            </main>
        </Authenticator>
    )
}
