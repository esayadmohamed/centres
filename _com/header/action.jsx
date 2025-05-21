"use client"
import Icon from "@/_lib/utils/Icon"
import styles from "./style.module.css"

import Link from "next/link"

export default function NavAction ({auth}){

    return(
        <>
        {auth? 
            <div className={styles.NavAction}>
                <Link href={'/listings/create'}>
                    <p>
                        <Icon name={'SquarePlus'} color={'white'}/>
                        Publier
                    </p>
                </Link>
            </div>
            :
            <div className={styles.NavAuth}>
                <Link href={'/auth'}>
                    <p>Se connecter</p>
                </Link>
            </div>
        }
        </>
    )
}