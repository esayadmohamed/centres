export const dynamic = 'force-dynamic';

import UserAccess from "@/app/UserAccess"; 
import { GetUserData } from "@/_lib/account/actions";

import AccountContent from "./Content";
import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";

export default async function Account() {
        
    const userData = await GetUserData();

    return (
        <UserAccess>
            <main className="content">
                <Header />
                <AccountContent userData={userData} />
                <Footer /> 
            </main>
        </UserAccess>
    )

}

                {/* <div className={styles.PageContainer}> */}
                {/* </div> */}