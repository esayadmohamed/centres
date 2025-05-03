'use client'
import styles from "./listing.module.css";
import Link from "next/link";
import { useState } from "react";

import { userListings } from '@/_lib/listings/getdata';

import Listing from '@/_com/listings/Listing';
import Add from '@/_com/listings/Add';

export default function ListingContent({listings}) {
    
    const [listing, setListing] = useState(listings? listings : [])
        
    return (
        <div className={styles.ListingContent}>
            
            <div className={styles.ListingBanner}>
                <h2>Vos annonces</h2>  
                <ul className={styles.AuthRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <li>Annonces</li>
                </ul>
            </div>
            
            <div className={styles.ListingList}>
                
                {listing.map((item, id)=> 
                    <Listing listing={item} key={id} setListing={setListing}/>
                )}
                <Add />
            </div>

        </div>
    )
}


// const [loading, setLoading] = useState(false);
// async function Referesh (){
//     const result = await userListings()
//     setListing(result ? result : [])
// }

// {listing.length !== 0 ? 
// :
// <div className={styles.ListingEmpty}>
//     <CaptionsOff />
//     <h2>Vous n'avez aucune annonce.</h2>
//     <Link href={'/listings/create'}> <p>Créez-en une maintenant !</p> </Link>
// </div>
// }