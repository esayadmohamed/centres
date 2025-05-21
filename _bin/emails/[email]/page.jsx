import Icon from "@/_lib/utils/Icon";

import { Unsubscribe } from "@/_lib/dashboard/editdata"

import Header from '@/_com/header/Header';
import Footer from '@/_com/footer/Footer';
import EmailsContent from "./content";

export default async function Emails({params}) {
    
    const emailData = await params;    
    const email = decodeURIComponent(emailData.email);

    const result = await Unsubscribe(email);

    return (
        <div className="content">
            <EmailsContent resultData={result}/>
        </div>
    )

}

