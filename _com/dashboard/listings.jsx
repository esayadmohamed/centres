'use client'
import styles from "./style.module.css";

import { useEffect, useState } from "react";

// import { allListings } from "@/_lib/dashboard/getdata";

import DashFilter from "./listings/dashfilter";
import DashSlider from "./listings/dashslider";
import DashContent from "./listings/dashcontent";

export default function DashListings({listingsList, setListingsList, setUnder}) {
    
    const [listings, setListings] = useState(listingsList)
    const [listing, setListing] = useState(null)

    useEffect(()=>{
        setListings(listingsList)
        setUnder(listingsList.filter((item)=> item.state === 'under').length);        
    },[listingsList])

    
    return (
        <div className={styles.DashListings}>
            <DashFilter 
                listingsList={listingsList}
                setListing={setListing}
                listings={listings}
                setListings={setListings}
                />

            {!listing ? 
                <div className={styles.ListingView}>
                </div>
                :
                <div className={styles.ListingView}>
                    <DashSlider listing={listing} />
                    <DashContent 
                        listing={listing.listing} 
                        setListing={setListing}
                        // setListings={setListings}  
                        setListingsList={setListingsList}
                        // setUnder={setUnder}
                        />
                </div>
            }
        </div>
    )
}
