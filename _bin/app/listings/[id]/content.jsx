'use client'
import Link from "next/link";
import styles from "./edit.module.css";

import { useState } from "react";
import { userListing } from "@/_lib/listings/getdata";

import EditInputs from "@/_com/edit/inputs";
import EditSelects from "@/_com/edit/selects";
import EditImages from "@/_com/edit/images";

import Icon from "@/_lib/utils/Icon";

export default function EditContent({ user_listing, 
    offers_list, services_list, subjects_List, levels_list }){
        
    const [index, setIndex] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [listing, setListing] = useState(user_listing || {})


    async function Referesh (){
        const result = await userListing(listing.id)
        setListing(result || {})
    }

    function handleEdit (id){
        if(!listing || Object.keys(listing).length === 0) return    
        setIndex(id)
        setIsEdit(id===index ? !isEdit : true)
    }


    return(
        <div className={styles.EditContent}>
            <div className={styles.ListingBanner}>
                <h2>Modifier Votre Annonce</h2>  
                <ul className={styles.AuthRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <Link href={'/listings'}> <li>Annonces</li> </Link>
                    <li>/</li>
                    <li>{listing.name}</li>
                </ul>
            </div>

            <div className={styles.EditContainer}>
                <div className={styles.EditForm}>

                    <EditInputs 
                        listing={listing}
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

                </div>
                <div className={styles.EditSide}>

                </div>
            </div>
        </div>
    )
}









            {/* <div className={styles.EditInfo}>
                <h3 onClick={Referesh}> <House /> Informations Générales </h3>

            </div> */}