"use client"

import Link from "next/link"
import styles from "./style.module.css"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

import Icon from "@/_lib/utils/Icon"

export default function NavSidebar ({isAuthenticated, toggle, setToggle}){

    const pathname = usePathname();

    // const [toggle, setToggle] = useState(false)

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
        const isLeftSwipe = distance > minSwipeDistance;
        // const isRightSwipe = distance < -minSwipeDistance;
    
        if (isLeftSwipe) setToggle(false)
    };


    return(
        <>
            {toggle && 
                <div className={styles.Overlay} onClick={()=>setToggle(false)}> 
                </div>
            }

            <ul className={`${styles.NavSidebar} ${toggle ? styles.NavSidebarVisible : ''}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                > 
                <div className={styles.SidebarHeader} >
                    <Link href='/'> <p> <Icon name={'Navigation2'} color={'#1f618d'}/> Centres </p> </Link>
                    <span onClick={()=>setToggle(false)}> <Icon name={'CircleX'} color={'#e74c3c'}/> </span>
                </div>
                
                <li style={{fontWeight: pathname === '/' ? '600' : '500'}} > 
                    <Link href='/'> <Icon name={'House'} /> Centres </Link> 
                </li>

                {/* <li style={{fontWeight: pathname === '/blog' ? '600' : '500', color: '#515a5a'}} > 
                    <Icon name={'Text'} color={'#515a5a'}/> Blog 
                </li> */}
 
                {!isAuthenticated? 
                    <>
                        <li style={{fontWeight: pathname === '/login' ? '600' : '500'}} > 
                            <Link href='/auth'> <Icon name={'User'} /> Se connecter </Link> 
                        </li>
                        <li style={{fontWeight: pathname === '/signup' ? '600' : '500'}} > 
                            <Link href='/auth/signup'> <Icon name={'UserPlus'} /> Créer un compte </Link> 
                        </li>
                    </>
                    :
                    <>
                        <li style={{fontWeight: pathname === '/listings' ? '600' : '500'}} > 
                            <Link href='/listings'> <Icon name={'LayoutList'} /> Mes centres de soutien</Link> 
                        </li>
                        <li style={{fontWeight: pathname === '/tutring' ? '600' : '500', color:'#515a5a'}} > 
                            {/* <Link href='/courses'>  */}
                            <Icon name={'GraduationCap'} color={'#515a5a'}/> Mes cours particuliers
                            {/* </Link>  */}
                        </li>
                        <li style={{fontWeight: pathname === '/account' ? '600' : '500'}} > 
                            <Link href='/account'> <Icon name={'User'} /> Mon compte </Link> 
                        </li>
                        
                        <li onClick={()=>signOut({ callbackUrl: "/" })}> 
                            <Icon name={'LogOut'} /> Deconnexion
                        </li>
                    </>
                } 
                    <li className={styles.SidebarSupport}> 
                        <Icon name={'Headset'} color={'#424949'}/> 
                        contact@centres.ma
                    </li> 
            </ul>
        </>
    )
}