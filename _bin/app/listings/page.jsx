// 'use server';
export const dynamic = 'force-dynamic';

import { Authenticator } from "@/app/Providers";
import { userListings } from "@/_lib/listings/getdata";

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import ListingContent from "./Content";

export default async function Listings() {

    const listings = await userListings(); 
    
    return (
        <Authenticator>
            <main className="content">
                <Header />
                <ListingContent listings={listings}/>
                <Footer /> 
            </main>
        </Authenticator>
    )
}


// Next.js App Router (with Server Components) tries to pre-render pages (SSG) where possible. But when it detects dynamic features like headers() or database queries that depend on request headers (like getting the user's session), it falls back to dynamic rendering, which breaks static optimization.
// If userListings() is using authentication (e.g., sessions, headers, cookies), it's normal that it needs to be dynamic. Alternatively, if your data isn't user-specific, consider refactoring the logic to make the page static.