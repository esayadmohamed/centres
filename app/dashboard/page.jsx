export const dynamic = 'force-dynamic';

import { allListings, allUsers } from "@/_lib/dashboard/getdata";
import Dashcontent from "./content";

import AdminAccess from "@/app/AdminAccess";

export default async function Dashboard() {

    const listings = await allListings(); 
    const users = await allUsers();

    return (
        <AdminAccess>
            <main className={'content'}>
                <Dashcontent listingsList={listings} usersList={users} />
            </main>
        </AdminAccess>
    )
    
}
