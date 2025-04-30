import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import Contact from '@/_com/support/contact';

export default async function Support (){
    
    const session = await getServerSession(authOptions);
    const token_email = session?.user?.email;
    
    return(
        <div className="content">
            <Header />

            <Contact token_email={token_email}/>

            <Footer />
        </div>
    )
}
