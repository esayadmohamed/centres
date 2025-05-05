"use client";

import styles from "../uploads.module.css";
import { useRef, useState } from "react";

import { ModifyImage } from "@/_lib/listings/editdata";

import Icon from "@/_lib/utils/Icon";

export default function EditUploader({keyId, listing_id, setError, setListing}) {
    
    const [previewData, setPreviewData] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const uploaderRef = useRef();

    function handleClick() {
        if (uploaderRef.current) {
            uploaderRef.current.click();
        }
    }
     
    // console.log('listing', listing_id);

    async function handleImage (e){
        setLoading(true); 
        setError('');

        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        
        setFileData(selectedFile)

        const result = await ModifyImage(listing_id, selectedFile);
        setLoading(false);

        if (result?.error) {
            setError(result.error);
        }
        else {
            setListing(result);
            setFileData(null)
            uploaderRef.current.value = "";
        }
    }

    return (
        <div key={keyId} className={styles.EditUploadImage} style={{ backgroundImage: `url(${previewData || ""})`}}>
            <input 
                type="file" 
                accept="image/bmp, image/jpeg, image/png"
                name={`image`}
                ref={uploaderRef}
                onChange={handleImage}
                hidden
            />

            {!loading ?
                <span className={styles.UploaderCloud} onClick={handleClick}> 
                    <Icon name={'CloudUpload'} color={'#424949'}/> 
                    Sélectionner une image
                </span>
                :    
                <div className={styles.UploaderLoader}>
                    <div className={'spinner'}></div>
                    Patientez
                </div>
            }
        </div>
    );
}





// async function handleSelect(e){
//     setLoading(true); 

//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     const fileReader = new FileReader();
//     fileReader.onload = () => {
//         const fileExtension = selectedFile.name.split('.').pop();
//         const newFileName = `image_${Date.now()}.${fileExtension}`;

//         setPreviewData(fileReader.result);
//         setFileData(selectedFile)
//     };
//     fileReader.readAsDataURL(selectedFile);
//     setLoading(false)
// }

// function handleRemove() {
//     setPreviewData(null);
//     setFileData(null);
//     uploaderRef.current.value = "";
// }

// async function handleUpload() {
//     setLoading(true); 
//     setError("");

//     const result = await ModifyImage(listing_id, fileData);
//     setLoading(false);

//     if (result?.error) {
//         setError(result.error);
//     }
//     else {
//         setFileData(null)
//         uploaderRef.current.value = "";
//         Referesh();
//     }
// }

// previewData ? (
//     <span className={styles.UploaderFunctions} > 
//         <div>
//             <span onClick={handleRemove} > <Icon name={'Trash'} /> </span>
//             <p onClick={handleUpload}> <Icon name={'CloudUpload'}/> Enregistrer </p>
//         </div>
//     </span>
// ) : 