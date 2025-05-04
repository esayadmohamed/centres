'user client'

import Link from 'next/link';
import styles from './style.module.css'

import { useState } from 'react';

import { AddReview } from '@/_lib/center/editdata';

import { Star } from "lucide-react";

export default function SpecsReviews ({center_id, ReviewsList, isReviewed, isAuthenticated}){

    const [reviewed, setReviewed] = useState(isReviewed)

    const categoryMap = {
        "Valeur": "value",
        "Propreté": "cleanliness",
        "Communication": "communication",
        "Emplacement": "location"
    };

    const [ratings, setRatings] = useState({
        listing_id: center_id,
        value: 1,
        cleanliness: 1,
        communication: 1,
        location: 1
    });

    const handleRatingChange = (category, newValue) => {
        const key = categoryMap[category]; 
        if (key) {
            setRatings(prev => ({
                ...prev,
                [key]: newValue
            }));
        }
    };
    
    const renderStars = (category, rating) => (
        Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                fill={rating >= index + 1 ? "#f39c12" : "none"}
                onClick={() => handleRatingChange(category, index + 1)}
            />
        ))
    );

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSucess] = useState('')

    async function handleSubmit (){
        setLoading(true)
        const result = await AddReview(ratings)
        setLoading(false)

        if(result?.error){
            setError(result.error)
        } else{
            setSucess(result.success) 
            setReviewed(true)      
        }
    }

    return (
        <div className={`${styles.SpecsReviews} `}>
            <h4>Donnez votre avis</h4>
            {!isAuthenticated? 
                <div className={styles.SpecsReviewsNotice}>
                    <p>Vous devez avoir un compte pour partager votre avis. <Link href={'/auth'}><span>Connectez-vous</span></Link> </p>
                </div>
                :
                !reviewed ?
                    <ul className={styles.SpecsRatings}>
                        {ReviewsList.slice(1, 5).map((item, id) =>
                            <li key={id}>
                                <span>{renderStars(item.name, ratings[categoryMap[item.name]])}</span>
                                {item.name}
                            </li>
                        )}
                        {error && <p className={styles.EditError}> {error}</p> }
                        <button onClick={handleSubmit}> 
                            {loading ? <div className={'spinner'}></div > : <span> Partager </span>} 
                        </button>
                    </ul>
                    :
                    <div>
                        {success ? 
                        <p>{success}</p>
                        :
                        <p>Vous avez déjà partagé votre avis sur ce centre.</p>
                        }
                </div>
            }
        </div>
    )
}





                {/* <li> 
                    <span>{renderStars("value", ratings.value)}</span>
                    Value
                </li>
                <li> 
                    <span>{renderStars("cleanliness", ratings.cleanliness)}</span>
                    Cleaniliness 
                </li>
                <li> 
                    <span>{renderStars("communication", ratings.communication)}</span>
                    Communication 
                </li>
                <li> 
                    <span>{renderStars("location", ratings.location)}</span>
                    Location 
                </li> */}



    // const stars = [
    //     <Star fill={value >= 0?'#f39c12':'none'}/>, 
    //     <Star fill={value > 0?'#f39c12':'none'}/>,
    //     <Star fill={value > 1?'#f39c12':'none'}/>,
    //     <Star fill={value > 2?'#f39c12':'none'}/>,
    //     <Star fill={value > 3?'#f39c12':'none'}/>
    // ]
    //  {/* <span> {stars.map((item, id)=> <span key={id} onClick={()=> setValue(id)}>{item}</span>)} </span> */}



                {/*  */}