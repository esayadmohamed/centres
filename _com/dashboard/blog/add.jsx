'use client';
import styles from "../dash.module.css";
import Image from "next/image";

import { useState, useRef } from "react";

import Icon from "@/_lib/utils/Icon";

export default function BlogAdd({setToggle, setArticle, setArticles}) {

    const uploaderRef = useRef();
    
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState('')

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [preview, setPreview] = useState(null)
    const [file, setFile] = useState(null)

    function handleClick() {
        if (uploaderRef.current) {
            uploaderRef.current.click();
        }
    }

    function handlePreview(e){
        setLoading('preview'); 

        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        
        setFile(selectedFile)

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
        
        setLoading(null); 
    }

    async function handleUpload () {
        setLoading('publish'); 

        if (!file || !title || !content) {
            setLoading(null); 
            return;
        }
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('file', file);
    
        const res = await fetch('/api/blog', {
            method: 'POST',
            body: formData,
        });
    
        const data = await res.json();
        
        uploaderRef.current.value = "";
        setLoading(null); 

        // console.log(data);
        
        if(data?.error){
            setError(data.error)
        } else{
            setArticles(data.articles);
            setArticle(null);
            setToggle(false)
        }

    };


    return(
        <div className={styles.BlogAdd} >
            <p className={styles.BlogTitle} >
                Add An Article
                <span onClick={()=>setToggle(false)}> <Icon name={'X'} color={'#e74c3c'}/></span>
            </p>
            <span>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" placeholder="Title"
                    value={title} onChange={(e)=>setTitle(e.target.value)}
                    />
            </span>
            <span>
                <label htmlFor="content">Content:</label>
                <textarea name="content" id="content" placeholder="Content"
                    value={content} onChange={(e)=>setContent(e.target.value)}
                    ></textarea>
            </span>
            <span>
                <label htmlFor="none">Image</label>
                <div className={styles.BlogImage} onClick={handleClick}>
                    <input 
                        type="file" name="image" accept="image/bmp, image/jpeg, image/png"
                        ref={uploaderRef}
                        onChange={handlePreview}
                        hidden
                    />

                    {loading === 'preview' ? 
                        <div className={'spinner'}> </div>
                        :
                        preview ?
                            <Image src={preview} width={100} height={100} alt={'Article thumbnail'}/>
                            :
                            <Icon name={'Plus'} color={'#424949'}/>
                    }
                </div>
            </span>
            
            {error && <p className={'Error'}> {error} </p>}

            <button onClick={handleUpload}>
                {loading === 'publish'? <div className={'spinner'}></div>
                    : "Publish"}
            </button>
        </div>
    )
    
}