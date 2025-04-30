'use client';
import styles from './create.module.css';
import { useRef, useState } from 'react';

import { HousePlus, SquareCheck, Square } from "lucide-react";

export default function Approval () {

    return ( 
        <div className={styles.Approval}>         
            <p>
                En cliquant sur "Ajouter", vous acceptez nos 
                <span> Conditions d'Utilisation </span> 
                et confirmez avoir pris connaissance de notre 
                <span> Politique de Confidentialité </span> .
            </p>
        </div>
    )
}