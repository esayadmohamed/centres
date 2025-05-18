'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useEffect, useState } from "react";
// import { AddEmail, RemoveEmail } from "@/_lib/dashboard/editdata";

import Icon from "@/_lib/utils/Icon";

import CenterEmail from "./addemail";
import CenterNumber from "./addnumber";
import Converter from "./converter";
import Send from "./sendemail";

export default function MarketingContent({center, setCenter}) {
        
    const [emails, setEmails] = useState([])
    const [numbers, setNumbers] = useState([])

    useEffect(()=>{
        setEmails(center?.emails);
        setNumbers(center?.numbers);
    }, [center])

    const [toggle, setToggle] = useState(null)

    function handleToggle(value){
        setCenter(null)
        setToggle(value)
    }

    return(
        <div className={styles.CentersContent} >
            <div className={styles.CentersAction}>
                <p>Centers</p>
                <p>
                    <span style={{backgroundColor: '#2471a3'}} onClick={()=>handleToggle('converter')}> 
                        <Icon name={'LoaderCircle'} color={'white'}/> 
                    </span>
                    <span style={{backgroundColor: '#2ecc71'}} onClick={()=>handleToggle('send')}> 
                        <Icon name={'Send'} color={'white'}/> 
                    </span>
                </p>
            </div>

            {center? 
                <div className={styles.CentersBody}>
                    <p className={styles.CenterName}>{center.name}, {center.city}</p>
                    
                    <CenterEmail emails={emails} setEmails={setEmails} center_id={center?.id}/>

                    <CenterNumber numbers={numbers} setNumbers={setNumbers} center_id={center?.id}/>

                </div>
                :
                    toggle === 'converter' ?
                        <Converter/>    
                        :
                    toggle === 'send' ?
                        <Send />
                    :
                        <div className={styles.CentersEmpty}>
                            [no data]
                        </div>
            }
  
        </div>
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