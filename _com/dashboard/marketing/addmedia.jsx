'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useState } from "react";
import { AddWhatsApp, AddFacebook, AddInstagram } from "@/_lib/dashboard/editdata";

import Link from "next/link";
import Icon from "@/_lib/utils/Icon";

export default function CenterMedia({center, setCenter}) {    

    const [whatsapp, setWhatsapp] = useState('')
    const [facebook, setFacebook] = useState('')
    const [instagram, setInstagram] = useState('')
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)

    async function handleWhatsapp(){
        setLoading('whatsapp')
        setError(null);

        const result = await AddWhatsApp(center.id, `https://wa.me/${whatsapp}`)
        setLoading(null)

        if(result?.error){
            setError(result.error)
        } else{
            setCenter(result)
            setWhatsapp('')
        }
    }

    async function handleFacebook(){
        setLoading('facebook')
        setError(null);

        const result = await AddFacebook(center.id, facebook)
        setLoading(null)

        if(result?.error){
            setError(result.error)
        } else{
            setCenter(result)
            setFacebook('')
        }
    }

    async function handleInstagram(){
        setLoading('instagram')
        setError(null);

        const result = await AddInstagram(center.id, instagram)
        setLoading(null)

        if(result?.error){
            setError(result.error)
        } else{
            setCenter(result)
            setInstagram('')
        }
    }
    
    return(
        <div className={styles.SocialMedia}>
            <p className={styles.MediaTitle}>Social Media</p>
            <div className={styles.MediaContent}>
                <div className={styles.AddMedia}>
                    <span onClick={handleWhatsapp} style={{backgroundColor: '#28b463'}}> 
                        {loading === 'whatsapp'? <div className={'spinner'}> </div>
                            :
                            <Icon name={'Phone'} color={'white'}/> 
                        } 
                    </span>
                    <input type="text" placeholder={'Whatsapp...'} 
                        value={whatsapp} 
                        onChange={(e)=>{ let sanitized = e.target.value.replace(/\D/g, '');
                            if(sanitized.length === 9) sanitized = '0' + sanitized;
                            setWhatsapp(sanitized);
                        }}
                        />
                </div>
                <div className={styles.AddMedia}>
                    <span onClick={handleFacebook}> 
                        {loading === 'facebook'? <div className={'spinner'}> </div> 
                            :
                            <Icon name={'Facebook'} color={'white'}/> 
                        } 
                    </span>
                    <input type="text" placeholder={'Facebook...'} 
                        value={facebook} onChange={(e)=>setFacebook(e.target.value)}
                        />
                </div>
                <div className={styles.AddMedia}>
                    <span onClick={handleInstagram} style={{backgroundColor: '#e74c3c'}}> 
                        {loading === 'instagram'? <div className={'spinner'}> </div>
                            :
                            <Icon name={'Instagram'} color={'white'}/> 
                        } 
                    </span>
                    <input type="text" placeholder={'Instagram...'} 
                        value={instagram} onChange={(e)=>setInstagram(e.target.value)}
                        />
                </div>
            </div>
            {error && <p className={'Error'}> {error} </p>}
        </div>

    )
    
}
       



{/* 
                <ul className={styles.k}>
                    <Link href={center.facebook}> 
                        <li style={{backgroundColor: center.facebook === "" ? '#a9cce3' : '#2980b9'}}>
                            F
                        </li>
                    </Link>
                    <Link href={center.instagram}> 
                        <li style={{backgroundColor: center.instagram === "" ? '#f5b7b1' : '#e74c3c'}}>
                            I
                        </li>
                    </Link>
                    <Link href={center.whatsapp}> 
                        <li style={{backgroundColor: center.whatsapp === "" ? '#abebc6' : '#28b463'}}>
                            W
                        </li>
                    </Link>
                </ul> */}
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