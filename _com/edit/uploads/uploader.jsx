"use client";

import styles from "../uploads.module.css";
import { useRef, useState } from "react";

import Icon from "@/_lib/utils/Icon";

export default function EditUploader({keyId, listing_id, setError, setListing, loading, setLoading, index, setIndex}) {
    
    const uploaderRef = useRef();

    function handleClick() {
        if(loading) return
        if (uploaderRef.current) {
            uploaderRef.current.click();
        }
    }
       
    const handleUpload = async (e) => {
        setLoading(true); 
        setIndex(keyId)

        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
    
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('id', listing_id);
    
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
    
        const data = await res.json();
        
        uploaderRef.current.value = "";
        setLoading(false); 

        if(data?.error){
            setError(data.error)
        } else{
            setListing(data.listings);
        }

    };

    return (
        <div key={keyId} className={styles.EditUploadImage}>
            <input 
                type="file" 
                accept="image/bmp, image/jpeg, image/png"
                name={`image`}
                ref={uploaderRef}
                onChange={handleUpload}
                hidden
            />

            {(loading && index === keyId)?
                <div className={styles.UploaderLoader}>
                    <div className={'spinner'}></div>
                </div>
                :
                <span className={styles.UploaderCloud} onClick={handleClick}> 
                    <Icon name={'CloudUpload'} color={'#424949'}/> 
                </span>
            }
        </div>
    );
}












    // async function handleImage (e){
    //     setLoading(true); 
    //     setError('');

    //     const selectedFile = e.target.files[0];
    //     if (!selectedFile) return;
        
    //     setFileData(selectedFile)

    //     const result = await ModifyImage(listing_id, selectedFile);
    //     setLoading(false);

    //     if (result?.error) {
    //         setError(result.error);
    //     }
    //     else {
    //         setListing(result);
    //         setFileData(null)
    //         uploaderRef.current.value = "";
    //     }
    // }

    // {
    //     "asset_id": "051b4edf0e9539084fcf7ab29915dbab",
    //     "public_id": "e6tvtn75zwn9nqaczeif",
    //     "version": 1746453216,
    //     "version_id": "3791f76eed6dc717d31437d7ae10e3ac",
    //     "signature": "218d6e30df3a867da874f7904ccf28b2e7405886",
    //     "width": 548,
    //     "height": 391,
    //     "format": "png",
    //     "resource_type": "image",
    //     "created_at": "2025-05-05T13:53:36Z",
    //     "tags": [],
    //     "bytes": 432850,
    //     "type": "upload",
    //     "etag": "17a38626fb4495925c1fc0d7db39ea32",
    //     "placeholder": false,
    //     "url": "http://res.cloudinary.com/deywqqypb/image/upload/v1746453216/e6tvtn75zwn9nqaczeif.png",
    //     "secure_url": "https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/e6tvtn75zwn9nqaczeif.png",
    //     "asset_folder": "",
    //     "display_name": "e6tvtn75zwn9nqaczeif",
    //     "original_filename": "file",
    //     "api_key": "469145298481287"
    // }




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