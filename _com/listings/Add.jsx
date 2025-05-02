// 'use client'
import Link from "next/link";
import styles from "./style.module.css";

import Icon from "@/_lib/utils/Icon";


export default function Add(){
    return(
        <Link href={'/listings/create'}>
            <div className={styles.addlisting}>
                <div className={styles.addVisual}>
                    <Icon name={'Plus'}/>
                    
                </div>
                <div className={styles.addDetails}>
                    {/* Ajouter Une Annonce */}
                </div>

            </div>
        </Link>
    )

}