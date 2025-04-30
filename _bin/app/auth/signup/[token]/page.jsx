import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation'; 

import { VerifyToken } from "@/_lib/auth/verify";

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';

import AuthToken from "@/_com/auth/token";

export default async function AuthVerify ({params}){
    
    const token = await params;
    const token_code = token.token;

    const result = await VerifyToken(token);
    
    const session = await getServerSession(authOptions);

    if(session) {redirect('/')}
    return(
        <div className="content">
            
            <Header/>

            <AuthToken result={result}/>

            <Footer />

        </div>
    )
}
