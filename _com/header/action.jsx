"use client"
import Icon from "@/_lib/utils/Icon"
import styles from "./style.module.css"

import Link from "next/link"
import { signOut } from "next-auth/react"

export default function NavAction ({auth}){

    return(
        <>
        {auth? 
            <div className={styles.NavAction}>
                <span onClick={()=>signOut({ callbackUrl: "/" })}>
                    Deconnexion
                </span>
                <Link href={'/listings/create'}>
                    <p>
                        <Icon name={'SquarePlus'} color={'white'}/>
                        Publier
                    </p>
                </Link>
            </div>
            :
            <div className={styles.NavAuth}>
                <Link href={'/auth/signup'}>
                    <span>
                        Créer un compte
                    </span>
                </Link>
                <Link href={'/auth'}>
                    <p>
                        <Icon name={'User'} color={'white'}/>
                        Se connecter
                    </p>
                </Link>
            </div>
        }
        </>
    )
}