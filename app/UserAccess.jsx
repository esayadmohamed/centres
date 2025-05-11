
import { accessUser } from "@/_lib/access";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default async function UserAccess({ children }){ 

    const authentication = await accessUser();
    if(!authentication) redirect('/');

    return (
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
    );
};



