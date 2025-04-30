import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation'; 

import Header from '@/_com/header/Header';
import Footer from "@/_com/footer/Footer";
import ResetPassword from '@/_com/auth/reset';

export default async function ResetVerify ({params}){
    
    const token = await params;
    const token_code = token?.token;
    
    const session = await getServerSession(authOptions);

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header/>

            <ResetPassword reset_token={token_code}/>

            <Footer />
        </div>
    )
}
