"use client"

import styles from "../uploads.module.css";

import Icon from "@/_lib/utils/Icon";

export default function Confirmation({close, handleImage}) {
    
    return(
    <div className={styles.Confirmation}>
        <Icon name={'CircleX'} color={'#e74c3c'}/>
        <p> Voulez-vous vraiment supprimer cette photo? </p>
        <span>
            <button onClick={close}> Annuler </button>
            <button onClick={()=>handleImage('remove')}> Suprimer </button>
            {/* uploadData[0] */}
        </span>
        
    </div>
    )
}