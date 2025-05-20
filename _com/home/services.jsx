'use client';
import Link from "next/link";
import styles from "./css/services.module.css";

import Icon from "@/_lib/utils/Icon";

export default function LandingServices() {
    
    return (
        <ul className={styles.BodyServices}>
            <li> 
                <span> <Icon name={'Users'} color={'#424949'}/> </span>
                <p> Audience locale </p>
            </li>
            <li> 
                <span> <Icon name={'Search'} color={'#424949'}/> </span>
                <p> Visibilité ciblée </p>
            </li>
            <li> 
                <span> <Icon name={'Tag'} color={'#424949'}/> </span>
                <p> Services gratuite </p>
            </li>
            <li> 
                <span> <Icon name={'Headset'} color={'#424949'}/> </span>
                <p> Support 24/7 </p>
            </li>
        </ul>
    )

}

