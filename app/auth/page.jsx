import { redirect } from 'next/navigation'; 
import { getBaseUrl } from "@/_lib/utils/getBaseUrl";

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import AuthLogin from '@/_com/auth/login';

import { getSessionData } from '@/_lib/utils/session';

export default async function AuthPage (){

    const baseurl = getBaseUrl();

    // const res = await fetch(`${baseurl}/api/session`, { cache: 'no-store' });
    // const session = await res.json();
    
    const sessionData = await getSessionData();

    // console.log(sessionData);
    // console.log('session:', session); 

    return <div> {sessionData?.user?.token}</div>
    // if(session) {redirect('/');}
    return(
        <div className="content">
            <Header session={false}/>

            <AuthLogin/>
            <h1></h1>

            <Footer />
        </div>
    )
}
