"use client"

import styles from "../selects.module.css";
import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

import { ModifyOffers } from "@/_lib/listings/editdata";


export default function EditOffers({offers, alloffers, listing_id, handleEdit, setListing}) {
    
    const [selected, setSelected] = useState(offers.map((e)=>e.name));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    function handleSelect(one) {
        setSelected(prev => 
            prev.includes(one) ? prev.filter(item => item !== one) : [...prev, one]
        );
    }

    async function HandleMaplink(){
        setLoading(true);
        setError('');
        
        const result = await ModifyOffers(listing_id, selected)
        setLoading(false)

        if (result?.error) {
            setError(result.error) 
        }
        else {
            handleEdit();
            setListing(result);
        }
    }


    return(
        <div className={styles.EditSelectBox}>

            <ul>
                {alloffers.map((item, id)=> 
                    <li key={id} 
                        onClick={() => handleSelect(item.name)} 
                        className={selected.includes(item.name) ? styles.Selected : styles.NotSelected}
                    >
                        <Icon name={item.icon} color={selected.includes(item.name) ? 'white' : 'black'}/> {item.name}
                    </li>
                
                )} 
            </ul>

            {error && <p className={styles.EditError}> {error}</p> }

            <div className={styles.EditFunctions}>
                <button onClick={HandleMaplink}> 
                    {loading ? <div className="spinner"></div > : <span>  Mettre à jour </span>} 
                </button>
                <p className={styles.EditAction} onClick={handleEdit}> Annuler </p> 
            </div>

        </div>
    )
}


{/* <button  {loading ? <span className={styles.loader}></span > : <span> Mettre à jour </span>} </button> */}
