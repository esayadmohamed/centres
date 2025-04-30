// 'use server';
export const dynamic = 'force-dynamic';
import Link from "next/link";
import styles from "./account.module.css";

import { Authenticator } from "@/app/Providers";
import { GetUserData } from "@/_lib/account/actions";

import AccountContent from "./Content";
import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";

export default async function Account() {
        
    const userData = await GetUserData();

    return (
        <Authenticator>
            <main className="content">
                <Header />
                <div className={styles.AccountBody}>

                    <div className={styles.AccountBanner}>
                        <h2>Bonjour, {userData.name} !</h2>  
                        <ul className={styles.AccountRoot}>
                            <Link href={'/'}> <li>Acueil</li> </Link>
                            <li>/</li>
                            <li>Paramètres</li>
                        </ul>
                    </div>

                    <AccountContent userData={userData} />
                </div>
                <Footer /> 
            </main>
        </Authenticator>
    )

}
