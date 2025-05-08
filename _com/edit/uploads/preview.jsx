"use client"

import styles from "../uploads.module.css";
import { useState } from "react";

import Confirmation from "./confirmation";

import Icon from "@/_lib/utils/Icon";


export default function EditPreview({keyId, fileName, listing_id, count, setError, setListing}) {
    
    const [isOk, setIsOk] = useState(false);
    const [loading, setLoading] = useState(false);
    
    async function handleImage() {
        setLoading(true); 
        setError('')

        const formData = new FormData();
        formData.append('imageName', fileName);
        formData.append('id', listing_id);

        const res = await fetch('/api/remove', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        
        setIsOk(false)
        setLoading(false);

        if(data?.error){
            setError(data.error)
        } else{ 
            setListing(data.listings);
        }


    }


    return(                                                                       
        <div key={keyId} className={styles.EditImage} style={{ backgroundImage: `url('https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${fileName}')` }}>
        
            {!loading ? 
            count !== 1 &&  //TO NOT DELETE LAST ONE
                ( !isOk ?
                    <p className={styles.EditActions} onClick={()=> setIsOk(true)}> 
                        <span> <Icon name={'Trash2'} color={'#e74c3c'}/> </span>        
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