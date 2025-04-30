'use client';
import styles from "./style.module.css";

import { useState } from "react";

import { FilterListings, GetMoreListings } from "@/_lib/centers/getdata";

import SearchBar from "@/_com/centers/SearchBar";
import Sortby from "@/_com/centers/Sortby";
import Centre from "@/_com/centers/Centre";

export default function Listings({listings_list, cities_list, hoods_list}) {
        
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [moreLoading, setMoreLoading] = useState(false);
    const [listings, setListings] = useState(listings_list || []);
    
    const [selectedCity, setSelectedCity] = useState('') 
    const [SelectedHood, setSelectedHood] = useState('') 
    const [sort, setSort] = useState('a-z') 

    async function handleListings(){}

    async function handleFilter(city_value, hood_value){
        if(loading) return

        setError(null);
        setLoading(true)
        
        const data = { sort: sort, city: city_value, hood: hood_value }

        const result = await FilterListings(data);
        setLoading(false)
        // console.log(result);
        
        if(result?.error){
            setError(result.error);
            setListings([]);
        }else{
            setListings(result);
        } 
    }

    async function handleSort(sort_value){
        if(loading) return

        setError(null);
        setLoading(true);
        setSort(sort_value);
        
        const data = { sort: sort_value, city: selectedCity, hood: SelectedHood }

        const result = await FilterListings(data);
        setLoading(false)
        console.log(result);
        
        if(result?.error){
            setError(result.error);
            setListings([]);
        }else{
            setListings(result);
        } 
    }

    async function MoreListing(){
        if(moreLoading) return

        setError(null);
        setMoreLoading(true);
        
        const data = { sort: sort, city: selectedCity, hood: SelectedHood }

        const result = await GetMoreListings(listings.length, data);
        setMoreLoading(false)
        
        if(result?.error){
            setError(result.error);
        }else{
            setListings((prev) => [...prev, ...result]);
        } 
    }

    return (
        <div className={styles.MainPage}>
            <SearchBar 
                citiesList={cities_list}
                hoodsList={hoods_list}
                handleFilter={handleFilter}

                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                SelectedHood={SelectedHood} 
                setSelectedHood={setSelectedHood}
            />
            <Sortby handleListings={handleListings} sort={sort} handleSort={handleSort}/>
            {loading ? 
                <div className={styles.DiscoverLoader}>
                    <div className={styles.spinner}></div>    
                    <p>Patientez ...</p>
                </div>
                :
                <>
                <main className={styles.Discover}>
                    <ul>
                        {listings?.map((item, id)=>
                            <li key={id}><Centre listing={item} /></li>
                        )}
                    </ul>
                </main>
                <div className={styles.Infinite}>
                    {(error || listings.length === 0) ? 
                        <p>{error}</p>
                        :
                        (moreLoading ?  
                            <><div className={styles.spinner}></div> <p>Patientez ...</p> </>
                            :
                            <button onClick={MoreListing}> Afficher plus </button>)
                    }
                </div > 
                </>
            }
        </div>
        
    )
}
  

