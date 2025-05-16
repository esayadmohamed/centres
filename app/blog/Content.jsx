'use client'
import styles from "./blog.module.css";
import Link from "next/link";
import { useState } from "react";
import { GetMoreArticles } from "@/_lib/blog/getdata";

import Icon from "@/_lib/utils/Icon";

import Article from "@/_com/blog/article";

export default function BlogContent({articlesData}) {
    
    const [articles, setArticles] = useState(articlesData? articlesData : []) 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function MoreArticles(){
        if(loading) return

        setError(null);
        setLoading(true);
        
        const result = await GetMoreArticles(articles.length);
        setLoading(false)
        
        if(result?.error){
            setError(result.error);
        }else{
            setArticles((prev) => [...prev, ...result]);
        } 
    }

    return (
        <div className={styles.ArticlesContainer}>
            
            <div className={styles.ArticlesContent}>
                <div className={styles.ArticlesBanner}>
                    <h2>Blog</h2>  
                    <ul className={styles.BannerRoot}>
                        <Link href={'/'}> <li>Acueil</li> </Link>
                        <li>/</li>
                        <li>Articles</li>
                    </ul>
                </div>
                
                <div className={styles.ArticlesList}>
                    {articles.map((item, id)=>
                        <Article article={item} key={id}/>
                    )}
                </div>
                
                <div className={styles.Infinite}>
                    {(error || articles.length === 0) ? 
                        <p>{error || 'Aucune article trouvée.'}</p>
                        :
                        <button onClick={MoreArticles}> 
                            {!loading ?  'Afficher plus' : <div className={'spinner'}></div>}
                        </button>
                    }
                </div > 

            </div>

            <div className={styles.ArticlesSidebar}>
                    
            </div>
            

        </div>
    )
}

