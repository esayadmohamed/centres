'use client'
import styles from "./style.module.css";

import { useState } from "react";

import BlogSidebar from "./blog/sidebar";
import BlogContent from "./blog/content";

export default function DashBlog({articlesList}) {
        
    const [articles, setArticles] = useState(articlesList || [])
    const [article, setArticle] = useState(null)

    const [toggle, setToggle] = useState(false)

    return (
        <div className={styles.DashListings}>
            <BlogSidebar articlesList={articlesList} articles={articles} setArticles={setArticles} setArticle={setArticle} setToggle={setToggle}/>
            <BlogContent article={article} setArticle={setArticle} setArticles={setArticles} toggle={toggle} setToggle={setToggle}/>
        </div>
    )
}
