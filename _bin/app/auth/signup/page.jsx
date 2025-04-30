import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation'; 

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import AuthSignup from '@/_com/auth/signup';


export default async function SingupPage (){
    
    const session = await getServerSession(authOptions);

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header/>

            <AuthSignup/>

            <Footer />
        </div>
    )
}
