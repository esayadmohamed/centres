'use client';

import Link from "next/link"
import styles from './style.module.css'

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from 'react-google-recaptcha';

import { CreateUser } from "@/_lib/auth/signup";
import Notify from "../Notify";

import Icon from "@/_lib/utils/Icon";

export default function AuthSignup (){
    
    const router = useRouter();
    const recaptchaRef = useRef(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const [errors, setErrors] = useState(null);
    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(null);
    const [viewHash, setViewHash] = useState(false)

    async function handleSignup(){
        setLoading(true)
        setErrors(null)
        
        const user = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            captchaToken: captchaToken
            }
        
        const result = await CreateUser(user)
        setLoading(false)
        
        recaptchaRef.current?.reset();
        setCaptchaToken(null);

        if(result.error){
            setErrors(result.error)
        } else{
            setSuccess(true)
            Notify(`New Account Created ${email}`)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
    }

    const [list, setList] = useState(null); 
    const [eight, setEight] = useState(null); 
    const [num, setNum] = useState(null);
    const [capital, setCapital] = useState(null);
    const [character, setCharacter] = useState(null);

    function handlePassword(e){
        const value = e.target.value;
        setPassword(value)

        setEight(value.length >= 8 ? true : false)
        setCapital(/[A-Z]/.test(value) ? true : false)
        setNum(/\d/.test(value) ? true : false)
        setCharacter(/[!@#$%^&*(),.?":{}|<>]/.test(value) ? true : false)
    }

    function handleReturn(){
        setSuccess(false);
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setErrors(null);
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
                    <li>S'inscrire</li>
                </ul>
            </div>
            <div className={styles.PageContent}>
                {success? 
                    <div className={styles.PageForm}>  
                        <div className={styles.AuthBox}>
                            <div className={styles.AuthSuccess}>                                             
                                <p className={styles.AuthTitle}>
                                    <Icon name={'Check'} color={'#2ecc71'}/>
                                    Vérifiez Votre E-mail
                                </p>
                                <p>Nous avons envoyé un lien de vérification à votre adresse e-mail.</p>
                                <p className={styles.Authemail}> {email} </p>
                                <p>Cliquez sur le lien pour compléter le processus de vérification.</p>
                                <p>Il se peut que vous deviez vérifier votre dossier 'Spam' ou 'Courrier indésirable'.</p>
                            </div>
                            <button onClick={handleReturn}> 
                                <span>Retourner</span>
                            </button>
                        </div>
                    </div>
                    :
                    <div className={styles.PageForm}>  
                        <div className={styles.AuthBox}>  
                            <h4>
                                Inscription!
                            </h4>                          
                            <div className={styles.AuthInput}>
                                <label htmlFor="name"> Prénom </label>
                                <div>
                                    <input type="text" id="name" placeholder='Prénom' value={name}
                                        onChange={(e)=>setName(e.target.value)} autoComplete="off"
                                    />
                                </div>
                                {errors?.name && <p className={styles.AuthError}> {errors.name}</p> }
                            </div>
                            <div className={styles.AuthInput}>
                                <label htmlFor="email">  Adresse e-mail </label>
                                <div>
                                    <input type="email" id="email" placeholder='Adresse e-mail' value={email}
                                        onChange={(e)=>setEmail(e.target.value)} autoComplete="off"
                                    />
                                </div>
                                {errors?.email && <p className={styles.AuthError}> {errors.email}</p> }
                            </div>
                            <div className={styles.AuthInput}>
                                <label htmlFor="phone"> Numéro de téléphone </label>
                                <div>
                                    <input type="tel" id="phone" placeholder='Numéro de téléphone' value={phone}
                                        onChange={(e)=>setPhone(e.target.value)} autoComplete="off"
                                    />
                                </div>
                                {errors?.phone && <p className={styles.AuthError}> {errors.phone}</p> }
                            </div>

                            <div className={styles.AuthInput}>
                                <label htmlFor="password"> Mot de passe </label>
                                <div>
                                    <input id="password" placeholder='Mot de passe' value={password}
                                        type={viewHash? "text" : "password"} autoComplete="off"
                                        onChange={handlePassword}
                                        onFocus={()=>setList(true)}
                                    />
                                    <span className={styles.AuthHash} onClick={()=>setViewHash(!viewHash)}> 
                                        <Icon name={viewHash && list? 'EyeOff' : 'Eye'} color={'#424949'}/>
                                    </span>                        
                                </div>
                                {list && 
                                    <ul className={styles.AuthPassoword}>
                                        <li><Icon name={eight ? 'Check' : 'X'} color={eight ? 'green' : 'red'} /> 8 caractères </li>
                                        <li><Icon name={num ? 'Check' : 'X'} color={num ? 'green' : 'red'} /> Un chiffre (1, 2, ...) </li>
                                        <li><Icon name={capital ? 'Check' : 'X'} color={capital ? 'green' : 'red'}/> Une lettre majuscule (A, B, ...) </li>
                                        <li><Icon name={character ? 'Check' : 'X'} color={character ? 'green' : 'red'}/> Un caractère spécial (@, #, ...) </li>
                                    </ul>
                                }
                                {errors?.password && <p className={styles.AuthError}> {errors.password}</p> }
                            </div>
                            
                            <p className={styles.AuthAccept}>
                                En créant un compte, vous acceptez 
                                    <Link href={'/conditions'}> <span>les règles et conditions d'utilisation</span> </Link>
                            </p> 
                            
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                onChange={(token)=>setCaptchaToken(token)}
                            />

                            {errors?.captcha && <p className={styles.AuthError}> {errors.captcha}</p> }

                            {errors?.server && <p className={styles.AuthError}> {errors.server}</p> }

                            <button onClick={handleSignup}> 
                                {!loading ? 
                                    <span>S'inscrire</span>   :
                                    <div className="spinner" style={{background: 'white'}}></div>}
                            </button>

                            <p className={styles.AuthRedirect}>
                                Vous avez déjà un compte? 
                                <Link href={'/auth'}> <span>Se connecter</span> </Link>
                            </p>
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


    // router.replace ("/") 

    // if(success) {
    //     return(
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
    //                     <div className={styles.AuthBox}>
    //                         <div className={styles.AuthSuccess}>                                             
    //                             <p className={styles.AuthTitle}>
    //                                 <Icon name={'Check'} color={'#2ecc71'}/>
    //                                 Vérifiez Votre E-mail
    //                             </p>
    //                             <p>Nous avons envoyé un lien de vérification à votre adresse e-mail.</p>
    //                             <p className={styles.Authemail}> {email}jklkljlkj </p>
    //                             <p>Cliquez sur le lien pour compléter le processus de vérification.</p>
    //                             <p>Il se peut que vous deviez vérifier votre dossier "Spam" ou "Courrier indésirable".</p>
    //                         </div>
    //                         <button onClick={handleReturn}> 
    //                             <span>Retourner</span>
    //                         </button>
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

        // <div className={styles.PageContainer}>
        //     <div className={styles.PageBanner}>
        //         <h2>Créer un compte</h2>  
        //         <ul className={styles.PageRoot}>
        //             <Link href={'/'}> <li>Acueil</li> </Link>
        //             <li>/</li>
        //             <Link href={'/auth'}> <li>Connexion</li> </Link>
        //             <li>/</li>
        //             <li>Inscription</li>
        //         </ul>
        //     </div>
        //     <div className={styles.PageContent}>
        //         <div className={styles.PageForm}>  
        //             <div className={styles.AuthLogin}>
                        
        //             </div>         
        //         </div>
        //         <div className={styles.PageMarketing}>
        //             <div>
        //                 <Icon name={'Navigation2'} color={'#424949'}/>
        //                 <p> CENTRES </p>
        //             </div>
        //         </div>
        //     </div>
        // </div>