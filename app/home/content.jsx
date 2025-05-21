'use client';
import styles from "./styles.module.css";

import { useState, useRef, useEffect } from "react";

import LandingHeader from "@/_com/home/Header";
import LandingServices from "@/_com/home/services";
import LandingSignup from "@/_com/home/signup";
import LandingFooter from "@/_com/home/footer";

import { IntPixels, ModifyPixels } from "@/_lib/home/actions";

export default function LandingPage() {
    
    const signupRef = useRef(null); 
    const [email, setEmail] = useState('')    
    
    function handleEmail(value){
        setEmail(value)
        signupRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        async function insertPixel() {
            const result = await IntPixels();

            setTimeout(() => {
            ModifyPixels(result);
            }, 5000);
        }

        insertPixel();        
    }, []);



    return (
        <div className={styles.LandingPage}>
            <div className={styles.PageContent}>
 
                <LandingHeader handleEmail={handleEmail}/>

                <div className={styles.PageBody}>
                    <LandingServices />
                    <LandingSignup signupRef={signupRef} email={email} setEmail={setEmail}/>
                </div>

                <LandingFooter />

            </div>
        </div>
    )

}

