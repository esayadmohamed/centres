import styles from './style.module.css'
import { useState } from 'react';

import Icon from '@/_lib/utils/Icon';

export default function SpecBox({name, data}){
        
    const [view, setView] = useState(false)

    return (
        <div className={styles.SpecsBox} onClick={()=>setView(!view)}>
            <h4>{name}</h4>
            <ul>
                {data.slice(0, view ? data.length : 5).map((item, id)=>
                    <li key={id}>
                        <Icon name={item.icon} /> 
                        {item.name}
                    </li>
                )}
            </ul>
            <div className={styles.SeeMore} style={{display: !view && data.length > 5? 'flex' : 'none'}}>
                <span> <Icon name={'ChevronDown'} color={'black'}/> </span>
                <p> Voir plus </p>
            </div>
        </div>
    );
}