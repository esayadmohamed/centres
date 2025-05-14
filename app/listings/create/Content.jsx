'use client'
import Link from "next/link";
import styles from "./create.module.css";
import { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';

import { CreateListing } from "@/_lib/listings/addlisting";

import CreateName from "@/_com/create/name";
import CreateInfo from "@/_com/create/info";
import CreateLocation from "@/_com/create/location";
import CreatePhone from "@/_com/create/phone";

import Icon from "@/_lib/utils/Icon";


export default function CreateContent({cities_list, hoods_list}) {
    const router = useRouter();
    const recaptchaRef = useRef(null);

    const [errors, setErrors] = useState({})
    const [loading, SetLoading] = useState(false)

    const [name, setName] = useState('')
    const [info, setInfo] = useState('')
    const [city, setCity] = useState('') 
    const [hood, setHood] = useState('')
    const [phone, setPhone] = useState('')
    const [captchaToken, setCaptchaToken] = useState(null);

    async function CollectData (){
        SetLoading(true); setErrors({})
        const data = { name: name, info: info, phone: phone, city: city, hood: hood, captchaToken:captchaToken }

        const result = await CreateListing(data); 
        SetLoading(false)
        
        recaptchaRef.current?.reset();
        setCaptchaToken(null);

        if(result?.error){
            setErrors(result.error)  
        } else {
            router.push(`/listings/${result.center_id}`);
        }
        
    }

    return (
        <div className={styles.PageContainer}>
            <div className={styles.PageBanner}>
                <h2>Créer une Annonce</h2>  
                <ul className={styles.BannerRoot}>
                    <Link href={'/'}> <li>Acueil</li> </Link>
                    <li>/</li>
                    <Link href={'/listings'}> <li>Annonces</li> </Link>
                    <li>/</li>
                    <li>Creation</li>
                </ul>
            </div>
            <div className={styles.PageContent}>
                <div className={styles.PageForm}>
                    <CreateName name={name} setName={setName} errors={errors} />
                    <CreateInfo info={info} setInfo={setInfo} errors={errors}/>
                    <CreateLocation errors={errors} citiesList={cities_list} hoodsList={hoods_list}
                        selectedCity={city} selectedHood={hood} setSelectedCity={setCity} setSelectedHood={setHood}/>
                    <CreatePhone phone={phone} setPhone={setPhone} errors={errors}/>
                    
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        onChange={(token)=>setCaptchaToken(token)}
                    />
                    {errors?.captcha && <p className={styles.PageError}> {errors.captcha}</p> }

                    <p className={styles.PageConditions}>
                        En cliquant sur "Créer", vous acceptez 
                            <Link href={'/conditions'}> <span>les règles et conditions d'utilisation </span> </Link>
                            du site centres.ma.
                    </p> 
                    
                    {Object.keys(errors).length !== 0 && <p className={styles.PageError}>
                        {errors.server? errors.server : "Une erreur est survenue, vérifiez vos saisies."}
                    </p> }

                    <button onClick={CollectData}>  
                        {loading ? <div className={'spinner'}></div> : <span>Créer</span>}
                    </button>
                    
                </div>

                <div className={styles.PageMarketing}>
                    <div>
                        <Icon name={'Navigation2'} color={'#424949'}/>
                        <p> CENTRES </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
