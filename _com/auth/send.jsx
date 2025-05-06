'use client';

import Link from "next/link"
import styles from './style.module.css'

import { useState } from "react";

import { PasswordToken } from "@/_lib/auth/reset";

import Icon from "@/_lib/utils/Icon";


export default function SendResetToken (){
    
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(){
        setLoading(true)
        setError(null)

        const new_result = await PasswordToken(email);
        setLoading(false)
        console.log(new_result);
        
        if(new_result?.error){
            setError(new_result.error)
        } else {
            setSuccess(true)
        }
    }

    if(success) {
        return(
            <div className={styles.AuthContent}>
                <div className={styles.AuthContainer}>
                    <div className={styles.AuthBox}>
                        <div className={styles.AuthSuccess}>
                            <ul className={styles.AuthRoot}>
                                <Link href={'/'}> <li>Acueil</li> </Link>
                                <li>/</li>
                                <Link href={'/auth'}> <li>Connexion</li> </Link>
                                <li>/</li>
                                <li>Réinitialisation</li>
                            </ul>
                            
                            <h3> E-mail Envoyé </h3>
                            <p> Nous avons envoyé un lien de réinitialisation à votre adresse e-mail. </p>
                            <h4> {email} </h4>
                            <p>Cliquez sur le lien pour compléter le processus de réinitialisation.</p>
                            <p>Il se peut que vous deviez vérifier votre dossier <b>"Spam"</b> ou <b>"Courrier indésirable"</b>.</p>
                        </div>
                        <button onClick={()=>setSuccess(false)}> 
                            <span>Retourner</span>
                        </button>
                    </div>
                    <ul className={styles.AuthActions}>
                        <Link href={'/support'}> <li> <Icon name={'Headset'}/> Contacter Support </li> </Link>
                    </ul>
                </div>
            </div>
        )
    }
    return(
        <div className={styles.AuthContent}>
            <div className={styles.AuthContainer}>
                <div className={styles.AuthBox}>
                    <div className={styles.AuthSuccess}>
                        <ul className={styles.AuthRoot}>
                            <Link href={'/'}> <li>Acueil</li> </Link>
                            <li>/</li>
                            <Link href={'/auth'}> <li>Connexion</li> </Link>
                            <li>/</li>
                            <li>Réinitialisation</li>
                        </ul>
                        
                        <h3> Réinitialisation du Mot de Passe </h3>
                        <p> Merci de fournir l'adresse e-mail associée à votre compte. </p>
                        <div className={styles.AuthInput}>
                            <label htmlFor="email"> Adresse e-mail </label>
                            <div>
                                <input type="text" id="email" placeholder='Adresse e-mail' value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>
                            {error && <p className={styles.AuthError}> {error}</p> }
                        </div>
                    </div>
                    <button onClick={handleSubmit}> 
                        {!loading ? 
                            <span>Envoyer</span>   :
                            <div className="spinner" style={{background: 'white'}}></div>}
                    </button>
                </div>
                <ul className={styles.AuthActions}>
                    <Link href={'/support'}> <li> <Icon name={'Headset'}/> Contacter Support </li> </Link>
                </ul>
            </div>
        </div>
    )
}