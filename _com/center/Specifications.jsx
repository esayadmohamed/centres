"use client"
import styles from './display.module.css'

import SpecsContact from './specifications/Contact';
import SpecsDescription from "./specifications/Description";
import SpecsReviews from "./specifications/Reviews";

import SpecBox from './specifications/Specbox';

const aaa = [{name: 'agfgf gfgfhfhfhf', icon:'Tag'},
    {name: 'agfgf gfgfhfhfhf', icon:'Tag'}, {name: 'agfgf gfgfhfhfhf', icon:'Tag'}
    ,{name: 'agfgf gfgfhfhfhf', icon:'Tag'}, {name: 'agfgf gfgfhfhfhf', icon:'Tag'}
    ,{name: 'agfgf gfgfhfhfhf', icon:'Tag'}, {name: 'agfgf gfgfhfhfhf', icon:'Tag'}
    ,{name: 'agfgf gfgfhfhfhf', icon:'Tag'}, {name: 'agfgf gfgfhfhfhf', icon:'Tag'}
]

export default function DisplaySpecs ({listing, ReviewsList, isReviewed, isAuthenticated}){
    
    const list = [
        {name: 'Offres Spéciales', data: listing.offers}, 
        {name: 'Service Utiles', data: listing.services},
        {name: 'Cours Proposés', data: listing.subjects},
        {name: 'Niveaux Scolaires', data: listing.levels}
    ]

    return (
        <div className={styles.Specs}>
            <SpecsContact listing={listing}/>
            
            <SpecsDescription description={listing.info}/>

            {list.map((item, id)=>
                <SpecBox key={id} name={item.name} data={item.data}/>
            )}

            <SpecsReviews 
                center_id={listing.id} 
                ReviewsList={ReviewsList} 
                isReviewed={isReviewed}
                isAuthenticated={isAuthenticated}
            />
        </div>
    )
}

