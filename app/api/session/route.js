import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { headers, cookies } from "next/headers";

export async function GET() {

    const session = await getServerSession(authOptions);

    console.log("sessionAPI:", session);

    return Response.json(session || {aaa: 'aaa'});
}



