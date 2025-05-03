"use client"
import styles from "../account.module.css";

import { useState } from "react";
import { ModifyPassword } from "@/_lib/account/actions";

import { CircleX, Eye, EyeOff } from "lucide-react"

import Icon from "@/_lib/utils/Icon";

export default function EditPassword({close}) {
    
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const [viewHash, setViewHash] = useState(false)

    async function handleEdit (){
        setLoading(true)
        setError(null)

        const result = await ModifyPassword(password)
        setLoading(false)
        console.log(result);
        
        if(result?.error){
            setError(result.error)
        } else{
            close();
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

    return(
        <div className={styles.EditSection}>
            <div className={styles.EditSpan}>
                <input 
                    type={viewHash? "text" : "password"} 
                    placeholder="Mot de passe"
                    value={password}
                    onChange={handlePassword}
                />
                <span>
                    {!viewHash ? <Eye onClick={()=>setViewHash(true)}/> : <EyeOff onClick={()=>setViewHash(false)}/>}
                </span>
            </div>

            <ul className={styles.AuthPassoword}>
                <li>Le mot de passe doit contenir au moins:</li>
                <li><Icon name={eight ? 'CircleCheck' : 'CircleX'} color={eight ? 'green' : 'red'} /> 8 caractères </li>
                <li><Icon name={num ? 'CircleCheck' : 'CircleX'} color={num ? 'green' : 'red'} /> Un chiffre (1, 2, ...) </li>
                <li><Icon name={capital ? 'CircleCheck' : 'CircleX'} color={capital ? 'green' : 'red'}/> Une lettre majuscule (A, B, ...) </li>
                <li><Icon name={character ? 'CircleCheck' : 'CircleX'} color={character ? 'green' : 'red'}/> Un caractère spécial (@, #, ...) </li>
            </ul>
            
            {error && <p className={styles.EditError}> {error}</p> }

            <div className={styles.EditActions}>
                <button onClick={handleEdit}> 
                    {loading ? <div className="spinner"></div > : <span>  Mettre à jour </span>} 
                </button>
                <p onClick={close}> Annuler </p> 
            </div>

    </div>
    )
}


// {error && 
//     <ul>
//         {error.long &&  <li> <CircleX fill="#e74c3c" /> {error.long} </li> }
//         {error.number &&  <li> <CircleX fill="#e74c3c" /> {error.number} </li> }
//         {error.uppercase &&  <li> <CircleX fill="#e74c3c" /> {error.uppercase} </li> }
//         {error.character &&  <li> <CircleX fill="#e74c3c" /> {error.character} </li> }
//     </ul>
//     }