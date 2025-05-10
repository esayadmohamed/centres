'use client'
import styles from "./style.module.css";

import { useEffect, useState } from "react";

import DashFilter from "./users/dashfilter";
import DashContent from "./users/dashcontent";

export default function DashUsers({usersList, setUsersList}) {
    
    const [users, setUsers] = useState(usersList)
    const [user, setUser] = useState(null)

    useEffect(()=>{
        setUsers(usersList)
    },[usersList])

    // console.log(users);

    return (
        <div className={styles.DashListings}>
            <DashFilter 
                usersList={usersList}
                setUser={setUser}
                users={users}
                setUsers={setUsers}
                />

            {!user ? 
                <div className={styles.ListingView}>
                </div>
                :
                <div className={styles.ListingView}>
                    <DashContent 
                        user={user} 
                        setUser={setUser}
                        setUsersList={setUsersList}
                        />
                </div>
            }
        </div>
    )
}
