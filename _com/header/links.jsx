"use client"
import styles from "./style.module.css"

import Link from "next/link"
import { usePathname } from "next/navigation"


export default function NavLinks (){

    const pathname = usePathname();    

    return(
        <ul className={styles.NavLinks}>
                <Link href={'/centres'}> 
                    <li style={{fontWeight: pathname === '/centres' ? '600' : '500'}}> 
                        Centres 
                    </li> 
                </Link>
                {/* <Link href={'/cours'}>  */}
                    <li style={{fontWeight: pathname === '/cours' ? '600' : '500'}}> 
                        Cours 
                    </li> 
                {/* </Link> */}
                <Link href={'/blog'}> 
                    <li style={{fontWeight: pathname === '/blog' ? '600' : '500'}}> 
                        Articles 
                    </li> 
                </Link>
        </ul>
    )
}