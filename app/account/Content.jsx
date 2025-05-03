"use client"
import styles from "./account.module.css";

import { useState } from "react";

import EditName from "./edit/name";
import EditPhone from "./edit/phone";
import EditPassword from "./edit/password";
import EditActive from "./edit/terminate";


export default function AccountContent({userData}) {
    
    const [user, setUser] = useState(userData || {})
    const [index, setIndex] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const member = [
        {name: 'Prénom', value: user.name, component: <EditName close={()=>setIndex(null)} setUser={setUser}/>},
        {name: 'Adresse e-mail', value: user.email},
        {name: 'Numéro de téléphone', value: user.number, component: <EditPhone close={()=>setIndex(null)} setUser={setUser}/> },
        {name: 'Mot de passe', value: '********', component: <EditPassword close={()=>setIndex(null)}/>}
    ]

    function handleEdit (id){
      setIndex(id)
      setIsEdit(id===index ? !isEdit : true)
    }

    return (
        <div className={styles.AccountContent}>

            <div className={styles.AccountInfo}>

                {member.map((item, id)=>
                    <div className={styles.AccountInfoBox} key={id}>
                        <h4> {item?.name} </h4>
                        
                        {id===index ? item.component : <p> {item.value ? item.value : 'Non fourni'} </p>}

                        { item.name !== 'Adresse e-mail' && (id!==index)  && 
                            <p className={styles.AccountEdit} onClick={()=> handleEdit(id)}>
                                Modifier
                            </p>
                        } 

                    </div> 
                )}
 
                <EditActive />
        
            </div>


            <div className={styles.AccountTips}>
              right box
            </div>

        </div>
    )
}


{/* <div className={styles.AccountUpdate}>
<h4> {item.name} </h4>
{isEdit && id===index ? item.component : <p> {item.value ? item.value : 'Non fourni'} </p>}
</div>
<p className={styles.AccountEdit} onClick={()=> handleEdit(id)}>
{
    item.name !== 'Adresse e-mail'
    ? (isEdit && id===index) ? "Annuler" : (item.value !== '' ? "Modifier" : "Ajouter")
    : <span></span> 
}   
</p> */}