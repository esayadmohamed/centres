'use client';

import Link from "next/link"
import styles from './style.module.css'

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CreateUser } from "@/_lib/auth/signup";

import Icon from "@/_lib/utils/Icon";

export default function AuthSignup (){
    
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
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
            password: password
            }
        
        const result = await CreateUser(user)
        setLoading(false)
        
        if(result.error){
            setErrors(result.error)
        } else{
            setSuccess(true)
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
                                <li>Inscription</li>
                            </ul>
                            
                            <h3> Vérifiez Votre E-mail</h3>
                            <p>Nous avons envoyé un lien de vérification à votre adresse e-mail.</p>
                            <h4> {email} </h4>
                            <p>Cliquez sur le lien pour compléter le processus de vérification.</p>
                            <p>Il se peut que vous deviez vérifier votre dossier <b>"Spam"</b> ou <b>"Courrier indésirable"</b>.</p>
                        </div>
                        <button onClick={handleReturn}> 
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
                    <ul className={styles.AuthRoot}>
                        <Link href={'/'}> <li>Acueil</li> </Link>
                        <li>/</li>
                        <Link href={'/auth'}> <li>Connexion</li> </Link>
                        <li>/</li>
                        <li>Inscription</li>
                    </ul>
                    <h3> Créer un compte </h3>
                    
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
                            <input type="text" id="phone" placeholder='Numéro de téléphone' value={phone}
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
                                // onBlur={()=>setList(false)}
                            />
                            <span className={styles.AuthHash} onClick={()=>setViewHash(!viewHash)}> 
                                <Icon name={viewHash && list? 'EyeOff' : 'Eye'}/>
                            </span>                        
                        </div>
                        {list && 
                            <ul className={styles.AuthPassoword}>
                                <li>Le mot de passe doit contenir au moins:</li>
                                <li><Icon name={eight ? 'CircleCheck' : 'CircleX'} color={eight ? 'green' : 'red'} /> 8 caractères </li>
                                <li><Icon name={num ? 'CircleCheck' : 'CircleX'} color={num ? 'green' : 'red'} /> Un chiffre (1, 2, ...) </li>
                                <li><Icon name={capital ? 'CircleCheck' : 'CircleX'} color={capital ? 'green' : 'red'}/> Une lettre majuscule (A, B, ...) </li>
                                <li><Icon name={character ? 'CircleCheck' : 'CircleX'} color={character ? 'green' : 'red'}/> Un caractère spécial (@, #, ...) </li>
                            </ul>
                        }
                        {errors?.password && <p className={styles.AuthError}> {errors.password}</p> }
                    </div>
                    
                    <p className={styles.AuthAccept}>
                        En cliquant sur Soumettre, vous acceptez
                        <Link href={''}> <span>Nos Conditions d'utilisation</span> </Link> et 
                        <Link href={''}> <span>Notre Politique de confidentialité.</span> </Link>
                    </p> 

                    {errors?.server && <p className={styles.AuthError}> {errors.server}</p> }

                    <button onClick={handleSignup}> 
                        {!loading ? 
                            <span>Se connecter</span>   :
                            <div className="spinner" style={{background: 'white'}}></div>}
                    </button>

                    <p className={styles.AuthRedirect}>
                        Vous avez déjà un compte? 
                        <Link href={'/auth'}> <span>Se connecter</span> </Link>
                    </p>
                </div>

                <ul className={styles.AuthActions}>
                    <Link href={'/support'}> <li> <Icon name={'Headset'}/> Contacter Support </li> </Link>
                </ul>
            </div>
        </div>
    )
    
}


// const [match, setMatch] = useState(null); 
// const [passwordMatch, setPasswordMatch] = useState('');
{/* <div className={styles.AuthInput}>
<label htmlFor="passwordmatch"> Vérifier le mot de passe </label>
<div>
    <input id="passwordmatch" placeholder='Vérifier le mot de passe' type="password" 
        value={passwordMatch}
        onChange={(e)=>setPasswordMatch(e.target.value)}
        onFocus={()=>setMatch(true)}
    />                    
</div>
{match && 
    (password !== passwordMatch ? 
    <p className={styles.AuthError}> Le mot de passe ne correspond pas </p>:
    <p className={styles.AuthSuccess}> Les mots de passe correspondent </p>)
}
</div> */}