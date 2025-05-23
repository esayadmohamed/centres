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
                <div className={styles.PageForm}>  
                    <div className={styles.AuthBox}>
                        <h4>Réinitialisation!</h4>
                        <div className={styles.AuthInput}>
                            <label htmlFor="password"> Mot de passe </label>
                            <div>
                                <input id="password" placeholder='Mot de passe' value={mainPassword}
                                    type={viewHash? "text" : "password"} 
                                    onChange={handlePassword}
                                    onFocus={()=>setList(true)}
                                />
                                <span className={styles.AuthHash} onClick={()=>setViewHash(!viewHash)}> 
                                    <Icon name={viewHash? 'EyeOff' : 'Eye'} color={'#424949'}/>
                                </span>                        
                            </div>
                            <ul className={styles.AuthPassoword}>
                                <li><Icon name={eight ? 'Check' : 'X'} color={eight ? 'green' : 'red'} /> 8 caractères </li>
                                <li><Icon name={num ? 'Check' : 'X'} color={num ? 'green' : 'red'} /> Un chiffre (1, 2, ...) </li>
                                <li><Icon name={capital ? 'Check' : 'X'} color={capital ? 'green' : 'red'}/> Une lettre majuscule (A, B, ...) </li>
                                <li><Icon name={character ? 'Check' : 'X'} color={character ? 'green' : 'red'}/> Un caractère spécial (@, #, ...) </li>
                            </ul>
                        </div>
                        <div className={styles.AuthInput}>
                            <label htmlFor="passwordmatch"> Confirmer le mot de passe </label>
                            <div>
                                <input id="passwordmatch" placeholder='Confirmer le mot de passe' type="password" 
                                    value={matchPassword}
                                    onChange={(e)=>setMatchPassword(e.target.value)}
                                    onFocus={()=>setMatch(true)}
                                />   
                                {(match && mainPassword && matchPassword) &&
                                    <span className={styles.AuthMatch}> 
                                        <Icon name={mainPassword === matchPassword? 'Check' : 'X'} 
                                            color={mainPassword === matchPassword? '#28b463' : '#e74c3c'} />
                                    </span>  
                                }                   
                            </div>
                            
                        </div>

                        {error?.password && <p className={styles.AuthError}> {error.password}</p> }

                        <button onClick={handleSubmit}> 
                            {!loading ? 
                                <span>Réinitialiser</span>   :
                                <div className="spinner" style={{background: 'white'}}></div>}
                        </button>

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