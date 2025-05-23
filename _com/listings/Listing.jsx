"use client"
import styles from './style.module.css'
import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import { removeListing, toggleListing } from "@/_lib/listings/editlisting";

import defaultImage from '@/_upl/development/default.png'
import Icon from "@/_lib/utils/Icon";


export default function Listing ({listing, setListing}){
    
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(false); 
    const [isOk, setIsOk] = useState(false); 
    const [error, setError] = useState(''); 
    
    const [currentImage, setCurrentImage] = useState(
        `https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${listing.images[0]}`
    )
        
    useEffect(()=>{
        const newImage = new window.Image(); 
        newImage.src = `https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${listing.images[0]}`;
        newImage.onload = () => {
            setCurrentImage(newImage.src);
            setLoading(false);
        };
        newImage.onerror = () => {
            setLoading(false);
        };
    },[listing])

    // -------------------------------------------------------

    const rate = [10, 20, 40, 60, 80][listing?.draft] || 10; //listing.draft
      
    async function handleRemove(index){
        setLoading(true); 
        setError('');
        
        const payload = {
            images: listing.images,
            id: index,
        };
        const res = await fetch('/api/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        // console.log(data);
        

        setIsOk(false)
        setLoading(false);
        setView(false)

        if(data?.error){
            setError(data.error)
        } else{ 
            setListing(data.listings);
        }; 

    }

    async function handleEdit(index){
        router.push(`/listings/${index}`)
    }

    async function handleToggle(index){
        setLoading(true); 
        setError('');
        setView(false)

        const result = await toggleListing(index)
        setLoading(false)

        if (result.error) {
            setError(result.error)
        }
        else {
            setListing(result)
            setError('');
        } 
    }

    // console.log(listing);
        

    return (
        <main className={styles.Listing} >
            
            <div className={styles.ListingVisual} style={{ backgroundImage: listing.images.length !== 0
                ? `url('${currentImage}')` : `url('${defaultImage.src}')` }}>
                
                {!loading?
                    !isOk ?
                        <div className={styles.ListingActions}
                            onMouseLeave={()=>setView(false)}
                            >
                            <div className={styles.ActionsToggle}>
                                <span onClick={()=>setView(!view)}> <Icon name={'Menu'} color={'#424949'} /> </span>
                                <ul style={{display: view? 'flex' : 'none'}}>
                                    <li onClick={()=>handleToggle(listing.id)} style={{display: listing.state === 'on' ? 'flex' : 'none'}}> 
                                        { listing.view === 'on' ? 
                                            <>  <Icon name={'Eye'} color={'#424949'} /> visible </> 
                                            : 
                                            <> <Icon name={'EyeOff'} color={'#424949'} /> invisible </> 
                                        } 
                                    </li>
                                    <li onClick={()=> handleEdit(listing.id)} style={{display: !['under', 'off'].includes(listing.state) ? 'flex' : 'none'}}> 
                                        <Icon name={'Pencil'} color={'#424949'} /> Modifier 
                                    </li>
                                    <li onClick={()=> setIsOk(true)}>
                                        <Icon name={'Trash2'} color={'#424949'} /> Supprimer
                                    </li>
                                </ul>
                            </div>
                            {listing.draft !== 5 ? 
                                <div className={styles.ActionsRate} onClick={()=> handleEdit(listing.id)}>
                                    <p> {rate}% Complété</p>
                                    <div> 
                                        <div style={{width: `${rate}%`}}></div>
                                    </div>                                
                                </div>
                                : 
                                listing.state !== 'on' ? 
                                    <div className={styles.Status}>
                                        {
                                            listing.state === 'none' ? 
                                                <>
                                                <span style={{backgroundColor: '#2471a3'}}> <Icon name={'Send'} color={'white'}/> </span>
                                                <p onClick={()=> handleEdit(listing.id)}> Annonce non publiée </p>
                                                </>    
                                            : 
                                            listing.state === 'under' ? 
                                                <>
                                                <span style={{backgroundColor: '#2471a3'}}> <Icon name={'Ellipsis'} color={'white'}/> </span>
                                                <p> En cours de vérification </p>
                                                </>
                                            :
                                            listing.state === 'off' && 
                                                <>
                                                <span style={{backgroundColor: '#e74c3c'}}> <Icon name={'X'} color={'white'}/> </span>
                                                <p> Annonce rejetée </p>
                                                </>
                                        }
                                    </div>
                                    :
                                    <div className={styles.Status}>
                                        <span style={{backgroundColor: '#2ecc71'}}>
                                            <Icon name={'Check'} color={'white'}/>
                                        </span>
                                        <p>
                                            L'annonce est en ligne.
                                        </p>   
                                    </div>                                 
                                    // <div className={styles.Boost}>
                                    //     <span>
                                    //         <Icon name={'Rocket'} color={'white'}/>
                                    //     </span>
                                    //     <p>
                                    //         Renouveler l'annonce
                                    //     </p>   
                                    // </div>
                            }
                        </div>
                        :
                        <div className={styles.Confirmation}> 
                            <Icon name={'CircleX'} color={'white'}/>
                            <p> Voulez-vous vraiment supprimer cette annonce? </p>
                            <span>
                                <button onClick={()=> setIsOk(false)}> Annuler </button>
                                <button onClick={()=>handleRemove(listing.id)}> Suprimer </button>
                            </span>
                        </div>
                    :
                    <div className={styles.ListingLoader} >
                        <div className={styles.Spinner}> </div>
                    </div>
                }
            </div>
            
            <div className={styles.CentreDetails}>
                <div>
                    <p> {listing.hood}, {listing.city} </p>
                    <p>
                        <Icon name={'Star'} />
                        <span> {listing.overall ? listing.overall.toFixed(1) : "Nouveau"} </span>
                    </p>
                </div>
                <p> {listing.name} </p> 
            </div>
        </main>
    )
} 



// useEffect(()=>{
//     const newImage = new window.Image(); 
//     newImage.src = `/api/images/listings/${listing.images[0]}`;
//     newImage.onload = () => {
//         setCurrentImage(newImage.src);
//         setLoading(false);
//     };
//     newImage.onerror = () => {
//         setLoading(false);
//     };
// },[listing])
