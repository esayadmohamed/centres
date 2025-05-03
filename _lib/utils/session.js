import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSessionData() {
    const session = await getServerSession(authOptions);
    return session;
}