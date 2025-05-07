"use client"
import Link from 'next/link'
import styles from './footer.module.css'
import Icon from '@/_lib/utils/Icon'

export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.Footer} >
            <div>
                <ul>
                    <Link href={'/'}> <li>Centres</li> </Link>
                    <li> | </li>
                    <Link href={'/'}> <li>Blog</li> </Link>
                    <li> | </li>
                    <Link href={'/support'}> <li>Support</li> </Link>
                </ul>
                <p>@ 2025-{currentYear}, Tous droits reserves</p>
            </div>
            <span onClick={()=>window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Icon name={'ChevronUp'}/> 
            </span>
        </footer>
    )
}
