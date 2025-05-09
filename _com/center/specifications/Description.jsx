'use client'
import styles from './style.module.css'

import { useState } from 'react'
import Icon from '@/_lib/utils/Icon';

export default function SpecsDescription ({description}){

    const [view, setView] = useState(false);

    return (
        <div className={styles.SpecsBox} onClick={()=>setView(!view)}>
            <h4>Description</h4>
            <p> 
                {description.slice(0, view ? description.length : 200)}
                {!view && '...' }
            </p>
            <div className={styles.SeeMore} style={{display: !view && description.length > 200? 'flex' : 'none'}}>
                <span> <Icon name={'ChevronDown'} color={'black'}/> </span>
                <p> Voir plus </p>
            </div>
        </div>
    )
}