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
            <span className={styles.SpecsMore} style={{display: !view && description.length > 200? 'flex' : 'none'}}> 
                <Icon name={'ArrowDown'}/> Voir plus 
            </span>
        </div>
    )
}