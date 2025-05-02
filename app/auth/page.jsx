import { redirect } from 'next/navigation'; 
import { getBaseUrl } from "@/_lib/utils/getBaseUrl";

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import AuthLogin from '@/_com/auth/login';

export default async function AuthPage (){
    
    const baseurl = getBaseUrl();

    const res = await fetch(`${baseurl}/api/session`, { cache: 'no-store' });
    const session = await res.json();

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header session={null}/>

            <AuthLogin/>

            <Footer />
        </div>
    )
}
