"use client"

import Link from "next/link"
import styles from './article.module.css'

import { useEffect, useState } from "react";

import Icon from "@/_lib/utils/Icon";

import defaultImage from '@/public/images/default.png'

export default function Article ({article}){
    
    const [loading, setLoading] = useState(true);

    const [currentImage, setCurrentImage] = useState(`https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${article?.image}`);

    useEffect(()=>{
        preloadImage();
    },[article])

    function preloadImage() {
        const newImage = new window.Image(); 
        newImage.src = `https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${article?.image}`;
        newImage.onload = () => {
            setCurrentImage(newImage.src);
            setLoading(false)
        };
        newImage.onerror = () => {
            setLoading(false)
        };
    }

    return (
        <div className={styles.Article}>
            <Link href={`/blog/${article.id}`}> 
                {loading? 
                    <div className={styles.ArticleLoader} style={{ backgroundImage: `url('${defaultImage.src}')`}}> 
                        <div className={'spinner'} style={{background: '#99a3a4'}}> </div> 
                    </div>
                    :
                    <div className={styles.ArticleVisual} style={{ backgroundImage: `url('${currentImage}')`}}>
                    </div>
                }
                <div className={styles.ArticleDetails}>
                    <h3> {article.title} </h3>
                    <p> {article.content.slice(0,100)+('...')}</p>
                    <p className={styles.SeeMore}>
                        Voir plus
                        <span>  <Icon name={'MoveRight'}/> </span> 
                    </p>
                </div>
            </Link>
        </div>
    )
} 
