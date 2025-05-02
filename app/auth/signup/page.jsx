import { getBaseUrl } from "@/_lib/utils/getBaseUrl";
import { redirect } from 'next/navigation'; 

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import AuthSignup from '@/_com/auth/signup';

export default async function SingupPage (){
    
    const baseurl = getBaseUrl();

    const res = await fetch(`${baseurl}/api/session`, { cache: 'no-store' });
    const session = await res.json();

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header session={null}/>

            <AuthSignup/>

            <Footer />
        </div>
    )
}
