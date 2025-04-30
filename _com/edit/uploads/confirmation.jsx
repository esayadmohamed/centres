"use client"

import styles from "../uploads.module.css";

import Icon from "@/_lib/utils/Icon";

export default function Confirmation({close, handleImage}) {
    
    return(
    <div className={styles.Confirmation}>
        <Icon name={'CircleX'} color={'#e74c3c'}/>
        <p> Voulez-vous vraiment supprimer cette photo? </p>
        <span>
            <button onClick={close}> No, Annuler </button>
            <button onClick={()=>handleImage('remove')}> Oui, Suprimer </button>
            {/* uploadData[0] */}
        </span>
        
    </div>
    )
}