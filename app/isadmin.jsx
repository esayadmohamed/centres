"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { notFound } from 'next/navigation';

import Loading from "./loading";

export const IsAdmin = ({ children }) => {
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
        if (!session || session.user.role !== 'admin') {
            router.push("/");
        }
    }, [status, session]);

    if (status === "loading") return <Loading />
    if (!session || session.user.role !== 'admin') {
        return notFound();
    }

    return children;
};
