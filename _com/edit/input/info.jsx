"use client"
import styles from "../input.module.css";
import { useState } from "react";

import { ModifyInfo } from "@/_lib/listings/editdata";

export default function EditInfo({listing, handleEdit, setListing}) {
    
    const [description, setDescription] = useState(listing.info); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    async function HandleDescription(){
        setLoading(true);
        setError('');

        const result = await ModifyInfo(listing.id, description)
        setLoading(false)

        if (result?.error) {
            setError(result.error) 
        }
        else {
            handleEdit();
            setListing(result);
        }
    }

    return(
    <div className={styles.EditDescription}>
        <span>
            <textarea 
                name="description" 
                id="description" 
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                placeholder="Nouvelle description">
            </textarea>
            <p> {500-description.length} / 500 </p>
        </span>
        
        {error && <p className={styles.EditError}> {error}</p> }
        
        <div className={styles.EditFunctions}>
            <button onClick={HandleDescription}> 
                {loading ? <div className="spinner"></div > : <span>  Mettre à jour </span>} 
            </button>
            <p className={styles.EditAction} onClick={handleEdit}> Annuler </p> 
        </div>

    </div>
    )
}
