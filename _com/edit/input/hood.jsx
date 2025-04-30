"use client"

import styles from "../input.module.css";
import { useState } from "react";

import { ModifyHood } from "@/_lib/listings/editdata";

export default function EditHood({listing_id, setListing}) {
    
    const [hood, setHood] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    async function HandleHood(){
        setLoading(true);
        setError('');

        const result = await ModifyHood(listing_id, hood)    
        setLoading(false)

        if (result.error) setError(result.error) 
        else setListing(result);
    }

    return(
        <div className={styles.EditPhone}>
            <span>
                <input 
                    type="text" 
                    placeholder="Votre quartier"
                    value={hood}
                    onChange={(e)=> setHood(e.target.value)}
                    />
            </span>
            
            {error && <p className={styles.EditError}> {error}</p> }

            <button onClick={HandleHood}> 
                {loading ? <div className="spinner"></div > : <span>  Partager </span>} 
            </button>

        </div>
    )
}
