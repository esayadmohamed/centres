'use server'
import UserAccess from "@/app/UserAccess"; 
import { getCitiesList, getHoodsList } from "@/_lib/listings/test";

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import CreateContent from "./Content";

export default async function ListingCreate() {
    
    const citiesList = await getCitiesList();
    const hoodsList  = await getHoodsList();

    return (
        <UserAccess>
            <main className="content">
                <Header />
                <CreateContent 
                    cities_list = {citiesList}
                    hoods_list = {hoodsList}
                />                
                <Footer /> 
            </main>
        </UserAccess>
    )
}
