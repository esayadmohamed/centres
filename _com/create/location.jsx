"use client"
import styles from './create.module.css'
import { useState } from "react"

import Icon from "@/_lib/utils/Icon";

export default function CreateLocation ({errors, citiesList, hoodsList, selectedCity, selectedHood, setSelectedCity, setSelectedHood}){

    const [viewCities, setViewCities] = useState(false)
    const [viewHoods, setViewHoods] = useState(false)

    const [city, setCity] = useState('');
    const [hood, setHood] = useState('');

    const [cities, setCities] = useState(citiesList || []);
    const [hoods, setHoods] = useState([]);
    
    // console.log(errors);
    
    function filterCities(e){
        const inputValue = e.target.value;
        setCity(inputValue);
        const filteredCities = citiesList.filter(city =>
            city.name.toLowerCase().includes(inputValue.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name));
        setCities(filteredCities);
    }

    function handleCitySelect(city) {
        setCity(city.name);
        setSelectedCity(city.name);
        const filteredHoods = hoodsList.filter(item => item.city_id === city.id);
        setHoods(filteredHoods);
        setSelectedHood('')
    }
    
    function filterHoods(e){
        const inputValue = e.target.value;
        setHood(inputValue)
        const filteredHoods = hoodsList.filter(hood =>
            hood.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            hood.city_id === citiesList.find(city => city.name === selectedCity)?.id
        );
        setHoods(filteredHoods);
    }

    function handleHoodSelect(hood) {
        setSelectedHood(hood.name);
    }

    function handleHoodFocus(){
        const isValidCity = citiesList.map((item)=> item.name).includes(selectedCity);
        if(selectedCity === '' || !isValidCity) {
            setHoods([]);
            setSelectedHood('')
        }
        setViewHoods(true)
    }

    function handleCleanup(){
        setCities(citiesList || [])
        setCity('');
        setHood('');
        setSelectedCity('');
        setSelectedHood('');
    }

    return (
        <div className={styles.CreateInput}>
            <label htmlFor="location"> Emplacement </label> 
            
            <div className={styles.SearchBar}>
                {selectedCity === '' ? 
                    <div className={styles.SearchInput}>
                        <div onBlur={()=> {setTimeout(() => {setViewCities(false) }, 150)}} >
                            <input 
                                type="text" id="location" placeholder="Choisir Ville" autoComplete="off"
                                value={city}
                                onChange={filterCities}
                                onFocus={()=>setViewCities(true)}
                            />
                            {!viewCities && 
                                <ul className={styles.Dropdown}>
                                    {(cities).map((item, id)=> 
                                        <li key={id} onClick={()=>handleCitySelect(item)}> {item.name} </li>
                                    )}   
                                    {cities.length === 0 && <li className={styles.EditDropError}> Aucune ville... </li>}            
                                </ul>
                            }
                        </div>
                    </div>
                    :
                    <div className={styles.SearchInput} >
                        { !viewHoods && <p className={styles.SearchSelections} onClick={handleCleanup}>
                            <span> {selectedCity}{selectedHood && ', '+ selectedHood} <Icon name={'X'} /> </span>
                        </p>}
                        {selectedHood === '' &&                   
                        <div onBlur={()=> {setTimeout(() => { setViewHoods(false) }, 150)}}>
                            <input 
                                type="text" placeholder="Choisir Quartier"  autoComplete="off"
                                value={hood}
                                onChange={filterHoods}
                                onFocus={handleHoodFocus}
                            />
                            {viewHoods && 
                                <ul className={styles.Dropdown}>
                                    {(hoods).map((item, id)=> 
                                        <li key={id} onClick={ ()=>handleHoodSelect(item)}> {item.name} </li>
                                    )}   
                                    {hoods.length === 0 && <li className={styles.EditDropError}> Aucun Quartier... </li>}            
                                </ul>
                            }
                        </div>}
                    </div>
                }  
            </div>
            {errors?.location && <p className={styles.PageError}> {errors.location}</p> }
        </div>
    )
}
















