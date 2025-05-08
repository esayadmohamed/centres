"use client"

import Image from "next/image"
import Link from "next/link"
import styles from './headers.module.css'

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import logo from '@/public/logo.png'
import SearchBar from "./publicheader/SearchBar"
// import UserDrop from "./publicheader/UserDrop"
import UserForm from "./authentication/UserForm"

import { Menu, CircleUserRound, Search, UserRoundPlus} from "lucide-react";

export default function PublicHeader({session}) {

    const pathname = usePathname();

    const [UserClick, setUserClick] = useState(false);

    const [scrolling, setScrolling] = useState(false);

    const [openUser, setOpenUser] = useState(false);
    const [openForm, setOpenForm] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };
  
        window.addEventListener("scroll", handleScroll);
      
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    function handleOpenForm(item){      
        setOpenForm(item)
        setOpenUser(true)
        setUserClick(false)
      // document.body.style.overflow = openUser ?  "hidden" : ""
    }

    return (
        <header className={styles.Nav} style={{height: !scrolling && '180px'}}>
            <div className={styles.Navbar}>
                <div className={styles.Logo}> 
                    <Link href={'/'}>
                        <Image src={logo} alt="Logo" width={200} height={200}/>
                        <p>
                            <span>Centre</span>
                            <span>de soutien</span>
                        </p>
                    </Link>
                </div>
                
                {/* <ul className={styles.NavLinks} >
                    <li> <Link href='/'> Découvrir </Link> </li>
                    <li> <Link href='/account'> Mon Compte </Link> </li>
                    {scrolling && <span onClick={()=>setScrolling(false)}><Search /></span> }
                </ul> */}

                <ul className={styles.NavLinks} >
                    <li className={pathname === '/' ? styles.ActiveLink : styles.InactiveLink}> 
                      <Link href='/'> Découvrir </Link> 
                    </li>

                    {!session && <><li className={pathname === '/listings' ? styles.ActiveLink : styles.InactiveLink}> 
                      <Link href='/listings'> Mes Annonces </Link> 
                    </li>
                    
                    <li className={pathname === '/account' ? styles.ActiveLink : styles.InactiveLink}> 
                      <Link href='/account'> Mon Compte </Link> 
                    </li> </>}
                    {scrolling && <span onClick={()=>setScrolling(false)}><Search /></span> }
                </ul>
                
                {!session ?
                    <div className={styles.Functions} >
                        <button onClick={()=> handleOpenForm('login')}> Se connecter </button>
                        <button onClick={()=> handleOpenForm('signup')}> <UserRoundPlus /> S'inscrire </button>
                    </div>
                    :
                    <div className={styles.Functions} >
                    <button onClick={()=>signOut()}> Déconnexion </button>
                </div> 
                }

                { openUser && <UserForm closeUser={()=> setOpenUser(false)} openForm={openForm}/> }
            </div>
            {!scrolling && <SearchBar />}
            
        </header>
    )
}
