import { redirect } from 'next/navigation'; 

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import AuthLogin from '@/_com/auth/login';

export default async function AuthPage (){
    
    const session = await getServerSession(authOptions);

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header/>

            <AuthLogin/>

            <Footer />
        </div>
    )
}
