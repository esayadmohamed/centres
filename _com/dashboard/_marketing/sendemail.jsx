'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

import { sendEmail } from "@/_lib/dashboard/actions";
import { buildMessage } from "./emails";

export default function Send({emailsList}) {
    
    const emailData = buildMessage();
    const [emails, setEmails] = useState([])

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    async function handleSend() {
        if(emails.length === 0) return
        setMessage('');
        setError('');
        setLoading(true);

        const failedEmails = [];
        let id = 1;

        for (const email of emails) {
            setMessage(`(${id}/${emails.length}) Emailing: ${email}`);
            const result = await sendEmail(email);

            if (result?.error) {
                failedEmails.push(email);
            }
            id++;
        }

        setLoading(false);

        if (failedEmails.length > 0) {
            setMessage(`Finished sending emails. Failed to contact: ${failedEmails.join(', ')}`);
            setError(`Failed to send emails to ${failedEmails.length}`);
        } else {
            setMessage("Marketing emails were sent successfully to all addresses.");
            setError(null);
        }
    }

    // -----------------------------------------

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(emailsList.length / itemsPerPage);
    
    function goToPreviousPage() {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }

    function goToNextPage() {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = emailsList.slice(startIndex, startIndex + itemsPerPage);

    // -----------------------------------------

    function handleCheck(email){

        if(emails.includes(email)){
            setEmails(emails.filter(e => e !== email));
        } else{
            setEmails([...emails, email]);
        }

    }

    return(
        <div className={styles.Send}>
            <div className={styles.SendContent}>
                <ul className={styles.SendList}>

                    <div className={styles.CentersListNavigate}>
                        <span onClick={goToPreviousPage}> <Icon name={'ChevronLeft'} color={'white'}/> </span>
                        <p> {currentPage} / {totalPages} </p>
                        <span onClick={goToNextPage}> <Icon name={'ChevronRight'} color={'white'}/> </span>
                    </div>
                    <div className={styles.CentersListActions}>
                        <p>
                            <span onClick={()=>setEmails(currentItems.map((value)=>value.email))}>Select all</span>
                            <span onClick={()=>setEmails([])}>Select none</span>
                        </p>
                        <p>{emails.length} / {emailsList.length}</p>
                    </div>
                    {currentItems?.slice(0,10).map((item, id)=>
                        <li key={id} onClick={()=> handleCheck(item.email)}> 
                            {emails.includes(item.email) ?
                                <span> <Icon name={'SquareCheck'} color={'#2471a3'}/> </span>
                                :
                                <span> <Icon name={'Square'} color={'#424949'}/> </span>
                                }
                            {item.email} 
                        </li>
                    )}

                </ul>
                <div className={styles.SendDisplay}>
                    <div className={styles.SendDisplayEmail } dangerouslySetInnerHTML={{ __html:  emailData.text }} />
                </div>
            </div>

            {message && <p className={styles.Message} > {message} </p>}
            {error && <p className={styles.Error} > {error} </p>}

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





    // async function handleSend(){
    //     setMessage('');
    //     setLoading(true);

    //     let id = 1;
    //     for (const email of emails) {
    //         setMessage(`(${id}/${emails.length}) Emailing: ${email}`)
    //         const result = await sendEmail(email);
    //         if(result?.error){
    //             setError(result?.error);
    //             setMessage('');
    //         }
    //         id++;
    //     }

    //     setLoading(false);
    //     setMessage("Marketing emails were sent successfully");
    // }

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