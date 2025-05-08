'use client';

import Link from "next/link"
import styles from './style.module.css'

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PasswordReset } from "@/_lib/auth/reset";

import Icon from "@/_lib/utils/Icon";

export default function ResetPassword ({reset_token}){

    const router = useRouter();
    
    const [mainPassword, setMainPassword] = useState('')
    const [matchPassword, setMatchPassword] = useState('')

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [viewHash, setViewHash] = useState(false)
    const [list, setList] = useState(null); 
    
    async function handleSubmit(){
        setLoading(true)
        setError(null)

        const password = {
            mainPassword: mainPassword,
            matchPassword: matchPassword,
            token: reset_token
        }

        const new_result = await PasswordReset(password);
        setLoading(false)
        
        if(new_result?.error){
            setError(new_result.error)
        } else {
            router.replace ("/auth")
        }
        
    }

    const [match, setMatch] = useState(null); 
    const [eight, setEight] = useState(null); 
    const [num, setNum] = useState(null);
    const [capital, setCapital] = useState(null);
    const [character, setCharacter] = useState(null);

    function handlePassword(e){
        const value = e.target.value;
        setMainPassword(value)

        setEight(value.length >= 8 ? true : false)
        setCapital(/[A-Z]/.test(value) ? true : false)
        setNum(/\d/.test(value) ? true : false)
        setCharacter(/[!@#$%^&*(),.?":{}|<>]/.test(value) ? true : false)
    }

    return(
        <div className={styles.AuthContent}>
            <div className={styles.AuthContainer}>
                <div className={styles.AuthBox}>
                    <ul className={styles.AuthRoot}>
                        <Link href={'/'}> <li>Acueil</li> </Link>
                        <li>/</li>
                        <Link href={'/auth'}> <li>Connexion</li> </Link>
                        <li>/</li>
                        <li> Réinitialisation </li>
                    </ul>

                    <h3> Réinitialisation du Mot de Passe </h3>

                    <div className={styles.AuthInput}>
                        <label htmlFor="password"> Mot de passe </label>
                        <div>
                            <input id="password" placeholder='Mot de passe' value={mainPassword}
                                type={viewHash? "text" : "password"} 
                                onChange={handlePassword}
                                onFocus={()=>setList(true)}
                            />
                            <span className={styles.AuthHash} onClick={()=>setViewHash(!viewHash)}> 
                                <Icon name={viewHash? 'EyeOff' : 'Eye'}/>
                            </span>                        
                        </div>
                        {(list && mainPassword) && 
                            <ul className={styles.AuthPassoword}>
                                <li>Le mot de passe doit contenir au moins:</li>
                                <li><Icon name={eight ? 'CircleCheck' : 'CircleX'} color={eight ? 'green' : 'red'} /> 8 caractères </li>
                                <li><Icon name={num ? 'CircleCheck' : 'CircleX'} color={num ? 'green' : 'red'} /> Un chiffre (1, 2, ...) </li>
                                <li><Icon name={capital ? 'CircleCheck' : 'CircleX'} color={capital ? 'green' : 'red'}/> Une lettre majuscule (A, B, ...) </li>
                                <li><Icon name={character ? 'CircleCheck' : 'CircleX'} color={character ? 'green' : 'red'}/> Un caractère spécial (@, #, ...) </li>
                            </ul>
                        }
                    </div>
                    <div className={styles.AuthInput}>
                        <label htmlFor="passwordmatch"> Confirmer le mot de passe </label>
                        <div>
                            <input id="passwordmatch" placeholder='Confirmer le mot de passe' type="password" 
                                value={matchPassword}
                                onChange={(e)=>setMatchPassword(e.target.value)}
                                onFocus={()=>setMatch(true)}
                            />                       
                        </div>
                        {(match && mainPassword && matchPassword) &&
                            ( mainPassword !== matchPassword ? 
                            <p className={styles.AuthError}> Le mot de passe ne correspond pas </p>:
                            <p className={styles.AuthSuccess}> Les mots de passe correspondent </p>)
                        }
                    </div>

                    {error?.password && <p className={styles.AuthError}> {error.password}</p> }

                    <button onClick={handleSubmit}> 
                        {!loading ? 
                            <span>Se connecter</span>   :
                            <div className="spinner" style={{background: 'white'}}></div>}
                    </button>

                </div>

                <ul className={styles.AuthActions}>
                    <li> 
                        <Icon name={'Headset'} color={'#424949'}/> 
                        support@centres.ma 
                    </li> 
                </ul>
            </div>
        </div>



        //         <span className={styles.AuthResetInput}>
        //             <label htmlFor="passwordmatch"></label>
        //             <span>
        //                 <input 
        //                     type="password" id="passwordmatch" placeholder="Confirmer le mot de passe" autoComplete="off" 
        //                     value={matchPassword}
        //                     onChange={(e)=>setMatchPassword(e.target.value)}
        //                 />
        //             </span>
        //         </span>

        //     </div>
        // </div>
    )
}