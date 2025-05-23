'use client';
import Link from "next/link"
import styles from './style.module.css'

import { useState } from "react";

import { ResendToken } from "@/_lib/auth/verify";

import Icon from "@/_lib/utils/Icon";

export default function AuthToken ({result}){
     
    const [newResult, setNewResult] = useState(result)
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleResend(){
        setLoading(true);
        setError(null)

        const result = await ResendToken(email);
        setLoading(false);

        if(result?.error){
            setError(result.error)
        } else{
            setNewResult(null)
        }
    }


    return(
        <div className={styles.PageContainer}>
            <div className={styles.PageBanner}>
                <h2>Créer un compte</h2>  
                <ul className={styles.PageRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <Link href={'/auth'}> <li>Connexion</li> </Link>
                    <li>/</li>
                    <li>Inscription</li>
                </ul>
            </div>
            <div className={styles.PageContent}>
                {newResult?.error?
                    <div className={styles.PageForm}>  
                        <div className={styles.AuthBox}>
                            <div className={styles.AuthSuccess}>
                                <h4> 
                                    <Icon name={'X'} color={'#e74c3c'}/> 
                                    Email Non Vérifiée 
                                </h4>
                                <p>{newResult.error}</p>
                                <p>Merci de fournir l'adresse e-mail associée à votre compte pour renvoyer un nouveau code.</p>
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
                            <button onClick={handleResend}> 
                                {!loading ? 
                                    <span>Renvoyer le code</span>   :
                                    <div className="spinner" style={{background: 'white'}}></div>}
                            </button>
                        </div>
                    </div>
                    :
                    <div className={styles.PageForm}>  
                        <div className={styles.AuthLogin}>
                            <div className={styles.AuthBox}>
                                <div className={styles.AuthSuccess}>                                
                                    <h4> 
                                        <Icon name={'Check'} color={'#28b463'}/> 
                                        Email Vérifié
                                    </h4>
                                    <p>Votre adresse e-mail a été vérifié avec succès.</p>
                                    <p>Vous pouvez accéder a votre compte en cliquant sur le bouton ci-dessous.</p>
                                </div>
                                <button> 
                                    <Link href={'/auth'}><span>Accédez à votre compte</span></Link>
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

    // if(newResult?.error) {
    //     return ( //email exist - account 'none' but no token
    //         <div className={styles.PageContainer}>
    //             <div className={styles.PageBanner}>
    //                 <h2>Créer un compte</h2>  
    //                 <ul className={styles.PageRoot}>
    //                     <Link href={'/'}> <li>Acueil</li> </Link>
    //                     <li>/</li>
    //                     <Link href={'/auth'}> <li>Connexion</li> </Link>
    //                     <li>/</li>
    //                     <li>Inscription</li>
    //                 </ul>
    //             </div>
    //             <div className={styles.PageContent}>
    //                 <div className={styles.PageForm}>  
    //                     <div className={styles.AuthLogin}>
    //                         <div className={styles.AuthBox}>
    //                             <div className={styles.AuthSuccess}>
    //                                 <h3> Email Non Vérifiée </h3>
    //                                 <p className={styles.AuthError}> {newResult.error}  </p>
    //                                 <div className={styles.AuthInput}>
    //                                     <label htmlFor="email"> Adresse e-mail </label>
    //                                     <div>
    //                                         <input type="text" id="email" placeholder='Adresse e-mail' value={email}
    //                                             onChange={(e)=>setEmail(e.target.value)}
    //                                         />
    //                                     </div>
    //                                     {error && <p className={styles.AuthError}> {error}</p> }
    //                                 </div>
    //                             </div>
    //                             <button onClick={handleResend}> 
    //                                 {!loading ? 
    //                                     <span>Renvoyer le code</span>   :
    //                                     <div className="spinner" style={{background: 'white'}}></div>}
    //                             </button>
    //                         </div>
    //                     </div>         
    //                 </div>
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