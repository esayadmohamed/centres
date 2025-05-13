'use client';
import styles from "../dash.module.css";
import { useState } from "react";

import Icon from "@/_lib/utils/Icon";
import { getDashData } from "@/_lib/dashboard/getdata";

export default function DashSidebar({handleContent}){

    const list = [
        {name: 'Offers', icon: 'Minus', table: "offerslist"},
        {name: 'Services', icon: 'Minus', table: "serviceslist"},
        {name: 'Subjects', icon: 'Minus', table: "subjectslist"},
        {name: 'Levels', icon: 'Minus', table: "levelslist"},

        {name: 'Locations', icon: 'Minus', table: "cities"},

        {name: 'Suggested Hoods', icon: 'Minus', table: "suggestedhoods"},
        {name: 'Tokens', icon: 'Minus', table: "tokens"}
    ]

    const [index, setIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function getData(id, table){
        setIndex(id);
        setLoading(true);
        setError('');

        const result = await await getDashData(table)
        setLoading(false)
        // console.log(result);
        
        if(result.error){
            setError(result.error)
        }else{
            handleContent(result, list[id])
        }
    }

    return(
        <div className={styles.DevSidebar}>
            <ul>
                {list.map((item, id)=> 
                    <li key={id} onClick={()=>getData(id, item.table)} className={index === id ? styles.ActiveSelect : styles.InctiveSelect}> 
                        {loading && index === id ? <div className={'spinner'}></div> : 
                            <p> <Icon name={`${item.icon}`} color={'#424949'}/> {item.name} </p>
                            }  
                    </li> 
                )}
            </ul>
        </div>
    )
    
}


