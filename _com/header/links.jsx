"use client"
import styles from "./style.module.css"

import Link from "next/link"
import { usePathname } from "next/navigation"


export default function NavLinks ({auth}){

    const pathname = usePathname();    

    return(
        <ul className={styles.NavLinks}>
            {auth?
                <>
                <Link href={'/centres'}> 
                    <li style={{fontWeight: pathname === '/centres' ? '600' : '500'}}> 
                        Centres 
                    </li> 
                </Link>
                    <li style={{fontWeight: pathname === '/cours' ? '600' : '500'}}> 
                        Cours 
                    </li> 
                <Link href={'/blog'}> 
                    <li style={{fontWeight: pathname === '/blog' ? '600' : '500'}}> 
                        Articles 
                    </li> 
                </Link>
                <Link href={'/account'}> 
                    <li style={{fontWeight: pathname === '/blog' ? '600' : '500'}}> 
                        Compte 
                    </li> 
                </Link>
                <Link href={'/listings'}> 
                    <li style={{fontWeight: pathname === '/blog' ? '600' : '500'}}> 
                        Annonces 
                    </li> 
                </Link>
                </>
                :
                <>
                    <Link href={'/centres'}> 
                        <li style={{fontWeight: pathname === '/centres' ? '600' : '500'}}> 
                            Centres 
                        </li> 
                    </Link>
                        <li style={{fontWeight: pathname === '/cours' ? '600' : '500'}}> 
                            Cours 
                        </li> 
                    <Link href={'/blog'}> 
                        <li style={{fontWeight: pathname === '/blog' ? '600' : '500'}}> 
                            Articles 
                        </li> 
                    </Link>
                </>
            }
        </ul>
    )
}