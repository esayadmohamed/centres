"use client"

import styles from "./selects.module.css";
import { useState } from "react";

import EditOffers from "./select/offers";
import EditServices from "./select/services";
import EditSubjects from "./select/subjects";
import EditLevels from "./select/levels";

import Icon from "@/_lib/utils/Icon";

export default function EditSelects({listing, setListing, offers_list, services_list, subjects_List, levels_list}) {
    
    const [index, setIndex] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    
    function handleEdit (id){
        if(!listing || Object.keys(listing).length === 0) return    
        setIndex(id===index ? null : id)
        setIsEdit(id===index ? !isEdit : true)
    }

    const selectData = [
        {name: 'Offres Spéciales', value: listing?.offers?.map((e)=> e.name).join(', '), component: <EditOffers   alloffers={offers_list}      offers={listing.offers}     listing_id={listing.id} setListing={setListing} handleEdit={()=>handleEdit(0)}/>},
        {name: 'Service Utiles', value: listing?.services?.map((e)=> e.name).join(', '), component: <EditServices allservices={services_list} services={listing.services}  listing_id={listing.id} setListing={setListing} handleEdit={()=>handleEdit(1)}/>},
        {name: 'Cours Proposés', value: listing?.subjects?.map((e)=> e.name).join(', '), component: <EditSubjects allsubjects={subjects_List}  subjects={listing.subjects} listing_id={listing.id} setListing={setListing} handleEdit={()=>handleEdit(2)}/>},
        {name: 'Niveaux Scolaires', value: listing?.levels?.map((e)=> e.name).join(', '), component: <EditLevels  allevels={levels_list}       levels={listing.levels}     listing_id={listing.id} setListing={setListing} handleEdit={()=>handleEdit(3)}/>}
    ]

    return(
        <div className={styles.EditSelects}>
            <h3> <Icon name={'Presentation'} /> Services et Matières </h3>
            
            {selectData.map((item, id)=>
                <div className={styles.EditSection} key={id}>
                    <h4> {item.name} </h4>
                    {isEdit && id===index ? item.component : <p> {item.value ? item.value : 'Non fourni'} </p>}
                    
                    <p className={styles.EditAction} onClick={()=> handleEdit(id)}>
                        {(id!==index) && "Modifier"} 
                    </p>
                </div> 
            )}

        </div>
    )
}




{/* <div className={styles.EditUpdate}>
    <h4> {item.name} </h4>
    {isEdit && id===index ? item.component : <p> {item.value ? item.value+(',  ') : 'Non fourni'} </p>}
</div> */}

{/* {isEdit && id===index ? "Annuler" : (item.value !== '' ? "Modifier" : "Ajouter")}  */}
