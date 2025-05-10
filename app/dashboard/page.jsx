'use server';
import { IsAdmin } from "../isadmin";
import { allListings, allUsers } from "@/_lib/dashboard/getdata";

import Dashcontent from "./content";

export default async function Dashboard() {

    const listings = await allListings(); 
    const users = await allUsers();

    // console.log(listings.filter((item)=> item.state === 'under').length);
    
    return (
        <IsAdmin>
            <main className={'content'}>
                <Dashcontent listingsList={listings} usersList={users} />
            </main>
        </IsAdmin>
    )
    
}

