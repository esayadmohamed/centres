"use client"

import styles from "../input.module.css";
import { useState } from "react";

import { ModifyPhone } from "@/_lib/listings/editdata";

export default function EditPhone({listing, handleEdit, setListing}) {
    
    const [phone, setPhone] = useState(listing.phone)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    async function HandlePhone(){
        setLoading(true);
        setError('');
        
        const result = await ModifyPhone(listing.id, phone)  
        setLoading(false)

        if (result.error) {
            setError(result.error) 
        }
        else {
            handleEdit();
            setListing(result);
        }
    }

    return(
    <div className={styles.EditPhone}>
        <span>
            <input 
                type="text" 
                placeholder="Nouveau Numéro"
                value={phone}
                onChange={(e)=> setPhone(e.target.value)}
                />
        </span>
        {error.phone && <p className={styles.EditError}> {error.phone}</p> }
        {error.server && <p className={styles.EditError}> {error.server}</p> }

        <div className={styles.EditFunctions}>
            <button onClick={HandlePhone}> 
                {loading ? <div className="spinner"></div > : <span>  Mettre à jour </span>} 
            </button>
            <p className={styles.EditAction} onClick={handleEdit}> Annuler </p> 
        </div>

    </div>
    )
}
