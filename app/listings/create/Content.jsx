'use client'
import Link from "next/link";
import styles from "./create.module.css";
import { useState } from "react";
import { useRouter } from 'next/navigation';

import { CreateListing } from "@/_lib/listings/addlisting";

import CreateName from "@/_com/create/name";
import CreateInfo from "@/_com/create/info";
import CreateLocation from "@/_com/create/location";
import CreatePhone from "@/_com/create/phone";
import Approval from "@/_com/create/approval";


export default function CreateContent({cities_list, hoods_list}) {
    const router = useRouter();

    const [errors, setErrors] = useState({})
    const [loading, SetLoading] = useState(false)

    const [name, setName] = useState('')
    const [info, setInfo] = useState('')
    const [city, setCity] = useState('') 
    const [hood, setHood] = useState('')
    const [phone, setPhone] = useState('')

    async function CollectData (){
        SetLoading(true); setErrors({})
        const data = { name: name, info: info, phone: phone, city: city, hood: hood }

        const result = await CreateListing(data); 
        SetLoading(false)
        
        // console.log(result);

        if(result?.error){
            setErrors(result.error)  
        } else {
            router.push(`/listings/${result.center_id}`);
        }
        
    }

    return (
        <div className={styles.CreateContent}>
            <div className={styles.ListingBanner}>
                <h2>Créer une Annonce</h2>  
                <ul className={styles.AuthRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <Link href={'/listings'}> <li>Annonces</li> </Link>
                    <li>/</li>
                    <li>Creation</li>
                </ul>
            </div>
            
            <div className={styles.CreateForm}>
                <CreateName name={name} setName={setName} errors={errors} />
                <CreateInfo info={info} setInfo={setInfo} errors={errors}/>
                <CreateLocation errors={errors} citiesList={cities_list} hoodsList={hoods_list}
                    selectedCity={city} selectedHood={hood} setSelectedCity={setCity} setSelectedHood={setHood}/>
                <CreatePhone phone={phone} setPhone={setPhone} errors={errors}/>
                <Approval />
                
                {Object.keys(errors).length !== 0 && <p className={styles.CreateError}>
                    {errors.server? errors.server : "Une erreur est survenue, vérifiez vos saisies."}
                </p> }
                
                <button onClick={CollectData}>  
                    {loading ? <div className={'spinner'}></div> : <span>Suivant</span>}
                </button>
                
            </div>
        </div>
    )
}
