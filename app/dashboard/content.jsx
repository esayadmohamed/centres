'use client';
import styles from "./dash.module.css";
import { useState } from "react";

import { allListings, allUsers, allArticles } from "@/_lib/dashboard/getdata";

import DashListings from "@/_com/dashboard/listings";
import DashBlog from "@/_com/dashboard/blog";
import DashUsers from "@/_com/dashboard/users";
import DashData from "@/_com/dashboard/data";

import Icon from "@/_lib/utils/Icon";

export default function Dashcontent({listingsList, usersList}) {
    
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState('');
    
    const [users, setUsers] = useState(usersList || []);
    const [listings, setListings] = useState(listingsList || []);
    const [articles, setArticles] = useState([]);

    const [under, setUnder] = useState(listingsList.filter((item)=> item.state === 'under').length);

    const components = [
        {item: <DashUsers usersList={users} setUsersList={setUsers} />}, //0
        {item: <DashListings listingsList={listings} setListingsList={setListings} setUnder={setUnder}/>}, //1
        {item: <DashBlog articlesList={articles} setArticlesList={setArticles}/>}, //2
        {item: <DashData />}, //3
        {item: <div>advertise</div>}, //4 
    ]

    async function fetchUsers(){
        if(index === 0) return;
        setLoading(0)

        const result = await allUsers(); 
        setUsers(result)
        setIndex(0)
        setLoading(null)
    }

    async function fetchListings(){
        if(index === 1) return;
        setLoading(1)

        const result = await allListings(); 
        setListings(result)
        setUnder(result.filter((item)=> item.state === 'under').length)
        setIndex(1)
        setLoading(null)
    }

    async function fetchArticles(){
        if(index === 2) return;
        setLoading(2)

        const result = await allArticles(); 
        setArticles(result)
        
        // console.log(result);

        setIndex(2)
        setLoading(null)
    }

    
    return (
        <div className={styles.DashContainer}>
            <div className={styles.DashHeader}>
                <h2> 
                    Dashboard
                </h2>
                {/* <button>Logout</button> */}
            </div>
            
            <div className={styles.DashBody}> 
                <ul className={styles.DashSidebar}>
                    <li onClick={fetchUsers} className={index===0 ? styles.Activeli : styles.Inactiveli}> 
                        {(loading === 0)? <div className={'spinner'}></div> 
                            : <span> <Icon name={'User'} color={'#424949'}/> Users </span>}
                    </li> 
                    <li onClick={fetchListings} className={index===1 ? styles.Activeli : styles.Inactiveli}> 
                        {(loading === 1)? <div className={'spinner'}></div> 
                            : <span> <Icon name={'SquareMenu'} color={'#424949'}/> Listings {under !== 0 && <p>{under}</p>}</span>}
                    </li> 
                    <li onClick={fetchArticles} className={index===2 ? styles.Activeli : styles.Inactiveli}> 
                        {(loading === 2)? <div className={'spinner'}></div> 
                            : <span> <Icon name={'LetterText'} color={'#424949'}/> Blog </span>}
                    </li> 
                    <li onClick={()=>setIndex(3)} className={index===3 ? styles.Activeli : styles.Inactiveli}> 
                        {(loading === 3)? <div className={'spinner'}></div> 
                            : <span> <Icon name={'BetweenHorizontalEnd'} color={'#424949'}/> Data </span>}
                    </li> 
                    <li onClick={()=>setIndex(4)} className={index===4 ? styles.Activeli : styles.Inactiveli}> 
                        {(loading === 4)? <div className={'spinner'}></div> 
                            : <span> <Icon name={'Megaphone'} color={'#424949'}/> Advertizing </span>}
                    </li> 
                </ul>

                <div className={styles.DashContent}>
                    {components[index].item}
                </div>
            </div>
            
        </div>
    )
}



{/* {components.map((item, id)=>
    <li onClick={()=>setIndex(id)} className={index === id ? styles.Activeli : styles.Inctiveli} key={id}> 
        <Icon name={`${item.icon}`} color={'#424949'}/> 
        {item.name}
    </li> 
)} */}