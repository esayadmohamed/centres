'use server'
import { Authenticator } from "@/app/Providers";
import { userListing } from "@/_lib/listings/getdata";
import {  getOffersList, getServicesList, getSubjectsList, getLevelsList } from "@/_lib/listings/getdata";

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import EditContent from "./content";

export default async function ListingEdit({params}) {

    const center_id = await params;
    const listing  = await userListing(center_id.id);
    
    const offers_list   = await getOffersList();
    const services_list = await getServicesList();
    const subjects_List = await getSubjectsList();
    const levels_list   = await getLevelsList();

    
    return (
        <Authenticator>
            <main className="content">
                <Header />
                <EditContent 
                    user_listing={listing}
                    offers_list={offers_list}
                    services_list={services_list}
                    subjects_List={subjects_List}
                    levels_list={levels_list}
                />                
                <Footer /> 
            </main>
        </Authenticator>
    )
}