'use client';

import Link from "next/link"
import styles from './style.module.css'

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { CheckUserStatus } from "@/_lib/auth/login";

import Icon from "@/_lib/utils/Icon";

export default function AuthLogin (){
    
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(null);
    const [viewHash, setViewHash] = useState(false)

    async function handleLogin(){
        setLoading(true)
        setError(null)

        const user_status = await CheckUserStatus(email);      
        
        if (user_status?.error) {
            setError(user_status.error);
        } else {
            const result = await signIn("credentials", {
                redirect: false, email, password
            });

            if (result?.error) {
                setError("L'e-mail ou le mot de passe est incorrect.");
            } else {
                router.replace ("/") 
            }
        }
        setLoading(false)
    }
    

    return(
        <div className={styles.PageContainer}>
            <div className={styles.PageBanner}>
                <h2>Accédez à votre compte</h2>  
                <ul className={styles.PageRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <li>Connexion</li>
                </ul>
            </div>
            <div className={styles.PageContent}>
                <div className={styles.PageForm}>  
                    <div className={styles.AuthBox}>
                            <h4> 
                                Bienvenue!
                            </h4>
                            
                            <div className={styles.AuthInput}>
                                <label htmlFor="email"> Adresse e-mail </label>
                                <div>
                                    <input type="text" id="email" placeholder='Adresse e-mail' value={email}
                                        onChange={(e)=>setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.AuthInput}>
                                <label htmlFor="password"> Mot de passe </label>
                                <div>
                                    <input id="password" placeholder='Mot de passe'
                                        type={viewHash? "text" : "password"} value={password}
                                        onChange={(e)=>setPassword(e.target.value)} 
                                    />
                                    <span className={styles.AuthHash} onClick={()=>setViewHash(!viewHash)}> 
                                        <Icon name={viewHash ? 'EyeOff' : 'Eye'}/>
                                    </span>
                                </div>
                            </div>

                            <Link href={'auth/reset'}>
                                <p className={styles.AuthForgot}>Mot de passe oublié?</p>
                            </Link>

                            {error && <p className={styles.AuthError}> {error} </p>}

                            <button onClick={handleLogin}> 
                                {!loading ? 
                                    <span>Se connecter</span>   :
                                    <div className="spinner" style={{background: 'white'}}></div>}
                            </button>

                            <p className={styles.AuthRedirect}>
                                Vous n'avez pas de compte? 
                                <Link href={'auth/signup'}> <span>Inscrivez-vous</span> </Link>
                            </p>
                    </div>          
                </div>
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


