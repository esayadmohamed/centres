import { getBaseUrl } from "@/_lib/utils/getBaseUrl";
import { redirect } from 'next/navigation'; 

import Header from '@/_com/header/Header';
import Footer from "@/_com/footer/Footer";
import ResetPassword from '@/_com/auth/reset';

export default async function ResetVerify ({params}){
    
    const token = await params;
    const token_code = token?.token;
    
    const res = await fetch(`${baseurl}/api/session`, { cache: 'no-store' });
    const session = await res.json();

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header session={null}/>

            <ResetPassword reset_token={token_code}/>

            <Footer />
        </div>
    )
}
