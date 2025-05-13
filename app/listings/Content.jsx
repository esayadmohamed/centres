'use client'
import styles from "./listing.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

import Icon from "@/_lib/utils/Icon";

import Listing from '@/_com/listings/Listing';

export default function ListingContent({listings}) {
    
    // if(listings.length === 0) return notFound() ,akes no sense since new account have no listings

    const [listing, setListing] = useState(listings? listings : [])
        
    const [view, setView] = useState(false)

    useEffect(()=>{
        //check if there is anything that can trugger a notification
    },[])

    
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

            {(listing.length !== 0 && view) && 
                <div className={styles.ListingNotification}>
                    <p> Certaines annonces nécessitent votre attention. </p>
                </div>
            }
            
            <div className={styles.ListingList}>
                {listing.map((item, id)=> 
                    <Listing listing={item} key={id} setListing={setListing}/>
                )}

                {listing.length < 11 && 
                    <div className={styles.addlisting}>
                        <Link href={'/listings/create'}>
                            <Icon name={'Plus'}/>
                        </Link>
                    </div>
                }
            
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