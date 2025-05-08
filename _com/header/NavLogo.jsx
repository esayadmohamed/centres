"use client"
import Link from "next/link"
import styles from "./style.module.css"

import Icon from "@/_lib/utils/Icon"

export default function NavLogo (){

    return(
        <div className={styles.Logo}> 
            <Link href={'/'}>
                <Icon name={'Navigation2'} color={'#1f618d'}/>
                <p> CENTRES </p>
            </Link>
        </div>
    )
}