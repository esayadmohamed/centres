"use client"
import styles from "./style.module.css"

import Link from "next/link"
import Icon from "@/_lib/utils/Icon"
import { useState } from "react"

import NavSidebar from './sidebar';

export default function NavLogo ({isAuthenticated}){

    const [toggle, setToggle] = useState(false)

    return(
        <div className={styles.Logo}> 
            <span onClick={()=>setToggle(true)}> 
                <Icon name={'AlignJustify'} color={'#424949'}/> 
            </span>
            
            <NavSidebar toggle={toggle} setToggle={setToggle} isAuthenticated={isAuthenticated}/>

            <p>
                <Icon name={'Navigation2'} color={'#1f618d'}/>
                <Link href={'/'}> CENTRES </Link>
            </p>
        </div>
    )
}