import { redirect } from 'next/navigation'; 
import { getSessionData } from '@/_lib/utils/session';

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import AuthSignup from '@/_com/auth/signup';

export default async function SingupPage (){
    
    const session = await getSessionData();

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header session={false}/>

            <AuthSignup/>

            <Footer />
        </div>
    )
}
