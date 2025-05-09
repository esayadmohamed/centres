"use client"
import Link from 'next/link';
import styles from './display.module.css'

import Icon from '@/_lib/utils/Icon';

export default function DisplayBanner ({listing}){
  
    return (
        <div className={styles.DisplayBanner}>            
            <div className={styles.BannerTitle}>
                <h1> {listing?.name} </h1>
                <ul>
                    <Link href={'/'}> <li> Accueil</li> </Link> 
                    <li>/</li>
                    <Link href={'/centres'}> <li> Centres </li> </Link>
                    <li>/</li>
                    <li>{listing?.name}</li>
                </ul>
            </div>
        </div>
    )
}