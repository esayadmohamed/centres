import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation'; 

import Header from '@/_com/header/Header';
import Footer from "@/_com/footer/Footer";

import SendResetToken from '@/_com/auth/send';

export default async function RecoverPage (){
    
    const session = await getServerSession(authOptions);

    if(session) {redirect('/');}
    return(
        <div className="content">
            <Header/>

            <SendResetToken />

            <Footer />
        </div>
    )
}