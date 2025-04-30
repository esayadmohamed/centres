"use client"

import Image from "next/image";
import Link from "next/link"
import styles from './display.module.css'
import { useState } from "react";

import Centre from "../centers/Centre";

import { BadgeCheck, ChevronLeft, ChevronRight, CircleSmall} from "lucide-react";

export default function DisplaySuggestions ({listing, suggested}){
      
    if(suggested.length === 0) return
    return (
        <main className={styles.Suggestions}>            
            <h3>Autres centres près de chez vous</h3>
            <div className={styles.SuggestionsList}>
                <ul>
                    {suggested.map((item, id)=>
                        <li key={id}><Centre listing={item} id={id}/></li>
                    )}
                </ul>
            </div>
 
        </main>
    )
}