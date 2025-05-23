'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useState } from "react";
import { AddNumber, RemoveNumber } from "@/_lib/dashboard/editdata";

import Icon from "@/_lib/utils/Icon";

export default function CenterNumber({numbers, setNumbers, center_id}) {
    
    const [index, setIndex] = useState('')

    const [number, setNumber] = useState('')
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState('')

    async function handleNumbers(){
        if(number === '') return
        setLoading('addnumber')
        setError('');

        const result = await AddNumber(center_id, number)
        setLoading(null)
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setNumbers(result)
            setNumber('')
        }
    }
    
    async function removeNumbers(item){
        setLoading('removenumber')
        setError('');

        const result = await RemoveNumber(center_id, item)
        setLoading(null)
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setNumbers(result)
            setIndex('')
        }
    }

    return(
        <ul className={styles.CentersContacts}>
            <p className={styles.CentersContactsTitle}>Numbers</p>
            <div className={styles.CentersAddContacts}>
                <div className={styles.AddContact}>
                    <span onClick={handleNumbers}> 
                        {loading === 'addnumber'? <div className={'spinner'}> </div>
                            :
                            <Icon name={'Plus'} color={'white'}/> 
                        } 
                    </span>
                    <input type="tel" placeholder="Add number..."
                        value={number}
                        onChange={(e)=>{ 
                            let sanitized = e.target.value.replace(/\D/g, '');
                            if(sanitized.length === 9) sanitized = '0' + sanitized;
                            setNumber(sanitized);
                        }} />
                </div>
            </div>
            
            {error && <p className={'Error'}> {error} </p>}

            {numbers?.map((item, id)=>
                <li key={id}>
                    {(id+1)+'- '+ item} 
                    <div className={styles.CentersContactsActions}>
                        {index === id? 
                            loading === 'removenumber' ? 
                                <div className={'spinner'}> </div>
                                :
                                <>
                                <span style={{backgroundColor: '#ccd1d1'}} onClick={()=>removeNumbers(item)}> 
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