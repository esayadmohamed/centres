import styles from './display.module.css'

import Icon from "@/_lib/utils/Icon";
import { Star } from 'lucide-react';

export default function DisplayReviews ({reviews, ReviewsList}){
  
    const keyMap = {
        "Évaluation totale": "overall",
        "Valeur": "value",
        "Propreté": "cleanliness",
        "Communication": "communication",
        "Emplacement": "location"
    };

    const aggregatedValues = {
        overall: 0,
        value: 0,
        cleanliness: 0,
        communication: 0,
        location: 0
    };

    reviews.forEach((review) => {
        Object.keys(aggregatedValues).forEach((key) => {
            aggregatedValues[key] += review[key];
        });
    });

    const totalReviews = reviews.length;    

    // console.log(reviews);

    return (
        <>
        <main className={styles.DisplayReviews}>  
            <ul className={styles.DisplayReviewsItems}>
                
                {ReviewsList.map((item, id)=> {     
                    const key = keyMap[item.name]; 
                    const sumTotal = key && totalReviews > 0 
                        ? (aggregatedValues[key] / totalReviews).toFixed(1) 
                        : "—";
                    return(<li key={id}> 
                        <span> 
                            <h4> {item.name}  </h4>
                            <h3 className={styles.TotalReviews}>
                                {sumTotal} 
                                {id===0 && <p>({totalReviews} Avis)</p>}
                            </h3>
                        </span>
                        <Icon name={item.icon} /> 
                    </li>)
                })}
            </ul>
        </main>
        <main className={styles.MobileReviews}> 
            <div className={styles.MobileReviewsOverall}> 
                <h1>{reviews[0]?.overall || '—'} / 5</h1>
                <span>
                    {[...Array(5)].map((_, index) => (
                        <Star 
                            key={index} 
                            fill={index < reviews[0]?.overall ? '#f1c40f' : '#e5e7e9'}
                            color={index < reviews[0]?.overall ? '#f1c40f' : '#e5e7e9'}
                        />
                    ))}
                </span>
                <p>{totalReviews} Avis</p>
            </div>
            <ul className={styles.MobileReviewsList}>
                {ReviewsList.slice(1).map((item, id)=> {  
                    const key = keyMap[item.name]; 
                    return(<li key={id}> 
                        <p> <Icon name={item.icon} /> {item.name} </p>
                        <div className={styles.ReviewsMax}>
                            <div style={{width:`${aggregatedValues[key]*2*10}%`}}></div>
                        </div>
                        <span> <p>{aggregatedValues[key]}</p> <Icon name={'Star'}/></span>
                    </li>)
                })}
            </ul>
        </main>
        </>
    )
}
