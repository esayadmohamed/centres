"use client"
import styles from "../account.module.css";

import { useState } from "react";
import { signOut } from "next-auth/react";

import { ModifyActive } from "@/_lib/account/actions";

import { Trash2 } from "lucide-react";

export default function EditActive() {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [password, setPassword] = useState('')

    async function handleEdit (){
        setLoading(true)
        setError(null)

        const result = await ModifyActive(password)
        setLoading(false)

        if(result.error){
            setError(result.error)
        } else{
            signOut({ callbackUrl: "/" })
        }
    }

    function handleConfirm(){
        setConfirm(!confirm)
        setError(null)
    }

    return(
    <div className={styles.EditAccount}>
        {confirm ? 
            <div className={styles.AccountConfirmation}>
                
                <p className={styles.Disclaimer}> 
                    La suppression de votre compte est définitive. 
                    Toutes vos données seront supprimées de manière permanente. 
                    Veuillez confirmer votre mot de passe pour continuer.
                </p>

                <span className={styles.AccountSpan}>
                    <input 
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </span>
                
                {error && <p className={styles.EditError}> {error}</p> }
                
                <div className={styles.EditFunctions}>
                    <button onClick={handleEdit}> 
                        {loading ? <div className="spinner"></div > : <span>  Confirmer </span>} 
                    </button>
                    <p className={styles.AccountEdit} onClick={handleConfirm}> Annuler </p> 
                </div>
            </div> 
            : 
            <div className={styles.AccountTermination}>
                <button onClick={()=> setConfirm(true)}> <span> <Trash2 /> Supprimer le compte </span> </button>
            </div>
        }
    </div>
    )
}
