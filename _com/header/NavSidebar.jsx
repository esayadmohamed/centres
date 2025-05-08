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
            <div className={styles.Functions} onClick={()=>setToggle(true)}>
                <Icon name={'AlignJustify'} color={'#424949'}/>
                {/* <p>Connexion</p> */}
            </div>
            

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

                <li style={{fontWeight: pathname === '/blog' ? '600' : '500'}} > 
                    {/* <Link href='/'>  */}
                    <Icon name={'Text'} /> Blog 
                    {/* </Link>  */}
                </li>
 
                {!isAuthenticated? 
                    <>
                        <li style={{fontWeight: pathname === '/login' ? '600' : '500'}} > 
                            <Link href='/auth'> <Icon name={'User'} /> Connexion </Link> 
                        </li>
                        <li style={{fontWeight: pathname === '/signup' ? '600' : '500'}} > 
                            <Link href='/auth/signup'> <Icon name={'UserPlus'} /> Créer un compte </Link> 
                        </li>
                    </>
                    :
                    <>
                        <li style={{fontWeight: pathname === '/listings' ? '600' : '500'}} > 
                            <Link href='/listings'> <Icon name={'LayoutList'} /> Mes centres </Link> 
                        </li>
                        <li style={{fontWeight: pathname === '/tutring' ? '600' : '500'}} > 
                            {/* <Link href='/courses'>  */}
                            <Icon name={'GraduationCap'} /> Mes cours 
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
                        support@centres.ma 
                    </li> 
            </ul>
        </>
    )
}