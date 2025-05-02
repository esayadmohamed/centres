"use client"
import styles from "./sortby.module.css";

import Icon from "@/_lib/utils/Icon";

export default function Sortby({handleListings, sort, handleSort}){ 

    return (
        <div className={styles.Sortby}>
            <ul>
                <li onClick={()=> {handleListings('a-z'); handleSort('a-z')} } className={sort === 'a-z' ? styles.SortbyActive : styles.SortbyInactive}>
                    <Icon name={'ArrowDownAZ'}/> 
                    <p>Alphabets</p>
                </li>
                <li onClick={()=> {handleListings('rank'); handleSort('rank')} } className={sort === 'rank' ? styles.SortbyActive : styles.SortbyInactive}>
                    <Icon name={'Trophy'}/> 
                    <p>Classement</p> 
                </li>
            </ul>
        </div>
    )
}
