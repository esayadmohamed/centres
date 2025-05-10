'use client';
import styles from "../dash.module.css";

import { ApproveListing, SuspendListing } from "@/_lib/dashboard/editdata";

import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

export default function DashContent({listing, setListing, setListingsList}) { //setUnder
    
    const [toggle, setToggle] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    async function handleApprove(){
        setLoading(true);
        setError('');
        setToggle(false);

        const result = await ApproveListing(listing.id)
        setLoading(false);

        // console.log(result);

        if(result?.error){
            setError(result.error)
        }else{
            setListingsList(result)
            // setUnder(result.filter((item)=> item.state === 'under').length);
            setListing(null)  
        }
    }

    async function handleSuspend(){
        setLoading(true);
        setError('');
        setToggle(false);

        const result = await SuspendListing(listing.id)
        setLoading(false);

        // console.log(result);

        if(result?.error){
            setError(result.error)
        }else{
            setListingsList(result)
            // setUnder(result.filter((item)=> item.state === 'under').length);
            setListing(null)  
        }
    }
    
    const dateObject = new Date(listing.created_at);
    const formattedDate = dateObject.toLocaleString();

    return(
        <div className={styles.DashContent} onMouseLeave={()=>setToggle(false)}>
            <div className={styles.ContentDetails}>
                {error && <span className={'Error'}>{error}</span>}
                <span>
                    <h4>Listing id: </h4>
                    <p> {listing.id} </p>
                </span>
                <span>
                    <h4>Create by: </h4>
                    <p> {listing.user_id} </p>
                </span>
                <span>
                    <h4>Create at: </h4>
                    <p> {formattedDate} </p>
                </span>
                <span>
                    <h4>Name: </h4>
                    <p> {listing.name} </p>
                </span>
                <span>
                    <h4>Location: </h4>
                    <p> {listing.city}, {listing.hood}  </p>
                </span>
                <span>
                    <h4>Phone: </h4>
                    <p> {listing.phone} </p>
                </span>
                <span>
                    <h4>Description: </h4>
                    <p> {listing.info} </p>
                </span> 
            </div>
            <div className={styles.ContentActions}>
                {!loading ? 
                    <span onClick={()=>setToggle(!toggle)}><Icon name={'Menu'} /> </span>
                    : <div className={styles.spinner} ></div>  }

                <ul style={{display: toggle? 'block' : 'none'}}>
                    {['under', 'off'].includes(listing.state) && <li onClick={handleApprove}>Allow</li>}
                    {['on', 'under'].includes(listing.state) && <li onClick={handleSuspend}>Suspend</li>}
                </ul>
            </div>
        </div>
    )
    
}