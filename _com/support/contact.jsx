'use client';

import Link from "next/link"
import styles from './style.module.css'

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ContactSupport } from "@/_lib/support/actions";


export default function Contact (){
    
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(null);

    async function handleContact(){
        setLoading(true)
        setError(null)

        const mail ={
            email: email,
            message: message,
        }

        const result = await ContactSupport(mail)
        setLoading(false)

        if(result?.error){
            setError(result.error)
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
                                <li>Support</li>
                            </ul>  
                            <h3> Message Envoyé </h3>
                            <p> Votre message a été envoyé avec succès. </p>
                            <p> En raison d'une charge élevée, nous avons besoin de plus de temps pour traiter votre demande. </p>
                            <p> Merci de votre compréhension. </p>
                        </div>
                        <button onClick={()=>router.push('/')}> 
                            <span>Retourner</span> 
                        </button>
                    </div>
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
                            <li>Support</li>
                        </ul>
                        
                        <h3> Contacter Le Support  </h3>
                        <p> Merci de fournir l'adresse e-mail associée à votre compte. </p>
                        <div className={styles.AuthInput}>
                            <label htmlFor="email"> Adresse e-mail </label>
                            <div>
                                <input type="text" id="email" placeholder='Adresse e-mail' value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>
                            {error?.email && <p className={styles.AuthError}> {error.email} </p>} 
                        </div>
                        <div className={styles.AuthInput}>
                            <label htmlFor="message"> Message </label>
                            <div>
                                <textarea id="message" placeholder='Message'
                                    value={message} onChange={(e)=>setMessage(e.target.value)}
                                    ></textarea>
                            </div>
                            {error?.message && <p className={styles.AuthError}> {error.message} </p>} 
                        </div>
                    </div>
                    <button onClick={handleContact}> 
                        {!loading ? 
                            <span>Envoyer</span>   :
                            <div className="spinner" style={{background: 'white'}}></div>}
                    </button>
                </div>
            </div>
        </div>      
    )
}

