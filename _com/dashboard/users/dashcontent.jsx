'use client';
import styles from "../dash.module.css";

import { ApproveUser, SuspendUser, RemoveUser } from "@/_lib/dashboard/editdata";

import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

export default function DashContent({user, setUser, setUsersList}) {

    const [toggle, setToggle] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    async function handleApprove(){
        setLoading(true);
        setError('');
        setToggle(false);

        const result = await ApproveUser(user.id)
        setLoading(false);

        // console.log(result);

        if(result?.error){
            setError(result.error)
        }else{
            setUsersList(result)
            setUser(null)  
        }
    }

    async function handleSuspend(){
        setLoading(true);
        setError('');
        setToggle(false);

        const result = await SuspendUser(user.id)
        setLoading(false);

        // console.log(result);

        if(result?.error){
            setError(result.error)
        }else{
            setUsersList(result)
            setUser(null)  
        }
    }
    
    const dateObject = new Date(user.created_at);
    const formattedDate = dateObject.toLocaleString();

    return(
        <div className={styles.DashContent} onMouseLeave={()=>setToggle(false)}>
            <div className={styles.ContentDetails}>
                {error && <span className={'Error'}>{error}</span>}
                <span>
                    <h4>Listing id: </h4>
                    <p> {user.id} </p>
                </span>
                <span>
                    <h4>Create at: </h4>
                    <p> {formattedDate} </p>
                </span>
                <span>
                    <h4>Name: </h4>
                    <p> {user.name} </p>
                </span>
                <span>
                    <h4>Phone: </h4>
                    <p> {user.phone} </p>
                </span>
                <span>
                    <h4>Description: </h4>
                    <p> {user.email} </p>
                </span> 
                {/* <span> requires approval before delete to avoid mistakes
                    <button>Remove User</button>
                </span> */}
            </div>
            <div className={styles.ContentActions}>
                {!loading ? 
                    <span onClick={()=>setToggle(!toggle)}><Icon name={'Menu'} /> </span>
                    : <div className={styles.spinner} ></div>  }

                <ul style={{display: toggle? 'block' : 'none'}}>
                    {['none', 'off'].includes(user.active) && <li onClick={handleApprove}>Confirm</li>}
                    {['on'].includes(user.active) && <li onClick={handleSuspend}>Suspend</li>}
                </ul>
            </div>
        </div>
    )
    
}