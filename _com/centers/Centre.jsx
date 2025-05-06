"use client"

import Link from "next/link"
import styles from './center.module.css'

import { useEffect, useState } from "react";

import Icon from "@/_lib/utils/Icon";

import defaultImage from '@/public/images/default.png'

export default function Centre ({listing}){
    
    const [loading, setLoading] = useState(true);
        
    const [currentImage, setCurrentImage] = useState(`https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${listing?.images[0]}`);

    useEffect(()=>{
        preloadImage();
    },[listing])

    function preloadImage() {
        const newImage = new window.Image(); 
        newImage.src = `https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${listing?.images[0]}`;
        newImage.onload = () => {
            setCurrentImage(newImage.src);
            setLoading(false)
        };
        newImage.onerror = () => {
            setLoading(false)
        };
    }
    

    return (
        <div className={styles.Centre}>
            <Link href={`/centres/${listing.id}`}> 
                {loading? 
                    <div className={styles.CentreLoader} style={{ backgroundImage: `url('${defaultImage.src}')`}}> 
                        <div className={styles.Spinner} style={{background: '#99a3a4'}}> </div> 
                    </div>
                    :
                    <div className={styles.CentreVisual} style={{ backgroundImage: `url('${currentImage}')`}}>
                    </div>
                }
                <div className={styles.CentreDetails}>
                    <div>
                        <p> {listing.hood} ,{listing.city} </p>
                        <p>
                            <Icon name={'Star'} />
                            <span> {listing.overall ? listing.overall.toFixed(1) : "Nouveau"} </span>
                        </p>
                    </div>
                    <p> {listing.name} </p> 
                </div>
            </Link>
        </div>
    )
} 
