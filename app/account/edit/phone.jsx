"use client"
import styles from "../account.module.css";

import { useState } from "react";

import { ModifyPhone } from "@/_lib/account/actions";

export default function EditPhone({close, setUser}) {
    
    const [phone, setPhone] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleEdit (){
        setLoading(true)
        setError(null)

        const result = await ModifyPhone(phone)
        setLoading(false)

        if(result?.error){
            setError(result.error)
        } else{
            close();
            setUser(result)
        }
    }

    return(
    <div className={styles.EditSection}>
        <div className={styles.EditSpan}>
            <input 
                type="text" 
                placeholder="Numéro de téléphone" 
                value={phone}
                maxLength="10"
                onChange={(e)=>setPhone(e.target.value)}
            />
        </div>
        
        {error && <p className={styles.EditError}> {error}</p> }
        
        <div className={styles.EditActions}>
            <button onClick={handleEdit}> 
                {loading ? <div className="spinner"></div > : <span>  Mettre à jour </span>} 
            </button>
            <p onClick={close} className={styles.AccountEdit}> Annuler </p> 
        </div>

    </div>
    )
}