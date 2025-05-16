'use client';
import styles from "../dash.module.css";
import { useState } from "react";

import { singleArticle } from "@/_lib/dashboard/getdata";

import Icon from "@/_lib/utils/Icon";

export default function BlogSidebar({articlesList, articles, setArticles, setArticle, setToggle}){

    const [filter, setFilter] = useState('all')
    const [searchName, setSearchName] = useState('')
    const [index, setIndex] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function handleFilter(value){
        setFilter(value);
        setSearchName('')
        
        if(value === 'all'){
            setArticles(articlesList)
        } else{
            const filteredValues = articlesList.filter(item =>  item.view === 0);
            setArticles(filteredValues);  
        }
 
    }

    function searchByname(e){
        setFilter('all');

        const inputValue = e.target.value;
        setSearchName(inputValue);
            const filteredValues = articlesList.filter(value =>
                value.title.toLowerCase().includes(inputValue.toLowerCase())
            ).sort((a, b) => a.title.localeCompare(b.name));
    
        setArticles(filteredValues);
    }

    async function getArticle(id){
        setLoading(true)
        setError('');
        setIndex(id)

        const result = await singleArticle(id)
        setLoading(false)
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setArticle(result)
            setToggle(false);
        }
    }
    

    return(
        <div className={styles.ArticlesContainer}>
            <div className={styles.ArticlesFilter}>
                <div className={styles.ArticlesSearch}>
                    <input type="text" value={searchName} placeholder="Name" onChange={searchByname}/>
                    <span>
                        <Icon name={'Search'} color={'#616a6b'}/>
                    </span>
                </div>
                <p className={styles.ArticlesSort}>
                    <span className={filter === 'all' ? styles.ActiveFilter : styles.InactiveFilter}
                        onClick={() => handleFilter('all')}>All</span>
                    <span className={filter === 'dreft' ? styles.ActiveFilter : styles.InactiveFilter}
                        onClick={() => handleFilter('dreft')}>Draft</span>
                </p>
            </div>
            <ul className={styles.ListingsList}>

                {error && <p className={'Error'}>{error}</p>}

                { articles.length !== 0 ?
                    articles.slice(0, 10).map((item, id)=> 
                        <li key={id} onClick={()=>getArticle(item.id)}> 
                            {loading && index === item.id? 
                                <div className={'spinner'}></div>:
                                <span> 
                                    {id +'- '+ item.title} 
                                    {item.view === 0 &&  <Icon name={'ToggleLeft'} color={'#424949'}/>}
                                </span>}
                        </li>) 
                    : 
                    <p> No Articles </p>
                }
            </ul>
        </div>
    )
    
}