'use client'
import Link from "next/link";
import styles from "./edit.module.css";

import { useState } from "react";
import { userListing } from "@/_lib/listings/getdata";

import EditInputs from "@/_com/edit/inputs";
import EditSelects from "@/_com/edit/selects";
import EditImages from "@/_com/edit/images";

export default function EditContent({ user_listing, 
    offers_list, services_list, subjects_List, levels_list }){
            
    const [listing, setListing] = useState(user_listing || [])

    console.log('', listing);

    return(
        <div className={styles.EditContent}>
            <div className={styles.ListingBanner}>
                <h2>Modifier Votre Annonce</h2>  
                <ul className={styles.AuthRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <Link href={'/listings'}> <li>Annonces</li> </Link>
                    <li>/</li>
                    <li>{listing?.listing[0]?.name}</li>
                </ul>
            </div>

            <div className={styles.EditContainer}>
                <div className={styles.EditForm}>

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

                </div>
                <div className={styles.EditSide}>

                </div>
            </div>
        </div>
    )
}


// {
//     "listing": [
//         {
//             "id": 60023,
//             "user_id": 23,
//             "view": "on",
//             "state": "none",
//             "name": "Esayad",
//             "info": "aa bb cc dd ee hh",
//             "city": "Rabat",
//             "hood": "Hassan",
//             "phone": "0642101001",
//             "images": 1,
//             "services": 1,
//             "subjects": 1,
//             "levels": 1,
//             "offers": 1,
//             "created_at": "2025-05-04T19:46:04.000Z"
//         }
//     ],
//     "images": [
//         "dqupdpjbsuptk1enemrl.png"
//     ],
//     "offers": [
//         {
//             "name": "Première séance offerte",
//             "icon": "Tag"
//         },
//         {
//             "name": "Préparation aux concours",
//             "icon": "Tag"
//         },
//         {
//             "name": "Cours particuliers",
//             "icon": "Tags"
//         },
//         {
//             "name": "Cours accélérés",
//             "icon": "Tag"
//         },
//         {
//             "name": "Cours adaptés",
//             "icon": "Tags"
//         },
//         {
//             "name": "Cours du soir",
//             "icon": "Tags"
//         },
//         {
//             "name": "Cours à distance",
//             "icon": "Tags"
//         },
//         {
//             "name": "Réduction familiale",
//             "icon": "Tags"
//         }
//     ],
//     "levels": [
//         {
//             "name": "Collège",
//             "icon": "BadgeCheck"
//         },
//         {
//             "name": "Lycée qualifiant",
//             "icon": "BadgeCheck"
//         },
//         {
//             "name": "Maternelle",
//             "icon": "BadgeCheck"
//         },
//         {
//             "name": "Primaire",
//             "icon": "BadgeCheck"
//         },
//         {
//             "name": "Universitaire",
//             "icon": "BadgeCheck"
//         }
//     ],
//     "draft": null,
//     "subjects": [
//         {
//             "name": "Anglais",
//             "icon": "Baseline"
//         },
//         {
//             "name": "Français",
//             "icon": "WholeWord"
//         },
//         {
//             "name": "Mathématiques",
//             "icon": "SquareSigma"
//         },
//         {
//             "name": "Philosophie",
//             "icon": "GraduationCap"
//         },
//         {
//             "name": "Arabe",
//             "icon": "BookA"
//         },
//         {
//             "name": "SVT",
//             "icon": "FlaskConical"
//         },
//         {
//             "name": "Économie et Gestion",
//             "icon": "ChartNoAxesCombined"
//         },
//         {
//             "name": "Éducation Artistique",
//             "icon": "Palette"
//         },
//         {
//             "name": "Éducation Islamique",
//             "icon": "Handshake"
//         }
//     ],
//     "services": [
//         {
//             "name": "Parking",
//             "icon": "SquareParking"
//         },
//         {
//             "name": "Surveillance",
//             "icon": "Cctv"
//         },
//         {
//             "name": "WIFI",
//             "icon": "Wifi"
//         },
//         {
//             "name": "Imprimante",
//             "icon": "Printer"
//         },
//         {
//             "name": "Projecteur",
//             "icon": "Projector"
//         },
//         {
//             "name": "Tableau Interactif",
//             "icon": "Presentation"
//         },
//         {
//             "name": "Trousse De Secours",
//             "icon": "BriefcaseMedical"
//         },
//         {
//             "name": "Ordinateur",
//             "icon": "Computer"
//         }
//     ],
//     "reviews": [],
//     "newhood": []
// }













            {/* <div className={styles.EditInfo}>
                <h3 onClick={Referesh}> <House /> Informations Générales </h3>

            </div> */}