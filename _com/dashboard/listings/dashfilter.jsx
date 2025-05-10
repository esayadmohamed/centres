'use client';
import styles from "../dash.module.css";
import { useState } from "react";

import { singleListing } from "@/_lib/dashboard/getdata";

import Icon from "@/_lib/utils/Icon";

export default function DashFilter({listingsList, listings, setListings, setListing}){
    
    const [filter, setFilter] = useState('all')
    const [searchId, setSearchId] = useState('')
    const [searchName, setSearchName] = useState('')
    const [index, setIndex] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function handleFilter(value){
        setFilter(value);
        setSearchName('')
        setSearchId('');
        setListing(null);
        
        if(value === 'all'){
            setListings(listingsList)
        } else{
            const filteredValues = listingsList.filter(item =>  item.state === value);
            setListings(filteredValues);  
        }
 
    }

    function searchByname(e){
        const rawArray = filter === 'all' ? listingsList : listingsList.filter(item => item.state === filter)
        
        const inputValue = e.target.value;
        setSearchName(inputValue);
            const filteredValues = rawArray.filter(value =>
                value.name.toLowerCase().includes(inputValue.toLowerCase())
            ).sort((a, b) => a.name.localeCompare(b.name));
    
        setListings(filteredValues);
    }

    function searchByid(e){
        const rawArray = filter === 'all' ? listingsList : listingsList.filter(item => item.state === filter)
        
        const inputValue = e.target.value;
        setSearchId(inputValue);

        if (inputValue.trim() === "") {
            setListings(rawArray);
            return;
        }

        const filteredValues = rawArray.filter(value => value.user_id.toString() === inputValue);
        setListings(filteredValues);
    }

    async function getListing(id){
        setLoading(true)
        setError('');
        setIndex(id)

        const result = await singleListing(id)
        setLoading(false)
        setSearchId('');
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setListing(result)
        }
    }

    return(
        <div className={styles.ListingsContainer}>
            <div className={styles.DashFilter}>
                <div className={styles.FilterSearch}>
                    <span>
                        <input type="text" value={searchName} placeholder="Name" onChange={searchByname}/>
                        <input type="text" value={searchId} placeholder="User Id" onChange={searchByid}/>
                    </span>
                    <p>
                        <Icon name={'Search'} color={'#616a6b'}/>
                    </p>
                </div>
                <p className={styles.FilterSort}>
                    <span className={filter === 'all' ? styles.ActiveFilter : styles.InactiveFilter}
                        onClick={() => handleFilter('all')}>All</span>
                    <span className={filter === 'under' ? styles.ActiveFilter : styles.InactiveFilter}
                        onClick={() => handleFilter('under')}>Review</span>
                    {/* <span className={filter === 'on' ? styles.ActiveFilter : styles.InactiveFilter}
                        onClick={() => handleFilter('on')}>Approved</span> */}
                </p>
                </div>
                <ul className={styles.ListingsList}>

                    {error && <p className={'Error'}>{error}</p>}

                    { listings.length !== 0 ?
                        listings.slice(0, 10).map((item, id)=> 
                            <li key={id} onClick={()=>getListing(item.id)}> 
                                {loading && index === item.id? 
                                    <div className={'spinner'}></div>:
                                    <span> 
                                        {id +'- '+ item.name} 
                                        <Icon name={item.state === 'off' ? 'CircleAlert' : item.state === 'under' ? 'CircleEllipsis' : ''} 
                                            color={item.state === 'off' ? '#e74c3c' : item.state === 'under' && '#2471a3'}/>
                                    </span>}
                            </li>) 
                        : 
                        <li> No Listings </li>
                    }
                </ul>
        </div>
    )
    
}