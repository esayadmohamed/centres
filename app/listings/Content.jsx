'use client'

import Image from 'next/image'
import styles from "./listing.module.css";
import Link from "next/link";
import { useState } from "react";

// import { getUserListings } from "@/lib/listings/getdata";
import { userListings } from '@/_lib/listings/getdata';

import Listing from '@/_com/listings/Listing';
import Add from '@/_com/listings/Add';

import { CaptionsOff, MapPinCheckInside, Plus, CirclePlus } from "lucide-react";
import Icon from '@/_lib/utils/Icon';

// import defaultImage from '@/_upl/development/default.png'

export default function ListingContent({listings}) {
    
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(listings? listings : []) // 
    
    async function Referesh (){
        const result = await userListings()
        setListing(result ? result : [])
    }
    
    return (
        <div className={styles.ListingContent}>
            
            <div className={styles.ListingBanner}>
                <h2>Vos annonces</h2>  
                <ul className={styles.AuthRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <li>Annonces</li>
                </ul>
                {/* <Link href={' /listings/create'}> <span> <Icon name={'Plus'} /> </span> </Link>  */}
            </div>
            
            <div className={styles.ListingList}>
                
                {listing.map((item, id)=> 
                    <Listing listing={item} key={id} Referesh={Referesh} loading={loading} />
                )}
                <Add />
            </div>

        </div>
    )
}


// {listing.length !== 0 ? 
// :
// <div className={styles.ListingEmpty}>
//     <CaptionsOff />
//     <h2>Vous n'avez aucune annonce.</h2>
//     <Link href={'/listings/create'}> <p>Créez-en une maintenant !</p> </Link>
// </div>
// }