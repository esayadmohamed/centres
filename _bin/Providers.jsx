"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Loading from "./loading";

export const Authenticator = ({ children }) => {
    return (
        <SessionProvider>
            <AuthGuard>{children}</AuthGuard>
        </SessionProvider>
    );
};

const AuthGuard = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/");
        }
    }, [status, session]);

    if (status === "loading") return <Loading />
    if (!session) return null;

    return children;
};
