'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useState } from "react";
import { AddEmail, RemoveEmail } from "@/_lib/dashboard/editdata";

import Icon from "@/_lib/utils/Icon";

export default function CenterEmail({emails, setEmails, center_id}) {
    
    const [index, setIndex] = useState('')

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState('')



    async function handleEmails(){
        if(email === '') return
        setLoading('addemail')
        setError('');

        const result = await AddEmail(center_id, email)
        setLoading(null)
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setEmails(result)
            setEmail('')
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
        <ul className={styles.CentersContacts}>
            <p className={styles.CentersContactsTitle}>Emails</p>
            <div className={styles.CentersAddContacts}>
                <div className={styles.AddContact}>
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
                </div>
            </div>
            
            {error && <p className={'Error'}> {error} </p>}

            {emails?.map((item, id)=>
                <li key={id}>
                    {(id+1)+'- '+ item} 
                    <div className={styles.CentersContactsActions}>
                        {index === id? 
                            loading === 'removeemail' ? 
                                <div className={'spinner'}> </div>
                                :
                                <>
                                <span style={{backgroundColor: '#ccd1d1'}} onClick={()=>removeEmails(item)}> 
                                    <Icon name={'Minus'} color={'#424949'}/> 
                                </span>
                                <span style={{backgroundColor: '#28b463', width:'50px'}} onClick={()=>setIndex('')}>  
                                    <Icon name={'X'} color={'white'}/> 
                                </span>
                                </>
                            : 
                            <span style={{backgroundColor: '#e74c3c'}} onClick={()=>setIndex(id)}> 
                                <Icon name={'Minus'} color={'white'}/> 
                            </span>
                        }

                    </div>
                </li>
            )}
        </ul>
    )
    
}




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