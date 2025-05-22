'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useEffect, useState } from "react";
import { RemoveCenter, ChangeStatus } from "@/_lib/dashboard/editdata";
import { allEmails } from "@/_lib/dashboard/getdata";

import Icon from "@/_lib/utils/Icon";
import Link from "next/link";

import CenterMedia from "./addmedia";
import CenterNote from "./addnote";

export default function MarketingContent({center, setCenter, setCenters}) {
        
    const [notes, setNotes] = useState([])
    const [emailsList, setEmailsList] = useState([])

    useEffect(()=>{
        setNotes(center?.notes);
    }, [center])

    const [toggle, setToggle] = useState(null)
    const [ok, setOk] = useState(false)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState('')

    function handleToggle(value){
        setCenter(null)
        setToggle(value)
    }

    async function handleRemove(){
        setLoading('remove');
        setError('');

        const result = await RemoveCenter(center.id);
        setLoading(false);
        
        if(result?.error){
            setError(result.error)
        }else{
            setCenter(null)
            setCenters(result)
            setOk(false)
        }
    }

    async function handleStaus(){
        setLoading('status');
        setError('');

        const result = await ChangeStatus(center.id);
        setLoading(false);
        
        if(result?.error){
            setError(result.error)
        }else{
            setCenter(result.find(item => item.id === center.id));
            setCenters(result)
        }
    }

    async function getEmails(){
        setLoading('send');

        const result = await allEmails();
        // console.log(result);

        setEmailsList(result)
        handleToggle('send')
        setLoading(false);
    }

    if(!center) return <div className={styles.CenterContent}> </div>
    else return(
        <div className={styles.CenterContent} >
            <div className={styles.CenterHeader}>
                <div className={styles.CenterName}> 
                    <span onClick={handleStaus}> 
                        {loading === 'status' ? 
                            <div className={'spinner'}> </div>
                            :
                            <Icon name={center.status === 1 ? 'Check' : 'X'} 
                                color={center.status === 1 ? '#28b463' : '#e74c3c'} />
                        }
                    </span>
                    {center.name}, {center.city} 
                </div>
                <div className={styles.CenterLinks}>
                    {center?.whatsapp !== '' && 
                        <Link href={`https://wa.me/${center.whatsapp}`} target="_blank" rel="noopener noreferrer">
                            <p style={{backgroundColor: '#28b463'}}>
                                <Icon name={'Phone'} color={'white'}/>
                            </p>
                        </Link>
                    }
                    {center?.facebook !== '' && 
                        <Link href={center.facebook} target="_blank" rel="noopener noreferrer">
                            <p style={{backgroundColor: '#2471a3'}}>
                                <Icon name={'Facebook'} color={'white'}/>
                            </p>
                        </Link>
                    }
                    {center?.instagram !== '' && 
                        <Link href={center.instagram} target="_blank" rel="noopener noreferrer">
                            <p style={{backgroundColor: '#e74c3c'}}>
                                <Icon name={'Instagram'} color={'white'}/>
                            </p>
                        </Link>
                    }
                </div>
                <div className={styles.CenterRemove}>
                    {ok?
                        loading === 'remove' ? 
                            <div className={'spinner'}> </div>
                            :
                            <>
                                <p style={{backgroundColor: '#ccd1d1'}} onClick={handleRemove}> 
                                    <Icon name={'Minus'} color={'#424949'}/> 
                                </p>
                                <p style={{backgroundColor: '#28b463', width:'50px'}} onClick={()=>setOk(false)}>  
                                    <Icon name={'X'} color={'white'}/> 
                                </p>
                            </>
                        : 
                        <p style={{backgroundColor: '#e74c3c'}} onClick={()=>setOk(true)}> 
                            <Icon name={'Minus'} color={'white'}/> 
                        </p>
                    }
                </div>

            </div>
            <div className={styles.CenterBody}>
                
                <CenterMedia center={center} setCenter={setCenter}/>

                <CenterNote notes={notes} setNotes={setNotes} center_id={center?.id}/>
                
            </div>
        </div>
    )
    
}



            // <div className={styles.CentersAction}>
            //     <p>Centers</p>
            //     <div className={styles.CentersActionToggle}>
            //         <span style={{backgroundColor: '#2471a3'}} onClick={()=>handleToggle('converter')}> 
            //             <Icon name={'LoaderCircle'} color={'white'}/> 
            //         </span>
            //     </div>
            // </div>


            // {center? 
            //     <div className={styles.CentersBody}>
            //         <div className={styles.CenterHeader}>

            //             <div className={styles.CenterName}> 
            //                 <span onClick={handleStaus}> 
            //                     {loading === 'status' ? 
            //                         <div className={'spinner'}> </div>
            //                         :
            //                         <Icon name={center.status === 1 ? 'Check' : 'X'} 
            //                             color={center.status === 1 ? '#28b463' : '#e74c3c'} />
            //                     }
            //                 </span>
            //                 {center.name}, {center.city} 
            //             </div>
                        
            //             <div className={styles.CenterRemove}>
            //                 {ok?
            //                     loading === 'remove' ? 
            //                         <div className={'spinner'}> </div>
            //                         :
            //                         <>
            //                             <p style={{backgroundColor: '#ccd1d1'}} onClick={handleRemove}> 
            //                                 <Icon name={'Minus'} color={'#424949'}/> 
            //                             </p>
            //                             <p style={{backgroundColor: '#28b463', width:'50px'}} onClick={()=>setOk(false)}>  
            //                                 <Icon name={'X'} color={'white'}/> 
            //                             </p>
            //                         </>
            //                     : 
            //                     <p style={{backgroundColor: '#e74c3c'}} onClick={()=>setOk(true)}> 
            //                         <Icon name={'Minus'} color={'white'}/> 
            //                     </p>
            //                 }
            //             </div>
            //         </div>

            //         {error && <p className={styles.CenterError}> {error} </p>}
                    
            //         <CenterMedia emails={emails} setEmails={setEmails} center_id={center?.id}/>

            //         <CenterEmail emails={emails} setEmails={setEmails} center_id={center?.id}/>

            //         <CenterNumber numbers={numbers} setNumbers={setNumbers} center_id={center?.id}/>

            //         <CenterNote notes={notes} setNotes={setNotes} center_id={center?.id}/>
            //     </div>
            //     :
            //         toggle === 'converter' ?
            //             <Converter/>    
            //             :
            //         toggle === 'send' ?
            //             <Send emailsList={emailsList}/>
            //         :
            //             <div className={styles.CentersEmpty}>
            //                 [no data]
            //             </div>
            // }
  



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