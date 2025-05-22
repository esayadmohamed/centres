'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useState } from "react";
import { AddEmail, RemoveEmail } from "@/_lib/dashboard/editdata";

import Link from "next/link";
import Icon from "@/_lib/utils/Icon";

export default function CenterMedia({center_id}) {
    
    const [index, setIndex] = useState('')

    const [link, setLink] = useState('')
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState('')

    async function handleMedia(){
        if(link === '') return
        setLoading('addmedia')
        setError('');

        const result = await AddEmail(center_id, link)
        setLoading(null)

        if(result?.error){
            setError(result.error)
        } else{
            // setLinks(result)
            // setLink('')
        }
    }
    
    async function removeEmails(item){
        setLoading('removeemail')
        setError('');

        const result = await RemoveEmail(center_id, item)
        setLoading(null)
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setEmails(result)
            setIndex('')
        }
    }

    return(
        <div className={styles.SocialMedia}>
            <p className={styles.MediaTitle}>Social Media</p>
            <div className={styles.MediaContent}>
                
                <div className={styles.AddMedia}>
                    <span onClick={handleMedia}> 
                        {loading? <div className={'spinner'}> </div>
                            :
                            <Icon name={'Plus'} color={'white'}/> 
                        } 
                    </span>
                    <input type="text" placeholder={'Social media link...'} 
                        value={link} onChange={(e)=>setLink(e.target.value)}
                        />
                </div>

                <ul className={styles.k}>
                    <Link href={'/'}> 
                        <li style={{backgroundColor: '#2980b9'}}>
                            F
                        </li>
                    </Link>
                    <Link href={'/'}> 
                        <li style={{backgroundColor: '#e74c3c'}}>
                            I
                        </li>
                    </Link>
                    <Link href={'/'}> 
                        <li style={{backgroundColor: '#28b463'}}>
                            W
                        </li>
                    </Link>
                </ul>
            </div>
            {error && <p className={'Error'}> {error} </p>}
        </div>

    )
    
}
                {/* <div className={styles.AddContact}>
                    <span onClick={handleEmails}> 
                        {loading === 'addemail'? <div className={'spinner'}> </div>
                            :
                            <Icon name={'Plus'} color={'white'}/> 
                        } 
                    </span>
                    <input type="text" placeholder="Add email..." 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                </div> */}




    // function handleClick() {
    //     if (uploaderRef.current) {
    //         uploaderRef.current.click();
    //     }
    // }

    // function handlePreview(e){
    //     setLoading('preview'); 

    //     const selectedFile = e.target.files[0];
    //     if (!selectedFile) return;
        
    //     setFile(selectedFile)

    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setPreview(reader.result);
    //     };
    //     reader.readAsDataURL(selectedFile);
        
    //     setLoading(null); 
    // }

    // async function handleUpload () {
    //     setLoading('publish'); 

    //     if (!file || !title || !content) {
    //         setLoading(null); 
    //         return;
    //     }
    
    //     const formData = new FormData();
    //     formData.append('title', title);
    //     formData.append('content', content);
    //     formData.append('file', file);
    
    //     const res = await fetch('/api/blog', {
    //         method: 'POST',
    //         body: formData,
    //     });
    
    //     const data = await res.json();
        
    //     uploaderRef.current.value = "";
    //     setLoading(null); 

    //     console.log(data);
        
    //     if(data?.error){
    //         setError(data.error)
    //     } else{
    //         setArticles(data.articles);
    //         setArticle(null);
    //     }

    // };

{/* {(article && toggle) ?
                <div className={styles.BlogArticle} >
                </div>
                :
                <div className={styles.BlogAdd} >
                    <p>Add An Article</p>
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
            } */}