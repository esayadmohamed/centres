'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

import { sendEmail } from "@/_lib/dashboard/actions";
import { buildMessage } from "./emails";

export default function Send({}) {
    
    const email = buildMessage();
    const emails = ['esayadmohamed@gmail.com', 'esayadbusiness@gmail.com']

    const [loading, setLoadng] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSend(){
        setMessage('');
        setLoadng(true);

        const result = await sendEmail(emails);
        setLoadng(false);
        
        setMessage(result.message)

    }

    return(
        <div className={styles.Send}>
            <div className={styles.SendContent}>
                <div>
                    [no data]
                </div>
                <div className={styles.SendDisplay}>
                    <div className={styles.SendDisplayEmail } dangerouslySetInnerHTML={{ __html:  email.text }} />
                </div>
            </div>

            {message && <p className={styles.Message} > {message} </p>}

            <button onClick={handleSend}>
                {loading ?
                <div className={'spinner'}> </div>
                :
                <span>
                    <Icon name={'Send'} color={'white'}/> Send
                </span>
                }
            </button>
        </div>
    )
    
}



// const [select, setSelect] = useState(emails[0].subject.slice(0, 30))
// const [toggle, setToggle] = useState(false)
    // function handleEmails(id){
//     setIndex(id);
//     setSelect(`${id+1}- ${emails[id].subject.slice(0, 40)}`);
//     setToggle(false)
// }

{/* <div className={styles.SendDisplayList} onMouseLeave={()=>setToggle(false)}>
    <div>
        <p> {select} </p>
        <span onClick={()=>setToggle(!toggle)}> <Icon name={toggle? 'ChevronUp' : 'ChevronDown'}/> </span>
    </div>
    {toggle && 
        <ul>
            {emails.map((item, id)=>
                <li key={id} onClick={()=>handleEmails(id)}> {id+1}- {item.subject.slice(0, 40)} ... </li>
            )}
        </ul>
    }
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