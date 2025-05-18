'use client';
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

import buildMessage from "./emails";

export default function Converter() {
    
    const message = buildMessage();

    const [size, setSize] = useState('360px')
    const sizes = ['320px', '360px', '428px', '640px']

    return(
        <div className={styles.Converter}>

                <div className={styles.ConverterContent}>
                    <ul className={styles.ConverterSize}>
                        {sizes.map((item, id)=>
                            <li className={size ===item ? styles.ActiveSize : styles.InactiveSize} onClick={()=>setSize(item)} key={id}> 
                                {item}
                            </li>
                        )}
                    </ul>
                    <div className={styles.converterDisplay} style={{width: `${size}`}}
                        
                        dangerouslySetInnerHTML={{ __html: 
                            message.text
                        }} />
                </div>
            {/* } */}
        </div>
    )
    
}


                //     `
                //     <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
                //         <h3 style="font-size: 14px; font-weight: 600; color: black; background-color:#1E2026; color:white;height: 40px; display: flex; justify-content: center; align-items: center;">
                //             CENTRES
                //         </h3>    
                //         <div style="
                //             max-width: 600px; 
                //             text-align: left; 
                //             margin: 0 auto; 
                //             background-color: white; 
                //             padding: 10px; 
                //             border-radius: 0px; 
                //             border: 1px solid #ccd1d1;
                //             ">
   
                //             <p style="
                //                 font-size: 14px; 
                //                 font-weight: 600;
                //                 color: #424949; 
                //                 margin: 0; 
                //                 padding: 10px;
                //                 text-align: center;
                //                 background: linear-gradient(90deg, #FFD700, #FFC107);
                //                 ">
                //                 🚀 Boostez la visibilité de votre centre gratuitement.
                //             </p>

                //             <p style="
                //                 font-size: 14px; 
                //                 color: black; 
                //                 vertical-align: middle; 
                //                 padding: 10px;
                //                 text-align: left;
                //                 // background-color:#1E2026;
                //                 ">
                //                 Vous souhaitez attirer plus de clients et faire connaître votre centre au grand public ? Rejoignez dès maintenant 
                //                 <a href="https://www.centres.ma/" style="text-decoration: underline;">
                //                     centres.ma</a>, 
                //                 la plateforme leader pour la découverte des centres de soutiens au Maroc.
                //             </p>

                //             <ul style="
                //                 font-size: 14px; 
                //                 color: black; 
                //                 // background-color:#1E2026;
                //                 text-align: left;
                            
                //                 display: flex; 
                //                 flex-direction: column;
                //                 justify-content: flex-left; 
                //                 align-items: flex-left;
                //                 gap:5px;
                //                 padding: 10px; 
                //                 ">
                //                 <li> ✅ Inscription facile et rapide </li>
                //                 <li> ✅ Visibilité gratuite et ciblée </li>
                //                 <li> ✅ Connectez-vous à une large audience locale </li>
                //             </ul>

                //             <p style="
                //                 font-size: 14px; 
                //                 color: black; 
                //                 vertical-align: middle; 
                //                 padding: 10px;
                //                 text-align: left;
                //                 ">
                //                 Ne manquez pas cette opportunité unique d’élargir votre clientèle sans frais!
                //             </p>

                //             <p style="
                //                 display:flex;
                //                 padding: 10px;
                //                 ">
                //                 <a 
                //                     href="https://www.centres.ma/"    
                //                     style="
                //                         display:flex;
                //                         align-items: center;
                //                         font-size: 14px; 
                //                         height: 35px;
                //                         width: fit-content;
                //                         padding: 0 20px;
                //                         text-align: left;
                //                         color: white; 
                //                         background-color: #2980b9;
                //                         border-radius: 5px;
                //                     ">
                //                     Rejoignez-nous
                //                 </a>
                //             </p>

                //             <p style="
                //                 font-size: 14px; 
                //                 color: black; 
                //                 vertical-align: middle; 
                //                 padding: 10px;
                //                 text-align: left;
                //                 ">
                //                 À très bientôt,
                //             </p>

                //             <ul style="
                //                 font-size: 12px; 
                //                 color: black; 
                //                 vertical-align: middle; 
                                
                //                 background-color: #f2f3f4;

                //                 display: flex; 
                //                 flex-direction: column;
                //                 justify-content: center; 
                //                 align-items: center;
                //                 gap:5px;
                //                 padding: 10px; 
                //                 ">
                //                 <li style="color: #2471a3; text-decoration: underline;">
                //                     <a href="https://www.centres.ma/"> www.centres.ma </a>
                //                 </li>
                //                 <li style="color:#424949;"> @2025, Tous droits reserves </li>
                //                 <li style="color:#424949;"> 
                //                     Pour ne plus recevoir cet email, 
                //                     <a href="https://www.centres.ma/" style="text-decoration: underline;"> unsubscribe </a>
                //                 </li>
                //             </ul>
                    
                //         </div>
                //     </div>
                // `




                    // <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
                    //     <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                    
                    //         <h2 style="color: #2e86c1; font-weight: bold; margin-bottom: 20px;">Centres Maroc</h2>
                    //         <p style="font-size: 16px; margin-bottom: 20px;">Merci de vous être inscrit sur Centres !</p>
                    //         <p style="font-size: 16px; margin-bottom: 20px;">Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
                    //         <p>
    
                    //         </p>
                    //         <p style="font-size: 14px; color: #666; margin-top: 20px;">Ce lien expirera dans 60 minutes.</p>
                    //         <p style="font-size: 14px; color: #666;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
                            
                    //         <div style="font-size: 14px; background-color: #273746; height: 100px; width: 100%; display: table; text-align: center;">
                    //             <div style="display: table-row;">
                    //                 <p style="font-size: 14px; color: #2e86c1; display: table-cell; vertical-align: middle; margin: 0;">
                                    // <a href="https://www.centres.ma/" style="color: #2e86c1; text-decoration: none;">
                                    //     www.centres.ma
                                    // </a>
                    //                 </p>
                    //             </div>
                                // <div style="display: table-row;">
                                //     <p style="font-size: 14px; color: white; display: table-cell; vertical-align: middle; margin: 0;">
                                //     Copyright © 2024 PingCAP Inc. All Rights Reserved.
                                //     </p>
                                // </div>
                    //         </div>
                    //     </div>
                    // </div>




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