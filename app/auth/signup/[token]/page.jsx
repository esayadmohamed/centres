import { redirect } from 'next/navigation'; 
import { getSessionData } from '@/_lib/utils/session';
import { VerifyToken } from "@/_lib/auth/verify";
// import { getBaseUrl } from "@/_lib/utils/getBaseUrl";

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import AuthToken from "@/_com/auth/token";

export default async function AuthVerify ({params}){
    
    const tokenData = await params;
    const tokenCode = tokenData.token;

    const token = await VerifyToken(tokenCode);

    // const baseurl = getBaseUrl();
    // const res = await fetch(`${baseurl}/api/token?token_value=${token_code}`, { cache: 'no-store' });
    // const data = await res.json();


    const session = await getSessionData();

    if(session) {redirect('/')}
    return(
        <div className="content">
            
            <Header />

            <AuthToken result={token}/>

            <Footer />

        </div>
    )
}
