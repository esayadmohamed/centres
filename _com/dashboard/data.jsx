'use client'
import styles from "./style.module.css";

import { useState } from "react";

import DashSidebar from "./data/datasidebar";
import DashContent from "./data/datacontent";

export default function DashData() {
    
    const [title, setTitle] = useState('')
    const [content, setContent] = useState([])

    function handleContent(array, value){
        setContent(array)
        setTitle(value)        
    }


    return (
        <div className={styles.DashListings}>
            <DashSidebar handleContent={handleContent}/>

            {content.length === 0 ? 
                <div className={styles.ListingView}>
                </div>
                :
                <div className={styles.ListingView}>
                    <DashContent title={title} content={content} setContent={setContent}/>
                </div>
            }
        </div>
    )
}
