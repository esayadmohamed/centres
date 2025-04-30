"use client"

import Link from "next/link"
import styles from "./style.module.css"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

import Icon from "@/_lib/utils/Icon"

export default function NavSidebar ({isAuthenticated}){

    const pathname = usePathname();

    const [toggle, setToggle] = useState(false)

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null); 
        setTouchStart(e.targetTouches[0].clientX);        
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {        
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        // const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
    
        if (isRightSwipe ) setToggle(false)
    };


    return(
        <>
        {!toggle ? 
            <div className={styles.Functions} onClick={()=>setToggle(true)}>
                <Icon name={'AlignJustify'} />
            </div>
            :
            <>
            <div className={styles.Overlay} onClick={()=>setToggle(false)}> 
            </div>

            <ul className={styles.NavSidebar}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                > 
                <div className={styles.SidebarHeader} >
                    <Link href='/'> <p> <Icon name={'Component'}/> Centres </p> </Link>
                    <span onClick={()=>setToggle(false)}> <Icon name={'CircleX'}/> </span>
                </div>
                {!isAuthenticated? 
                    <>
                        <li style={{fontWeight: pathname === '/login' ? '600' : '500'}} > 
                            <Link href='/auth'> Connexion </Link> 
                        </li>
                        <li style={{fontWeight: pathname === '/signup' ? '600' : '500'}} > 
                            <Link href='/auth/signup'> Créer un compte </Link> 
                        </li>
                        <li style={{fontWeight: pathname === '/support' ? '600' : '500'}} > 
                            <Link href='/'> Support </Link> 
                        </li>
                    </>
                    :
                    <>
                        <li style={{fontWeight: pathname === '/listings' ? '600' : '500'}} > 
                            <Link href='/listings'> Mes annonces </Link> 
                        </li>
                        <li style={{fontWeight: pathname === '/account' ? '600' : '500'}} > 
                            <Link href='/account'> Mon compte </Link> 
                        </li>
                        
                        <li onClick={()=>signOut({ callbackUrl: "/" })}> 
                            Deconnexion
                        </li>
                    </>
                } 
            </ul>
            </>
        }
        </>
    )
}