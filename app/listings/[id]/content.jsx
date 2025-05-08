'use client'
import Link from "next/link";
import styles from "./edit.module.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PublishListing } from "@/_lib/listings/editdata";

import EditInputs from "@/_com/edit/inputs";
import EditSelects from "@/_com/edit/selects";
import EditImages from "@/_com/edit/images";

import Icon from "@/_lib/utils/Icon";

export default function EditContent({ user_listing, 
    offers_list, services_list, subjects_List, levels_list }){
            
    const router = useRouter();

    const [listing, setListing] = useState(user_listing || [])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function Publish(){
        setLoading(true);
        setError('');

        const result = await PublishListing(listing?.listing[0]?.id)
        setLoading(false)
        
        if (result?.error) {
            setError(result.error) 
        }
        else {
            setError('');
            router.replace ("/listings") 
        }
    }

    // console.log(listing?.listing[0]?.state);
    

    return(
        <div className={styles.PageContainer}>
            <div className={styles.PageBanner}>
                <h2>Modifier Votre Annonce</h2>  
                <ul className={styles.BannerRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <Link href={'/listings'}> <li>Annonces</li> </Link>
                    <li>/</li>
                    <li>{listing?.listing[0]?.name}</li>
                </ul>
            </div>

            <div className={styles.PageContent}>
                <div className={styles.PageForm}>

                    <EditInputs 
                        listing={listing?.listing[0]}
                        newhood={listing?.newhood}
                        setListing={setListing}
                        />

                    <EditSelects 
                        listing={listing}
                        setListing={setListing}
                        offers_list={offers_list}
                        services_list={services_list}
                        subjects_List={subjects_List}
                        levels_list={levels_list}
                        />

                    <EditImages
                        listing={listing}
                        setListing = {setListing}
                        uploadData={listing.images}
                        />
                    {error && <p className={styles.PageError}> {error}</p>}
                    
                    <div className={styles.PagePublish} style={{display: ['none'].includes(listing?.listing[0]?.state) ? 'flex' : 'none'}}>
                        <button onClick={Publish}>
                            {loading ? <div className="spinner"></div > : <span>  Publier </span>} 
                        </button>
                    </div>

                </div>
                <div className={styles.PageMarketing}>
                    <div>
                        <Icon name={'Navigation2'} color={'#424949'}/>
                        <p> CENTRES </p>
                    </div>
                </div>
            </div>
        </div>
    )
}



// CREATE TABLE "listings" (
// 	"id"	INTEGER,
// 	"user_id"	INTEGER NOT NULL,
// 	"view"	TEXT NOT NULL DEFAULT 'on',
// 	"state"	TEXT NOT NULL DEFAULT 'none',
// 	"name"	TEXT NOT NULL,
// 	"info"	TEXT NOT NULL,
// 	"city"	TEXT NOT NULL,
// 	"hood"	TEXT NOT NULL,
// 	"phone"	TEXT NOT NULL,
// 	"images"	INTEGER NOT NULL DEFAULT 0,
// 	"services"	INTEGER NOT NULL DEFAULT 0,
// 	"subjects"	INTEGER NOT NULL DEFAULT 0,
// 	"levels"	INTEGER NOT NULL DEFAULT 0,
// 	"offers"	INTEGER NOT NULL DEFAULT 0,
// 	"created_at"	DATETIME DEFAULT CURRENT_TIMESTAMP,
// 	PRIMARY KEY("id" AUTOINCREMENT),
// 	UNIQUE("user_id","name"),
// 	FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE
// )