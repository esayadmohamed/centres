
import { accessAdmin } from "@/_lib/access";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default async function AdminAccess({ children }){ 

    const authentication = await accessAdmin();
    if(!authentication) redirect('/');

    return (
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
    );
};



