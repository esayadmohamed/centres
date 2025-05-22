'use client';

import Link from "next/link"
import styles from './style.module.css'

import { useState, useRef } from "react";

import { PasswordToken } from "@/_lib/auth/reset";
import ReCAPTCHA from 'react-google-recaptcha';

import Icon from "@/_lib/utils/Icon";


export default function SendResetToken (){
    
    const recaptchaRef = useRef(null);

    const [email, setEmail] = useState('')
    const [captchaToken, setCaptchaToken] = useState(null);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(){
        setLoading(true)
        setError(null)

        const new_result = await PasswordToken(email, captchaToken);
        setLoading(false)
        
        recaptchaRef.current?.reset();
        setCaptchaToken(null);

        if(new_result?.error){
            setError(new_result.error)
        } else {
            setSuccess(true)
        }
    }

    return(
        <div className={styles.PageContainer}>
            <div className={styles.PageBanner}>
                <h2>Mot de Passe</h2>  
                <ul className={styles.PageRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <Link href={'/auth'}> <li>Connexion</li> </Link>
                    <li>/</li>
                    <li>Réinitialisation</li>
                </ul>
            </div>
            <div className={styles.PageContent}>
                {success?
                    <div className={styles.PageForm}>  
                        <div className={styles.AuthBox}>
                            <div className={styles.AuthSuccess}>                                  
                                <p className={styles.AuthTitle}>
                                    <Icon name={'Check'} color={'#2ecc71'}/>
                                    E-mail Envoyé
                                </p>
                                <p> Nous avons envoyé un lien de réinitialisation à votre adresse e-mail. </p>
                                <p className={styles.Authemail}> {email} </p>
                                <p>Cliquez sur le lien pour changer votre mot de pass.</p>
                                <p>Il se peut que vous deviez vérifier votre dossier 'Spam' ou 'Courrier indésirable'.</p>
                            </div>
                            <button onClick={()=>setSuccess(false)}> 
                                <span>Retourner</span>
                            </button>
                        </div>
                    </div>
                    :
                    <div className={styles.PageForm}>  
                        <div className={styles.AuthLogin}>
                            <div className={styles.AuthBox}>
                                <div className={styles.AuthSuccess}>
                                    <h4>Réinitialisation!</h4>
                                    <p> Merci de fournir l'adresse e-mail associée à votre compte. </p>
                                    <div className={styles.AuthInput}>
                                        <label htmlFor="email"> Adresse e-mail </label>
                                        <div>
                                            <input type="text" id="email" placeholder='Adresse e-mail' value={email}
                                                onChange={(e)=>setEmail(e.target.value)}
                                            />
                                        </div>
                                        {/* {error && <p className={styles.AuthError}> {error}</p> } */}
                                    </div>
                                </div>
                                
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                    onChange={(token)=>setCaptchaToken(token)}
                                />

                                {error && <p className={styles.AuthError}> {error}</p> }

                                <button onClick={handleSubmit}> 
                                    {!loading ? 
                                        <span>Envoyer</span>   :
                                        <div className="spinner" style={{background: 'white'}}></div>}
                                </button>
                            </div> 
                        </div>         
                    </div>
                }
                <div className={styles.PageMarketing}>
                    <div>
                        <Icon name={'Navigation2'} color={'#424949'}/>
                        <p> CENTRES </p>
                    </div>
                </div>
            </div>
        </div>
    )
}



    // if(success) {
    //     return(
    //         <div className={styles.PageContainer}>
    //             <div className={styles.PageBanner}>
    //                 <h2>Réinitialisation du Mot de Passe</h2>  
    //                 <ul className={styles.PageRoot}>
    //                     <Link href={'/'}> <li>Acueil</li> </Link>
    //                     <li>/</li>
    //                     <Link href={'/auth'}> <li>Connexion</li> </Link>
    //                     <li>/</li>
    //                     <li>Réinitialisation</li>
    //                 </ul>
    //             </div>
    //             <div className={styles.PageContent}>

    //                 <div className={styles.PageMarketing}>
    //                     <div>
    //                         <Icon name={'Navigation2'} color={'#424949'}/>
    //                         <p> CENTRES </p>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }