'use client'
import styles from "../blog.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

import Icon from "@/_lib/utils/Icon";

import Article from "@/_com/blog/article";

export default function ArticlesContent({article, articles}) {
    
    const [imageLoaded, setImageLoaded] = useState(true);
    const [image, setImage] = useState(``);

    useEffect(()=>{
        const newImage = new window.Image(); 
        newImage.src = `https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${article.image}`;
        newImage.onload = () => {
            setImage(newImage.src);
            setImageLoaded(false);
        };
    },[article])


    return (
        <div className={styles.ArticleContainer}>
            
            <div className={styles.ArticleContent}>
                <div className={styles.ArticlesBanner}>
                    <h2>Blog</h2>  
                    <ul className={styles.BannerRoot}>
                        <Link href={'/'}> <li>Acueil</li> </Link>
                        <li>/</li>
                        <Link href={'/blog'}> <li>Articles</li> </Link>
                        <li>/</li>
                        <li>{article.title}</li>
                    </ul>
                </div>
                
                <div className={styles.ArticleBody}>
                    <div className={styles.ArticlePreview} style={{ backgroundImage: `url('${image}')`}} >
                        {imageLoaded && <div className={'spinner'}> </div>}
                    </div>

                    <h3>{article.title}</h3>

                    <p>{article.content}</p>

                    <p>Dernière mise à jour: {new Date(article.created_at).toLocaleDateString('fr-FR')}</p>

                </div>

                <div className={styles.ArticleSuggest}>
                    <h3 className={styles.SuggestTitle}> 
                        Articles similaires 
                    </h3>
                    <div className={styles.ArticleSuggestList}>
                        {articles.map((item, id)=>
                            <Article article={item} key={id}/>
                        )}
                    </div>
                </div>

            </div>

            <div className={styles.ArticlesSidebar}>
                    
            </div>
            

        </div>
    )
}

