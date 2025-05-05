"use client"

import styles from "../uploads.module.css";
import { useState } from "react";

import { removeImage } from "@/_lib/listings/editdata";

import Confirmation from "./confirmation";

import Icon from "@/_lib/utils/Icon";


export default function EditPreview({keyId, fileName, listing_id, count, setError, setListing}) {
    
    const [isOk, setIsOk] = useState(false);
    const [loading, setLoading] = useState(false);
    
    async function handleImage() {
        setLoading(true); 
        setError('')

        const response = await removeImage(listing_id, fileName);
        setLoading(false); 

        if (response.error) {
            setError(response.error)
        } else {
            setListing(response);
        }  

        setIsOk(false)
    }

    
    return(                                                                       
        <div key={keyId} className={styles.EditImage} style={{ backgroundImage: `url('https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${fileName}')` }}>
        
            {!loading ? 
            count !== 1 &&  //TO NOT DELETE LAST ONE
                ( !isOk ?
                    <p className={styles.EditActions} onClick={()=> setIsOk(true)}> 
                        <span> <Icon name={'Trash2'} color={'#e74c3c'}/> {/*Supprimer*/} </span>        
                    </p>
                : <Confirmation close={()=> setIsOk(false)} handleImage={handleImage}/>
                )
            :
            <div className={styles.UploaderLoader}>
                <div className={'spinner'}></div>
                Patientez
            </div>
            }

        </div> 
    )
}