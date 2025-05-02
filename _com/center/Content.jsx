"use client"
import styles from './display.module.css'

import Icon from '@/_lib/utils/Icon';

import DisplaySlider from './Slider';
import DisplaySpecs       from "./Specifications";
import DisplayReviews     from "./Reviews";
import DisplaySuggestions from "./Suggestions";


export default function DisplayContent ({listing, suggested, ReviewsList, isAuthenticated, isReviewed}){
          
    return (
        <div className={styles.DisplayBody}>
            <div className={styles.DisplayContent}>          
                <div className={styles.DisplayInformation}>
                    <DisplaySlider listing={listing}/>
                    <DisplaySpecs 
                        listing={listing} 
                        ReviewsList={ReviewsList} 
                        isReviewed={isReviewed} 
                        isAuthenticated={isAuthenticated}
                    /> 
                </div>
                <div className={styles.ContentMarketing}> 
                    <div>
                        <Icon name={'Component'}/>
                        <p> Publicité </p> 
                    </div>
                </div>
            </div>
            <DisplayReviews reviews={listing.reviews} ReviewsList={ReviewsList} />
            <DisplaySuggestions listing={listing} suggested={suggested}/>

        </div>
    )
}


{/*  */}