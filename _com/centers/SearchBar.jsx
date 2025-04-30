"use client"
import styles from './search.module.css'
import { useState } from "react"

import Icon from "@/_lib/utils/Icon";

export default function SearchBar ({citiesList, hoodsList,
    selectedCity, setSelectedCity, SelectedHood, setSelectedHood, handleFilter}){
    
    const [viewCities, setViewCities] = useState(false)
    const [viewHoods, setViewHoods] = useState(false)

    const [city, setCity] = useState('');
    const [hood, setHood] = useState('');

    const [cities, setCities] = useState(citiesList || []);
    const [hoods, setHoods] = useState([]);
    
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
        handleFilter('', '')
    }

    return (
        <main className={styles.SearchBox}>
            
            <h1>Trouvez le Meilleur Accompagnement</h1>
            <p>Découvrez des centres de soutien adaptés à vos besoins pour réussir.</p>

            <div className={styles.SearchBar}>
                <div className={styles.SearchAction} onClick={()=> handleFilter(selectedCity, SelectedHood)}>
                    <Icon name={'Search'} />
                </div>
                {selectedCity === '' ? 
                    <div className={styles.SearchInput}>
                        <div onBlur={()=> {setTimeout(() => {setViewCities(false) }, 150)}} >
                            <input 
                                type="text" placeholder="Choisir Ville" autoComplete="off"
                                value={city}
                                onChange={filterCities}
                                onFocus={()=>setViewCities(true)}
                            />
                            {viewCities && 
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
                            <span> {selectedCity}{SelectedHood && ', '+ SelectedHood} <Icon name={'X'} /> </span>
                        </p>}
                        {SelectedHood === '' &&                   
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
        </main>
    )
}





{/* 
<p>{'Rabat'}</p>
<div className={styles.SearchCities}
onBlur={()=> {setTimeout(() => { setViewCities(false) }, 150)}} >
<input 
    type="text" placeholder="Ville" autoComplete="off"
    value={selectedCity}
    onChange={filterCities}
    onFocus={()=>setViewCities(true)}
/>
<ul className={styles.CitiesDrop} style={{ display: viewCities ? "flex" : "none" }}>
    {(cities.slice(0, 6)).map((item, id)=> 
        <li key={id} onClick={()=>handleCitySelect(item)}> {item.name} </li>
    )}   
    {cities.length === 0 && <li className={styles.EditDropError}> Aucune ville... </li>}            
</ul>
</div> */}


{/* <p>{selectedCity}, {SelectedHood}</p>
                
<div className={styles.SearchCities}
    onBlur={()=> {setTimeout(() => { setViewCities(false) }, 150)}} >
    <input 
        type="text" placeholder="Ville" autoComplete="off"
        value={selectedCity}
        onChange={filterCities}
        onFocus={()=>setViewCities(true)}
    />
    <ul className={styles.CitiesDrop} style={{ display: viewCities ? "flex" : "none" }}>
        {(cities.slice(0, 6)).map((item, id)=> 
            <li key={id} onClick={()=>handleCitySelect(item)}> {item.name} </li>
        )}   
        {cities.length === 0 && <li className={styles.EditDropError}> Aucune ville... </li>}            
    </ul>
</div>
        
*/}

{/* <span className={styles.SearchClean} onClick={handleCleanup}> 
    {selectedCity !== '' &&  <Icon name={'X'} /> } 
</span> */}
{/* 
{selectedCity !== '' && SelectedHood !== '' ? <p>{selectedCity}, {SelectedHood}</p> : 
    selectedCity === '' ?
    <div className={styles.SearchCities}
        onBlur={()=> {setTimeout(() => { setViewCities(false) }, 150)}} >
            <input 
                type="text" 
                placeholder="Ville" 
                autoComplete="off"
                value={selectedCity}
                onChange={filterCities}
                onFocus={()=>setViewCities(true)}
            />
        <ul className={styles.CitiesDrop} style={{ display: viewCities ? "flex" : "none" }}>
            {(cities.slice(0, 6)).map((item, id)=> 
                <li key={id} onClick={()=>handleCitySelect(item)}> {item.name} </li>
            )}   
            {cities.length === 0 && <li className={styles.EditDropError}> Aucune ville... </li>}            
        </ul>
    </div>
    :
    <>
    <p>{selectedCity}</p>
    <div className={styles.EditHoods}
        onBlur={()=> setTimeout(() => { setViewHoods(false) }, 150)}>
        <input 
            type="text" 
            placeholder="Quartier" 
            autoComplete="off"
            value={SelectedHood}
            onChange={filterHoods}
            onFocus={handleHoodFocus}
        />
        <ul className={styles.CitiesDrop} style={{ display: viewHoods ? "flex" : "none" }}>
            {(hoods).map((item, id)=> 
                <li key={id} onClick={ ()=>handleHoodSelect(item)}> {item.name} </li>
            )}   
            {hoods.length === 0 && <li className={styles.EditDropError}> Aucun Quartier... </li>}            
        </ul>
    </div>
    </>
    }
<span className={styles.SearchClean} onClick={handleCleanup}> 
    {selectedCity !== '' &&  <Icon name={'X'} /> } 
</span>
<div className={styles.SearchAction} >
    <Icon name={'Search'} />
</div>
</div> */}