import { redirect } from 'next/navigation'; 
import { getSessionData } from '@/_lib/utils/session';

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import AuthLogin from '@/_com/auth/login';


export default async function AuthPage (){
    
    const session = await getSessionData();

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header />

            <AuthLogin/>

            <Footer />
        </div>
    )
}

// git add .
// git commit -m "Made changes to my app"
// git push origin master