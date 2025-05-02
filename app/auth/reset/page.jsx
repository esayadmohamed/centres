import { getBaseUrl } from "@/_lib/utils/getBaseUrl";
import { redirect } from 'next/navigation'; 

import Header from '@/_com/header/Header';
import Footer from "@/_com/footer/Footer";

import SendResetToken from '@/_com/auth/send';

export default async function RecoverPage (){
    
    const baseurl = getBaseUrl();

    const res = await fetch(`${baseurl}/api/session`, { cache: 'no-store' });
    const session = await res.json();

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header session={null}/>

            <SendResetToken />

            <Footer />
        </div>
    )
}