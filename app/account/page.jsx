export const dynamic = 'force-dynamic';
import Link from "next/link";
import styles from "./account.module.css";

import { Authenticator } from "@/app/Providers";
import { GetUserData } from "@/_lib/account/actions";

import AccountContent from "./Content";
import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";

import { notFound } from "next/navigation";

export default async function Account() {
        
    const userData = await GetUserData();

    if(!userData) return notFound() 

    return (
        <Authenticator>
            <main className="content">
                <Header />
                <div className={styles.PageContainer}>

                    <div className={styles.PageBanner}>
                        <h2>Bonjour, {userData.name} !</h2>  
                        <ul className={styles.BannerRoot}>
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
