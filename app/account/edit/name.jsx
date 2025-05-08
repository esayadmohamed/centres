"use client"
import styles from "../account.module.css";

import { useState } from "react";

import { ModifyUsername } from "@/_lib/account/actions";

export default function EditName({close, setUser}) {
    
    const [name, setName] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);

    async function handleEdit (){
        setLoading(true);
        setError(null)

        const result = await ModifyUsername(name)
        setLoading(false)
        
        if(result?.error){
            setError(result.error)
        } else{
            close();
            setUser(result);
        }  
    }

    return(
    <div className={styles.EditSection}>
        <div className={styles.EditSpan}>
            <input 
                type="text" 
                placeholder="Prénom" 
                value={name}
                onChange={(e)=>setName(e.target.value)}
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


{/* <button onClick={handleEdit}> {loading ? <span className={styles.loader}></span > : <span> Mettre à jour </span>} </button> */}