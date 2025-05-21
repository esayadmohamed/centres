
import { Unsubscribe } from "@/_lib/dashboard/editdata"

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

