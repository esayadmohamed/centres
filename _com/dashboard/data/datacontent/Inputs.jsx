'use client';
import styles from "../../dash.module.css";
import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

// import { getDashHoods } from "@/lib/dashboard/getdata";
// import { AddCity, RemoveCity, AddHood, RemoveHood } from "@/lib/dashboard/editdata";
import { getDashHoods } from "@/_lib/dashboard/getdata";
import { AddCity, AddHood, RemoveHood, RemoveCity } from "@/_lib/dashboard/editdata";

export default function DataInputs({content, title}){

    const [cities, setCities]= useState(content || [])
    const [hoods, setHoods] = useState([])
    
    const [cityIndex, setCityIndex] = useState(null)
    const [hoodIndex, setHoodIndex] = useState(null)

    const [hoodLoading, setHoodLoading] = useState(false)
    const [addCityLoading, setAddCityLoading] = useState(false)
    const [removeCityLoading, setRemoveCityLoading] = useState(false)
    const [addHoodLoading, setAddLoading] = useState(false)
    const [removeHoodLoading, setRemoveHoodLoading] = useState(false)
    
    const [error, setError] = useState(null)
    const [okCity, setOkCity] = useState(null)
    const [okHood, setOkHood] = useState(null)

    const [city, setCity] = useState('')
    const [hood, setHood] = useState('')

    async function GetHoods(id){
        setHoodLoading(true);
        setError(null);
        setCityIndex(id);
        setHoods([]);
        setHoodIndex(null)

        const result = await getDashHoods(id)
        setHoodLoading(false)
        
        if(result.error){
            setError(result.error)
        }else{
            setHoods(result)
        }
    } //done

    async function HandleAddCity(){
        if(city === '') return

        setAddCityLoading(true);
        setError(null);
        setHoods([]);
        setCityIndex(null);

        const result = await AddCity(city)
        setAddCityLoading(false)
        
        if(result.error){
            setError(result.error)
        }else{
            setCity('');
            setCities(result)
        }
    } //done

    async function HandleAddHood(){
        if(hood === '') return

        setAddLoading(true);
        setError(null);

        const result = await AddHood(hood, cityIndex)
        setAddLoading(false)
        
        if(result.error){
            setError(result.error)
        }else{
            setCity(''); setHood('');
            setHoods(result)
        }
    } //done

    async function HandleRemoveHood(item){
        setRemoveHoodLoading(true);
        setError(null);
        setCity(''); setHood('');

        const result = await RemoveHood(cityIndex, item.name)
        setRemoveHoodLoading(false)
        
        if(result.error){
            setError(result.error)
        }else{
            setHoods(result)
            setOkCity(false)
        }
    } //done

    async function HandleRemoveCity(){
        setRemoveCityLoading(true);
        setError(null);
        setCity('');

        const result = await RemoveCity(cityIndex)
        setRemoveCityLoading(false)
        
        if(result.error){
            setError(result.error)
        }else{
            setCities(result)
            setHoods([]);
            setCityIndex(null);
            setOkHood(false)
        }
    } //done

    return(
        <div className={styles.DevContentLocation}>
        
            <h3> {title.name} <span>({cities.length})</span> </h3>

            <div className={styles.DevLocation}>
                <ul className={styles.DataCities}>
                    <div> 
                        <div className={styles.LocationAdd}>
                            <input type="text" placeholder="Add city" value={city} onChange={(e)=>setCity(e.target.value)}/>
                            <span onClick={HandleAddCity}>  
                                {addCityLoading ?  <div className={'spinner'}></div> :<Icon name={'CirclePlus'} color={'#424949'}/> } 
                            </span>  
                        </div> 
                    </div> 
                    
                    {error && <p className={styles.DataError}> {error} </p>} 

                    {cities.map((item, id)=> 
                        <li key={id} onClick={()=>GetHoods(item.id)} style={{fontWeight: cityIndex == item.id? '600' : '500'}}>
                                {item.name} 
                                {(hoodLoading && cityIndex == item.id) &&
                                    <div className={styles.spinner}></div>
                                }
                        </li>)
                    }
                </ul>
                
                {cityIndex && <ul>
                    <li style={{borderBottom: 'none'}}>
                        {cities.filter((item) => item.id === cityIndex)[0]?.name}
                        <div className={styles.LocationRemove} > 
                            {okCity? 
                                removeCityLoading?
                                    <div className={styles.spinner}></div>
                                    :
                                    <p className={styles.RemoveConfirmation}> 
                                        <span onClick={HandleRemoveCity}> <Icon name={'Check'} color={'red'}/> </span>
                                        <span onClick={()=>setOkCity(false)}> <Icon name={'X'} color={'#2e86c1'}/> </span>
                                    </p> 
                                : 
                                <p onClick={()=>setOkCity(true)}> <Icon name={'Minus'} color={'red'}/> </p> 
                            }
                        </div> 
                    </li>
                    <div className={styles.LocationAdd}>
                        <input type="text" placeholder="Add hood" value={hood} onChange={(e)=>setHood(e.target.value)}/>
                        <span onClick={HandleAddHood}>  
                            {addHoodLoading ?  <div className={'spinner'}></div> :<Icon name={'CirclePlus'} color={'#424949'}/> } 
                        </span> 
                    </div> 
                    {hoods.map((item, id)=> 
                        <li key={id} >
                                {item.name} 
                                <div className={styles.LocationRemove}>
                                    {okHood && item.id === hoodIndex? 
                                        removeHoodLoading?
                                            <div className={styles.spinner}></div>
                                            :
                                            <p className={styles.RemoveConfirmation}> 
                                                <span onClick={()=>HandleRemoveHood(item)}> <Icon name={'Check'} color={'red'}/> </span>
                                                <span onClick={()=>{setOkHood(false); setHoodIndex(null)}}> <Icon name={'X'} color={'#2e86c1'}/> </span>
                                            </p> 
                                        : 
                                        <p onClick={()=>{setOkHood(true); setHoodIndex(item.id)}}> <Icon name={'Minus'} color={'red'}/> </p> 
                                    }
                                </div> 
                        </li>)
                    }
                </ul> }
            </div>
        </div>
    )
}