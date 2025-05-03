import { redirect } from 'next/navigation'; 
import { getSessionData } from '@/_lib/utils/session';

import { getBaseUrl } from "@/_lib/utils/getBaseUrl";
import { redirect } from 'next/navigation'; 

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import AuthToken from "@/_com/auth/token";

export default async function AuthVerify ({params}){
    
    const token = await params;
    const token_code = token.token;

    // const baseurl = getBaseUrl();
    // const res = await fetch(`${baseurl}/api/token?token_value=${token_code}`, { cache: 'no-store' });
    // const data = await res.json();

    const session = await getSessionData();
    
    if(session) {redirect('/')}
    return(
        <div className="content">
            
            <Header session={false}/>

            <AuthToken result={data?.token}/>

            <Footer />

        </div>
    )
}
