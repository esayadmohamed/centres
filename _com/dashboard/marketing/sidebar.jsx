'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";
import { useState } from "react";

import { singleCenter } from "@/_lib/dashboard/getdata";

import Icon from "@/_lib/utils/Icon";

import AddCenter from "./addcenter";

export default function MarketingSidebar({centersList, citiesList, centers, setCenters, setCenter}){
    
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

            <div className={styles.CentersList}>
                    
                    <AddCenter setCenters={setCenters} setCenter={setCenter} citiesList={citiesList}/>

                    <div className={styles.DashSearch}>
                        <div className={styles.DashSearchBar}>
                            <input type="text" value={search} placeholder="Search..." onChange={searchByname}/>
                            {search === ''?
                                <span> <Icon name={'Search'} color={'#616a6b'}/> </span>
                                :
                                <span onClick={()=>setSearch('')}> <Icon name={'X'} color={'#616a6b'}/> </span>
                            }
                        </div>
                    </div>
                
                <p className={styles.CentersListHeader}> 
                    {centers.length} Centres
                </p>

                {error && <p className={'Error'}>{error}</p>}
                
                <ul className={styles.CentersListContent}>
                {centers.length !== 0 &&
                    centers.map((item, id)=> 
                        <li key={id} onClick={()=>getCenter(item.id)}> 
                            {loading && index === item.id? 
                                <div className={'spinner'}></div>:
                                <p> 
                                    <span style={{background: '#f2f3f4'}}> 
                                        <Icon name={item.status === 1 ? 'Check' : 'X'} 
                                            color={item.status === 1 ? '#28b463' : '#e74c3c'} /> 
                                    </span>
                                    {item.name}  
                                </p>}
                                <p>  
                                    {item.facebook !== '' && 
                                        <span style={{background: '#d6eaf8'}}> <Icon name={'Mail'} color={'#1b4f72'}/> </span>}
                                    {item.instagram !== '' && 
                                        <span style={{background: '#d5f5e3'}}> <Icon name={'Phone'} color={'#186a3b'}/> </span>}
                                    {item.whatsapp !== '' && 
                                        <span style={{background: '#d5f5e3'}}> <Icon name={'Phone'} color={'#186a3b'}/> </span>}
                                </p>
                        </li>) 
                    }
                </ul>
            </div>
        </div>
    )
    
}






{/* <div className={styles.DashFilter}>
    <div className={styles.DashSearch}>
        
        <div className={styles.DashSearchBar}>
            <input type="text" value={search} placeholder="Search..." onChange={searchByname}/>
            {search === ''?
                <span> <Icon name={'Search'} color={'#616a6b'}/> </span>
                :
                <span onClick={()=>setSearch('')}> <Icon name={'X'} color={'#616a6b'}/> </span>
            }
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
        <AddCenter citiesList={cities} setCenters={setCenters} setCenter={setCenter}/>
    }
    
</div> */}