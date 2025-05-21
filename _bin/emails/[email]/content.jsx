'use client'
import styles from "../styles.module.css";
import Link from "next/link";
import Icon from "@/_lib/utils/Icon";
import { useState } from "react";

import { Unsubscribe } from "@/_lib/dashboard/editdata"


export default function EmailsContent({resultData}) {
    
    const [result, setResult] = useState(resultData || {});
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');

    async function handleUnsubscribe(){
        if(email === '') return
        setLoading(true)
        setError('');

        const newResult = await Unsubscribe(email);
        setLoading(false)

        if(newResult?.error){
            setError(newResult.error)
        } else {
            setResult(newResult)
        }
    }

    return (
        <div className={styles.PageContainer}>
            {result?.error ? 
                <div className={styles.PageContent}>  
                    <span style={{backgroundColor: '#fadbd8'}}>
                        <Icon name={'X'} color={'#e74c3c'}/>
                    </span>
                    
                    <h3> {result.error} </h3>
                    <p>Entrez votre email pour ne plus recevoir nos e-mails marketing.</p>

                    <div className={styles.PageSend}>
                        <input type="text" placeholder="Email"
                            value={email} onChange={(e)=>setEmail(e.target.value)}
                            />
                        <div className={styles.PageSendAction} onClick={handleUnsubscribe}>
                            {loading ? 
                                <div className={'spinner'}></div>   
                                : 
                                <Icon name={'Send'} color={'white'}/>
                            }
                            
                        </div>
                    </div>

                    {error && <p className={styles.PageError}> {error} </p>}

                    <p className={styles.PageSupport}>
                        <Icon name={'Headset'} color="#424949"/>
                        contact@centres.ma
                    </p>      
                    <Link href={'/'}> www.centres.ma </Link>
                </div>
                :
                <div className={styles.PageContent}>  
                    <span style={{backgroundColor: '#d5f5e3'}}>
                        <Icon name={'Check'} color={'#186a3b'}/>
                    </span>
                    
                    <h3> Vous vous êtes désabonné avec succès! </h3>
                    
                    <p>Vous ne recevrez plus d'emails de notre part.</p>
                    
                    <p>Si vous souhaitez rester informé, vous êtes toujours le bienvenu pour créer un compte chez nous.</p>
                    
                    <Link href={'/'}> www.centres.ma </Link>
                </div>
            }
        </div>
    )
}

