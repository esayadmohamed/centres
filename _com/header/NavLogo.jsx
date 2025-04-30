"use client"
import Link from "next/link"
import styles from "./style.module.css"

import Icon from "@/_lib/utils/Icon"

export default function NavLogo (){

    return(
        <div className={styles.Logo}> 
            <Link href={'/'}>
                <Icon name={'Component'}/>
                <p> CENTRES </p>
            </Link>
        </div>
    )
}