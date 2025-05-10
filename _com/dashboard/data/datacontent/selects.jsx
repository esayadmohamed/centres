'use client';
import styles from "../../dash.module.css";
import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

// import { EditSpecsData, AddSpecsData, RemoveSpecsData } from "@/lib/dashboard/editdata";
import { EditSelects, AddSelects, RemoveSelects } from "@/_lib/dashboard/editdata";

export default function DataSelects({content, setContent, title}){

    const [index, setIndex] = useState(null) 
    const [toggle, setToggle] = useState(false) 
    const [add, setAdd] = useState(false) 
    const [ok, setOk] = useState(false) 
    
    function handleToggle(id){
        setToggle(!toggle)
        setIndex(id)
        setAdd(false)
    }

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('') 
    const [icon, setIcon] = useState('') 
    
    async function handleSpecs(id){
        setLoading(true); 
        setError('');

        const obj = { id: id, name: name, icon: icon}

        const result = await EditSelects(obj, title.table)
        setLoading(false);

        if(result?.error){
            setError(result.error)
        }else{
            setContent(result)
            setToggle(false)
            setName(''); 
            setIcon('');
        }
        
    }

    async function AddSpecs(){
        setLoading(true); 
        setError('');

        const obj = {name: name, icon: icon}

        const result = await AddSelects(obj, title.table)
        setLoading(false);

        if(result?.error){
            setError(result.error)
        }else{            
            setContent(result)
            setAdd(false)
            setName(''); 
            setIcon('');
        }

    }

    async function RemoveSpecs(id){
        setLoading(true); 
        setError('');

        const result = await RemoveSelects(id, title.table)
        setLoading(false);

        if(result?.error){
            setError(result.error)
        }else{
            setContent(result)
            setToggle(false)
            setName(''); 
            setIcon('');
        }
    }

    return(
        <div className={styles.DevContent}>
            <h3> {title.name} ({content.length})
                <span onClick={()=>{setAdd(true); setToggle(false)}}> <Icon name={'CirclePlus'}/> </span>
            </h3>
            <ul>
            {add &&
                <li> 
                    <div className={styles.DevContentActions}>
                        <span className={styles.DataInputs}>
                            <input type="text" placeholder="Icon" onChange={(e)=>setIcon(e.target.value)}/>
                            <input type="text" placeholder="Value" onChange={(e)=>setName(e.target.value)}/>
                        </span>
                        {error && <p className={'Error'}> {error} </p>}
                        <div className={styles.DataActionsButtons}>
                            <button onClick={AddSpecs}>
                                {loading? 
                                    <div className={'spinner'}></div>  : 
                                    <span><Icon name={'Check'} color={'white'}/>  Submit</span> 
                                } 
                            </button>                                
                            <button onClick={()=>setAdd(false)}> <Icon name={'X'} color={'white'}/> Cancel  </button>
                        </div>
                    </div>
                </li>
            }

            {content.map((item, id)=> 
                <li key={id}> 
                    {(toggle && index === id)?
                        <div className={styles.DevContentActions}>
                            <p>
                                <Icon name={item.icon}/> {item.name}  
                            </p>
                            <div className={styles.DataInputs}>
                                <input type="text" placeholder="Icon" onChange={(e)=>setIcon(e.target.value)}/>
                                <input type="text" placeholder="New value" onChange={(e)=>setName(e.target.value)}/>
                            </div>
                            {error && <p className={'Error'}> {error} </p>}
                            <div className={styles.DataActionsButtons}>
                                {!ok? <>
                                    <button onClick={()=>handleSpecs(item.id)}>  
                                        {loading? 
                                            <div className={'spinner'}></div>  : 
                                            <span><Icon name={'Check'} color={'white'}/> Submit</span> 
                                        } 
                                    </button>
                                    <button onClick={()=>setOk(true)}> <Icon name={'Minus'} color={'white'}/> Remove </button>
                                    <button onClick={()=>setToggle(false)}> <Icon name={'X'} color={'white'}/> Cancel </button>
                                </> :
                                <>
                                    <button onClick={()=>RemoveSpecs(item.id)}>  
                                        {loading? 
                                            <div className={'spinner'}></div>  : 
                                            <span><Icon name={'Minus'} color={'white'}/>  Remove</span> 
                                        } 
                                    </button>
                                    <button onClick={()=>{setToggle(false); setOk(false)}}> <Icon name={'X'} color={'white'}/> Cancel </button>
                                </> }
                            </div>
                        </div>
                        :
                        <div className={styles.DevContentInfo}  onClick={()=>handleToggle(id)}>
                                <Icon name={item.icon} /> {item.name}  
                        </div>
                    }
                </li>
            )}
            </ul>
        </div>
    )
}