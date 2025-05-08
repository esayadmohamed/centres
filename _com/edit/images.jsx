"use client"

import styles from "./uploads.module.css";
import { useEffect, useState } from "react";

import EditPreview from "./uploads/preview";
import EditUploader from "./uploads/uploader";

import Icon from "@/_lib/utils/Icon";

export default function EditImages({listing, uploadData, setListing}) {
    
    const [files, setFiles] = useState([
        { data: null, name: uploadData[0]?uploadData[0]:null }, 
        { data: null, name: uploadData[1]?uploadData[1]:null }, 
        { data: null, name: uploadData[2]?uploadData[2]:null }
    ]);
    
    useEffect(()=>{
        setFiles([
            { data: null, name: uploadData[0]?uploadData[0]:null }, 
            { data: null, name: uploadData[1]?uploadData[1]:null }, 
            { data: null, name: uploadData[2]?uploadData[2]:null }
        ])
    },[listing])

    const [error, setError] = useState('')

    return( 
        <div className={styles.EditUploads}>
            <h3> <Icon name={'Images'} color={'#154360'}/> Images </h3>
            <div className={styles.UploadsContainer}>                
                {files.map((item, id)=> 
                    <div key={id} className={styles.UploadsBox}>
                        { 
                        item?.name ?
                        <EditPreview keyId={id} fileName={item.name} listing_id={listing.listing[0].id} count={uploadData.length} setError={setError} setListing={setListing}/> 
                        : 
                        <EditUploader keyId={id} listing_id={listing.listing[0].id} setError={setError} setListing={setListing}/>
                        }
                    </div>
                )}
            </div> 
            <p className={styles.UploadsError}> {error && error} </p>
    </div>
    )
}
