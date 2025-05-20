'use client';
import styles from "./css/signup.module.css";

import Link from "next/link";
import Icon from "@/_lib/utils/Icon";
import { useState, useRef} from "react";

import ReCAPTCHA from 'react-google-recaptcha';
import { CreateUser } from "@/_lib/auth/signup";
import Notify from "../Notify";

import display from '@/public/images/singup.png'

export default function LandingSignup({signupRef, email, setEmail}) {
    
    const recaptchaRef = useRef(null);    

    const [name, setName] = useState('')
    
    const [number, setNumber] = useState('')
    const [password, setPassword] = useState('')
    const [captcha, setCaptcha] = useState(null)

    const [view, setView] = useState(false)
    const [toggle, setToggle] = useState(false)

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    async function handleSubmit(){
        if(loading) return

        setLoading(true)
        setErrors({})
        
        const user = {
            name: name,
            email: email,
            phone: number,
            password: password,
            captchaToken: captcha
            }
        
        const result = await CreateUser(user)
        setLoading(false)
        console.log(result);
        
        recaptchaRef.current?.reset();
        setCaptcha(null);

        if(result.error){
            setErrors(result.error)
        } else{
            Notify(`New Account Created ${email}`)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

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

    return (
        <div className={styles.BodySignup} ref={signupRef}>
            <div className={styles.SignupContainer}>
                <div className={styles.SignupForm}>
                    <h3> Créer un compte </h3>
                    <div className={styles.FormItem}>
                        <label htmlFor="name">Prénom: </label>
                        <p>
                            <input type="text" placeholder="Prénom" 
                                value={name} onChange={(e)=>setName(e.target.value)}/>
                        </p>  
                    </div>

                    {errors?.name && <p className={styles.FormError}> {errors.name}</p> }

                    <div className={styles.FormItem}>
                        <label htmlFor="email">Adresse email: </label>
                        <p>
                            <input type="email" placeholder="Adresse email"
                                value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </p>  
                    </div>

                    {errors?.email && <p className={styles.FormError}> {errors.email}</p> }

                    <div className={styles.FormItem}>
                        <label htmlFor="tel">Numero de téléphone: </label>
                        <p>
                            <input type="tel" placeholder="Numero de téléphone" 
                                value={number} onChange={(e)=>setNumber(e.target.value)}/>
                        </p>  
                    </div>
                    
                    {errors?.phone && <p className={styles.FormError}> {errors.phone}</p> }

                    <div className={styles.FormItem}>
                        <label htmlFor="password">Mot de passe: </label>
                        <p>
                            <input 
                                type={view? 'text' : 'password'} 
                                placeholder="Mot de passe"
                                value={password}
                                onChange={handlePassword}
                                onFocus={()=>setToggle(true)}
                                />
                            <span onClick={()=>setView(!view)}> 
                                <Icon name={view?'EyeOff':'Eye'} color={'#424949'}/> 
                            </span>
                        </p>  
                    </div>
                    {toggle && 
                        <ul>
                            <li>                        
                                <Icon 
                                    name={eight ? 'Check' : 'X'} 
                                    color={eight ? '#239b56' : '#e74c3c'}
                                    />
                                <p>8 caractères</p>
                            </li>
                            <li>
                                <Icon 
                                    name={num ? 'Check' : 'X'} 
                                    color={num ? '#239b56' : '#e74c3c'}
                                    />                        
                                <p>Un chiffre (1, 2, ...)</p>
                            </li>
                            <li>
                                <Icon 
                                    name={capital ? 'Check' : 'X'} 
                                    color={capital ? '#239b56' : '#e74c3c'}
                                    />
                                <p>Une lettre majuscule (A, B, ...)</p>
                            </li>
                            <li>
                                <Icon 
                                    name={character ? 'Check' : 'X'} 
                                    color={character ? '#239b56' : '#e74c3c'}
                                    />                        
                                <p>Un caractère spécial (@, #, ...)</p>
                            </li>
                        </ul>
                    }

                    {errors?.password && <p className={styles.FormError}> {errors.password}</p> }

                    <p className={styles.FormAccept}>
                        En créant un compte, vous acceptez 
                            <Link href={'/conditions'}> <span>nos règles et conditions d'utilisation</span></Link>
                    </p> 

                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        onChange={(token)=>setCaptcha(token)}
                    />

                    {errors?.captcha && <p className={styles.FormError}> {errors.captcha}</p> }

                    {errors?.server && <p className={styles.FormError}> {errors.server}</p> }

                    {Object.keys(errors).length !== 0 && <p className={styles.FormError}> Veuillez vérifier vos saisies </p>}

                    <button onClick={handleSubmit}>
                        {loading? 
                            <div className={'spinner'}></div>
                            :
                            'Créer'    
                        }
                    </button>
                </div>
                <div className={styles.SignupDisplay} 
                    style={{backgroundImage: `url(${display.src}), linear-gradient(to bottom left, #f8f9f9, #ffffff)`}}>
                </div>
            </div>
        </div>
    )

}

