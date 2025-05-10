'use client';
import styles from "../dash.module.css";

import { useState } from "react";

export default function DashSlider({listing}) {

    const [index, setIndex] = useState(0)

    return(
        <div className={styles.DashSlider}>
            <div className={styles.ListingSlider}>
                <ul className={styles.SliderNav}>
                    {listing?.images?.map((item, id)=>
                        <li style={{backgroundImage: `url('https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${item}')`,
                                    opacity: index === id ? '60%':'100%'}}
                            onClick={()=>setIndex(id)}
                            key={id}
                        > </li>
                    )}
                </ul>
                <div className={styles.ListingImage} style={{backgroundImage: `url('https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${listing?.images[index]}')`}}>
                </div>
            </div>
        </div>
    )
    
}