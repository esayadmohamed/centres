'use client';
import styles from "../dash.module.css";
import { useState } from "react";

import { singleUser } from "@/_lib/dashboard/getdata";

import Icon from "@/_lib/utils/Icon";

export default function DashFilter({usersList, users, setUsers, setUser}){

    const [filter, setFilter] = useState('all')
    const [searchId, setSearchId] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
    const [index, setIndex] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function handleFilter(value){
        setFilter(value);
        setSearchEmail('')
        setSearchId('');
        setUser(null);
        
        if(value === 'all'){
            setUsers(usersList)
        } else{
            const filteredValues = usersList.filter(item =>  item.active === value);
            setUsers(filteredValues);  
        }
 
    }

    function searchByemail(e){
        // const rawArray = filter === 'all' ? listingsList : listingsList.filter(item => item.state === filter)
        
        const inputValue = e.target.value;
        setSearchEmail(inputValue);
            const filteredValues = usersList.filter(value =>
                value.email.toLowerCase().includes(inputValue.toLowerCase())
            ).sort((a, b) => a.email.localeCompare(b.email));
    
        setUsers(filteredValues);
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

    async function getUser(id){
        setLoading(true)
        setError('');
        setIndex(id)

        const result = await singleUser(id)
        setLoading(false)
        setSearchId('');
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setUser(result)
        }
    }

    return(
        <div className={styles.ListingsContainer}>
            <div className={styles.DashFilter}>
                <div className={styles.FilterSearch}>
                    <span>
                        <input type="text" value={searchEmail} placeholder="Email" onChange={searchByemail}/>
                        <input type="text" value={searchId} placeholder="User Id" onChange={searchByid}/>
                    </span>
                    <p>
                        <Icon name={'Search'} color={'#616a6b'}/>
                    </p>
                </div>
                <p className={styles.FilterSort}>
                    <span className={filter === 'all' ? styles.ActiveFilter : styles.InactiveFilter}
                        onClick={() => handleFilter('all')}>All</span>
                    <span className={filter === 'none' ? styles.ActiveFilter : styles.InactiveFilter}
                        onClick={() => handleFilter('none')}>Review</span>
                    <span className={filter === 'off' ? styles.ActiveFilter : styles.InactiveFilter}
                        onClick={() => handleFilter('off')}>Suspended</span>
                </p>
                </div>
                <ul className={styles.ListingsList}>

                    {error && <p className={'Error'}>{error}</p>}

                    { users.length !== 0 ?
                        users.slice(0, 10).map((item, id)=> 
                            <li key={id} onClick={()=>getUser(item.id)}> 
                                {loading && index === item.id? 
                                    <div className={'spinner'}></div>:
                                    <span> 
                                        {id +'- '+ item.email} 
                                        <Icon name={item.active === 'none'? 'Send' : item.active === 'off'? 'CircleAlert' : ''} 
                                            color={item.active === 'none'? '#2471a3' : item.active === 'off' && '#e74c3c'}/>
                                    </span>}
                            </li>) 
                        : 
                        <li> No Users </li>
                    }
                </ul>
        </div>
    )
    
}