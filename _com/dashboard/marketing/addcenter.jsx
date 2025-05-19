'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useState } from "react";
import { CreateCenter } from "@/_lib/dashboard/editdata";

import Icon from "@/_lib/utils/Icon";

export default function AddCenter({citiesList, setCenters, setCenter}) {
    
    const [cities, setCities] = useState(citiesList || [])

    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [loading, setLoading] = useState(false) 
    const [error, setError] = useState('')
    const [toggle, setToggle] = useState(false)

    async function handleCenter(){
        setLoading(true)
        setError('')

        const center={name: name, city:city}

        const result = await CreateCenter(center)
        setLoading(false)
        // console.log(result);

        if(result?.error){
            setError(result.error)
        } else{
            setCenters(result)
            setCenter(result.filter(center => center.name === name)[0])
            setName('')
            setCity('')
        }
    }

    function handleSearch(e){
        const inputValue = e.target.value;
        
        setCity(inputValue);
        
        const filteredValues = citiesList.filter(value =>
            value.toLowerCase().includes(inputValue.toLowerCase())
        )
        setCities(filteredValues);
    }

    function handleSelect(item){
        setCity(item)
        setToggle(false)
    }


    return(
        <div className={styles.DashAdd} onMouseLeave={()=>setToggle(false)}>
            <input type="text" value={name} placeholder="Name" onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder="City" 
                value={city}
                onChange={handleSearch} 
                onFocus={()=>setToggle(true)}
                />
            {toggle && 
                <ul>
                    {cities.slice(0, 7).map((item, id)=>
                        <li key={id} onClick={()=>handleSelect(item)}>{item}</li>
                    )}
                    {cities.length === 0 && <li>No cities</li>} 
                </ul>
            }
            
            {error && <p className={'Error'}> {error} </p>}

            <button onClick={handleCenter}> 
                {loading? 
                    <div className={'spinner'}></div> 
                    :
                    <Icon name={'Plus'} color={'white'}/>
                }
            </button>
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