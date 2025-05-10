'use client';
import styles from "../../dash.module.css";
import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

import { ApproveHood, RejectHood } from "@/_lib/dashboard/editdata";

export default function DataHoods({content, title}){

    const [suggestedHoods, setSuggestedHoods] = useState(content || [])

    const [index, setIndex] = useState(null) 
    const [toggle, setToggle] = useState(false) 
    const [ok, setOk] = useState(false) 
    
    function handleToggle(id){
        setToggle(!toggle)
        setIndex(id)
    }

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('') 
    
    async function handleApprove(item){
        setLoading(true); 
        setError('');

        const obj = { 
            id: item.id,
            name: name,
            listing_id: item.listing_id, 
            city: item.city
        }

        const result = await ApproveHood(obj)
        setLoading(false);
        
        if(result?.error){
            setError(result.error)
        }else{
            setSuggestedHoods(result);
            setToggle(false)
            setName('');
        } 
    }

    async function handleRemove(id){
        setLoading(true); 
        setError('');

        const result = await RejectHood(id)
        setLoading(false);

        if(result?.error){
            setError(result.error)
        }else{
            setSuggestedHoods(result);
            setToggle(false)
            setName('');
        }
    }

    return(
        <div className={styles.DataContent}>
            
            <h3> 
                {title.name} 
                <span>({suggestedHoods.length})</span>
            </h3>

            <ul>
                {suggestedHoods.map((item, id)=> 
                    <li key={id}> 
                        {toggle && index === id?
                            <div className={styles.DeataHoodActions}>
                                
                                <p> {item.name}, {item.city}  </p>
                                
                                <span className={styles.HoodInputs}>
                                    <input type="text" placeholder="New Hood" onChange={(e)=>setName(e.target.value)}/>
                                </span>

                                {error && <p className={'Error'}> {error} </p>}
                                <div className={styles.HoodActionsButtons}>
                                    {!ok? <>
                                        <button onClick={()=>handleApprove(item)}> 
                                            {loading ?  <div className={'spinner'}></div>
                                                : <span> <Icon name={'Check'} color={'white'}/> Submit </span>}
                                        </button>
                                        <button onClick={()=>setOk(true)}> <Icon name={'Minus'} color={'white'} /> Remove </button>
                                        <button onClick={()=>setToggle(false)}> <Icon name={'X'} color={'white'} /> Cancel </button>
                                    </> :
                                    <>
                                        <button onClick={()=>handleRemove(item.id)}> 
                                            {loading ?  <div className={'spinner'}></div>
                                                    : <span> <Icon name={'Minus'} color={'white'} /> Remove </span>}
                                        </button>
                                        <button onClick={()=>{setToggle(false); setOk(false)}}> <Icon name={'X'} color={'white'} /> Cancel </button>
                                    </> }
                                </div>
                            </div>
                            :
                            <div className={styles.DataContentInfo}  onClick={()=>handleToggle(id)}>
                                {item.name}, {item.city} 
                                <p>User Id: {item.user_id}</p>
                            </div>
                        }
                    </li>
                )}
            </ul>
        </div>
    )
}