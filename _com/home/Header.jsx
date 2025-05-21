'use client';
import Link from "next/link";
import styles from "./css/header.module.css";

import Icon from "@/_lib/utils/Icon";
import { useState } from "react";

import display from '@/public/images/display.png'

export default function LandingHeader({handleEmail}) {
    
    const [toggle, setToggle] = useState(false)
    const [email, setEmail] = useState('')

    return (
        <div className={styles.PageHeader}>
            <div className={styles.PageHeaderBar}>
                <div className={styles.BarLogo}>
                    <p> 
                        <span onClick={()=>setToggle(true)} className={styles.BarToggle}> 
                            <Icon name={'Menu'} color={'#424949'}/> 
                        </span>
                        <span> <Icon name={'Navigation2'} color={'#2471a3'}/>  </span>
                    </p>
                    <p>Centres</p>
                </div>
                <ul>
                    <Link href={'/'}> <li>Centres de soutien</li> </Link>
                    <li>Cours Particuliers</li>
                    <Link href={'/blog'}> <li>Articles</li> </Link>
                </ul>
                <p className={styles.BarSignup} onClick={()=>handleEmail(email)}>
                    Cree un compte
                    {/* <Icon name={'SquarePlus'} color={'white'}/> */}
                    {/* <p>Publier</p> */}
                </p>

            </div>
            <div className={styles.PageHeaderSlider}>
                <div className={styles.SliderText}>
                    <p>Bienvenue sur Centres!</p>
                    <h2>Touchez une audience locale</h2>
                    <p>🚀 Boostez la visibilité de votre centre gratuitement. Rejoignez dès maintenant, la plateforme leader pour la découverte des centres de soutiens au Maroc.</p>
                    <div>
                        <input type="text" placeholder="Email..."
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            />
                        <span onClick={()=>handleEmail(email)}> 
                            <Icon name={'Send'} color={'white'}/>
                        </span>
                    </div>
                    <p>✅ Inscription facile et rapide</p>
                </div>
                <div className={styles.SliderImage} style={{backgroundImage: `url(${display.src})`}}>
                </div>
                
                {toggle && 
                    <>
                    <div className={styles.Layout} onClick={()=>setToggle(false)}>
                    </div>
                    <div className={styles.Sidebar}>
                        <div className={styles.SidebarHeader}>
                            <p>
                                <Icon name={'Navigation2'} color={'#2471a3'}/>
                                CENTRES
                            </p>
                            <span onClick={()=>setToggle(false)}> <Icon name={'CircleX'} color={'#e74c3c'}/> </span>
                        </div>
                        <ul>
                            <Link href={'/'}> <li>Centres de soutien</li> </Link>
                            <Link href={'/cours'}> <li>Cours Particuliers</li> </Link>
                            <Link href={'/blog'}> <li>Articles</li> </Link>
                        </ul>
                        <div className={styles.SidebarFooter}>
                            <Icon name={'Headset'} color={'#424949'}/>
                            contact@centres.ma
                        </div>
                    </div> 
                    </>
                }
            </div>
        </div>
    )

}

