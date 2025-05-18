'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";
import { useState } from "react";

import { singleCenter, allCities } from "@/_lib/dashboard/getdata";
// import { getCitiesList } from "@/_lib/listings/test";

import Icon from "@/_lib/utils/Icon";

import AddCenter from "./addcenter";

export default function MarketingSidebar({centersList, centers, setCenters, setCenter}){
    
    const [search, setSearch] = useState('')
    const [index, setIndex] = useState('')
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState('')

    const [toggle, setToggle] = useState(false)
    const [cities, setCities] = useState([])

    function searchByname(e){
        const inputValue = e.target.value;
        
        setSearch(inputValue);
        
        const filteredValues = centersList.filter(value =>
            value.name.toLowerCase().includes(inputValue.toLowerCase())
        )
    
        setCenters(filteredValues);
    }
    
    async function getCities(){
        setIndex('')
        setLoading(true)
        setError('')

        const result = await allCities()
        setToggle(true) 
        setLoading(false)

        if(result?.error){
            setError(result.error)
        } else{
            setCities(result)
        }
    }

    async function getCenter(id){
        if(index === id) return;
        setLoading(true)
        setError('');
        setIndex(id)
        
        const result = await singleCenter(id)
        setLoading(false)
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setCenter(result)
        }
    }
    
    return(
        <div className={styles.DashContainer}>
            <div className={styles.DashFilter}>
                <div className={styles.DashSearch}>
                    
                    <div className={styles.DashSearchBar}>
                        <input type="text" value={search} placeholder="Search..." onChange={searchByname}/>
                        <span>
                            <Icon name={'Search'} color={'#616a6b'}/>
                        </span>
                    </div>

                    <div className={styles.DashSearchAction} style={{backgroundColor: toggle? '#e74c3c' : '#2980b9'}}> 
                        {toggle ? 
                            <span onClick={()=>setToggle(false)}> <Icon name={'X'} color={'white'}/> </span>
                            :
                            <span onClick={getCities}> 
                                {loading && index === ''? <div className={'spinner'}> </div>
                                    : <Icon name={'Plus'} color={'white'}/> }
                            </span>
                        }
                    </div>
                </div>
                { toggle && 
                    <AddCenter citiesList={cities} setCenters={setCenters}/>
                }
                
            </div>
            <ul className={styles.CentersList}>

                {error && <p className={'Error'}>{error}</p>}

                { centers.length !== 0 ?
                    centers.slice(0, 10).map((item, id)=> 
                        <li key={id} onClick={()=>getCenter(item.id)}> 
                            {loading && index === item.id? 
                                <div className={'spinner'}></div>:
                                <span> 
                                    {id+1 +'- '+ item.name} 
                                </span>}
                        </li>) 
                    : 
                    <p> No centers </p>
                }
            </ul>
        </div>
    )
    
}