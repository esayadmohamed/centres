import styles from './style.module.css'
import { useState } from 'react';

import Icon from '@/_lib/utils/Icon';

export default function SpecsContact ({listing}){
        
    const [copied, setCopied] = useState(false);

    function handleCopy(){
        navigator.clipboard.writeText(listing.phone).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      });
    };

    return (
        <>
        <div className={styles.SpecsContact}>
            <h4> 
                <Icon name={'MapPin'} />  {listing.city}, {listing.hood}
            </h4>
            <p onClick={handleCopy}>
                <Icon name={copied? 'Check' : 'Phone'} color='white'/>
                <span> {!copied && listing.phone} </span> 
            </p>
        </div>
        <div className={styles.SpecsCall}>
            <a href={`tel:${listing.phone}`}>
                <span> <Icon name={'Phone'} color='white'/>   </span>
            </a>
        </div>
        </>
    );
}