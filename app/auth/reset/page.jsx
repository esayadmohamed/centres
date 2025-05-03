import { redirect } from 'next/navigation'; 
import { getSessionData } from '@/_lib/utils/session';

import Header from '@/_com/header/Header';
import Footer from "@/_com/footer/Footer";

import SendResetToken from '@/_com/auth/send';

export default async function RecoverPage (){

    const session = await getSessionData();

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header session={false}/>

            <SendResetToken />

            <Footer />
        </div>
    )
}