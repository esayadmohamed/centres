'use client';
import styles from "../dash.module.css";

import { ToggleArticle } from "@/_lib/dashboard/editdata";

import { useState, useEffect } from "react";

import Icon from "@/_lib/utils/Icon";

export default function BlogArticle({article, setArticle, setArticles}) {
    
    const [imageLoaded, setImageLoaded] = useState(true);
    const [currentImage, setCurrentImage] = useState(`
        `);

    useEffect(()=>{
        const newImage = new window.Image(); 
        newImage.src = `https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${article.image}`;
        newImage.onload = () => {
            setCurrentImage(newImage.src);
            setImageLoaded(false);
        };
    },[article])

    const [loading, setLoading] = useState(null);
    const [error, setError] = useState('');

    async function handleArticle(){
        setLoading('toggle')

        const result = await ToggleArticle(article.id);
        setLoading(null)
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setArticle(result)
        }
    }

    async function removeArticle(){
        setLoading('remove')

        const formData = new FormData();
        formData.append('imageName', article.image);
        formData.append('id', article.id);

        const res = await fetch('/api/removearticle', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setLoading(null);

        if(data?.error){
            setError(data.error)
        } else{ 
            setArticles(data.articles);
            setArticle(null);
        }
    }

    return(
        <div className={styles.BlogArticle} >
            
            <div className={styles.Preview} style={{ backgroundImage: `url('${currentImage}')`}} >
                {imageLoaded && <div className={'spinner'}> </div>}
            </div>
            
            <h3> 
                {article.title} 
                {loading === 'toggle' ? 
                    <div className={'spinner'}></div>
                    :
                    <span onClick={handleArticle}>
                        <Icon name={article.view === 1 ? 'ToggleRight' : 'ToggleLeft'} 
                            color={article.view === 1 ? '#2471a3' : '#424949'}/> 
                    </span>
                }
            </h3>

            <p>{article.content} </p>

            <p>{article.created_at.toLocaleString('fr-FR')} </p>

            <button onClick={removeArticle}>  
                {loading === 'remove'? 
                    <div className={'spinner'}> </div> : 'Remove'}
            </button>

        </div>
    )
    
}