// 'use client';
// import styles from './create.module.css';
// import { useState } from 'react';


// export default function InputLocation ({errors, citiesList, hoodsList, setCity, setHood}) {

//     const [cities, setCities] = useState(() => (citiesList || []));
//     const [selectedCity, setSelectedCity] = useState('') 
//     const [viewCities, setViewCities] = useState(false)

//     function filterCities(e){
//         const inputValue = e.target.value;
//         setSelectedCity(inputValue);
//         const filteredCities = citiesList.filter(city =>
//             city.name.toLowerCase().includes(inputValue.toLowerCase())
//         ).sort((a, b) => a.name.localeCompare(b.name));
//         setCities(filteredCities);
//     }

//     const [hoods, setHoods] = useState([]);
//     const [filteredHoods, setfilteredHoods] = useState([]);
//     const [SelectedHood, setSelectedHood] = useState('') 
//     const [viewHoods, setViewHoods] = useState(false)

//     function handleSelect(city){
//         setCity(city.name); setHood("")
//         setSelectedCity(city.name);
//         const newHoods = hoodsList.filter(item => item.city_id === city.id);
//         setHoods(newHoods.map(item => item.name));
//         setfilteredHoods(newHoods.map(item => item.name));
//         setSelectedHood("");  
//     }

//     function filterHoods(e){      
//         const inputValue = e.target.value;
//         setSelectedHood(inputValue);
   
//         const newHoods = hoods.filter(hood => hood.toLowerCase().includes(inputValue.toLowerCase()));   
//         setfilteredHoods(newHoods);
//     }

    
//     return(
//         <>      
//         <div className={styles.Location}>
//             <div className={styles.LocationSelect}>
//                 <div  className={styles.CreateCities} onBlur={()=> {setTimeout(() => { setViewCities(false) }, 150)}} >
//                     <span>
//                         <label htmlFor="city"> Ville </label> 
//                         <input type="text" name="city" id="city" placeholder="Ville*"  autoComplete="off"
//                             value={selectedCity}
//                             onChange={filterCities}
//                             onFocus={()=>setViewCities(true)}
//                             style={{border: errors?.city && '1px solid #e74c3c'}}
//                             />
//                     </span>

//                     <ul className={styles.EditCitiesDrop} style={{ display: viewCities ? "flex" : "none" }}>
//                         {(cities).slice(0, 3).map((item, id)=> 
//                             <li key={id} onClick={()=>handleSelect(item)}> {item.name} </li>
//                         )}   
//                         {cities.length > 6 && <li className={styles.EditDropError}> +{cities.length} Ville ... </li>} 
//                         {cities.length === 0 && <li className={styles.EditDropError}> Aucune ville... </li>}            
//                     </ul>
//                 </div>
                
//                 <div  className={styles.CreateCities} onBlur={()=> setTimeout(() => { setViewHoods(false) }, 150)} >
//                     <span>
//                         <label htmlFor="hood"> Quartier </label> 
//                         <input type="text" name="neighborhood" id="hood" placeholder="Quartier*" autoComplete="off"
//                             value={SelectedHood}
//                             onChange={filterHoods}
//                             onFocus={()=>setViewHoods(true)}
//                             style={{border: errors?.hood && '1px solid #e74c3c'}}
//                             /> 
//                     </span>
//                     <ul className={styles.EditCitiesDrop} style={{ display: viewHoods ? "flex" : "none" }}>
//                         {filteredHoods.map((item, id)=> 
//                             <li key={id} onClick={()=>{setSelectedHood(item); setHood(item)}}> {item} </li>
//                         )}   
//                         {filteredHoods?.length === 0 && <li className={styles.EditDropError}> Aucun Quartier... </li>}            
//                     </ul>
//                 </div>
//             </div>
//             {(errors?.city) &&  <p className={styles.CreateError}> {errors.city} </p> }
//             {(errors?.hood) &&  <p className={styles.CreateError}> {errors.hood}</p> }
//         </div>   
//         </>
//     )
// }