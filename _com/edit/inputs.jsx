"use client"
import styles from "./input.module.css";
import { useState } from "react";

import EditInfo from "./input/info";
import EditPhone from "./input/phone";
import EditHood from "./input/hood";

import Icon from "@/_lib/utils/Icon";

export default function EditInputs({listing, newhood, setListing}) {
        
    const [index, setIndex] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const InputData = [
        {name: 'Nom de centre', value: listing.name},
        {name: 'Description', value: listing.info, component: <EditInfo listing={listing} handleEdit={()=>handleEdit(1)} setListing={setListing}/>}, 
        {name: 'Numéro de téléphone', value: listing.phone, component: <EditPhone listing={listing} handleEdit={()=>handleEdit(2)} setListing={setListing}/>},
        {name: 'Emplacement', value:  `${listing.city}, ${listing.hood}`},
    ]

    function handleEdit (id){
        if(!listing || Object.keys(listing).length === 0) return    
        setIndex(id===index ? null : id)
        setIsEdit(id===index ? !isEdit : true)
    }

    return(
        <div className={styles.EditInputs}>
            <h3> <Icon name={'House'} /> Informations Générales </h3>

            {InputData.map((item, id)=>
                <div className={styles.EditSection} key={id}>  
                    <h4> {item.name} </h4>
                    {isEdit && id===index ? item.component : <p> {item.value ? item.value : 'Non fourni'} </p>}
                    { [1,2].includes(id) && 
                    <p className={styles.EditAction} onClick={()=> handleEdit(id)}>
                        {(id!==index) && "Modifier"} 
                    </p> }
                </div>
            )} 

            {(listing.hood === 'Autre quartier' && newhood.length === 0) && //
                <div className={styles.EditSection}>
                    <h4> Specifiez votre quartier </h4>
                    <EditHood listing_id={listing.id} setListing={setListing}/>
                </div>
            } 
        </div>
    )
}




                    {/* <div className={styles.EditUpdate}> */}
                        {/* <div className={styles.UpdateHeader}> */}
                            
                        {/* </div> */}
                        {/* {isEdit && id===index ? item.component : <p> {item.value ? item.value : 'Non fourni'} </p>} */}
                        {/* <div></div> */}
{/* <div className={styles.EditSection} key={id}>
                    
<div className={styles.EditUpdate}>
    <div className={styles.UpdateHeader}>
        <h4> {item.name} </h4>
        <p>Modifier</p>
    </div>
    {isEdit && id===index ? item.component : <p> {item.value ? item.value : 'Non fourni'} </p>}
</div>
{ [1,4].includes(id) && 
<p className={styles.EditActions} onClick={()=> handleEdit(id)}>
    {isEdit && id===index ? "Annuler" : (item.value !== '' ? "Modifier" : "Ajouter")} 
</p> }
</div>  */}

{/* {isEdit && id===index ? "Annuler" : (item.value !== '' ? "Modifier" : "Ajouter")}  */}
