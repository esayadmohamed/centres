"use server"; 
import { getBaseUrl } from "@/_lib/utils/getBaseUrl";

const baseUrl = getBaseUrl();

export async function RateLimiter(action) { 
    
    const res = await fetch(`${baseUrl}/api/limiter`, {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: action }),
    });

    if (res.status === 429) {
        console.warn("Rate limiting triggered: Possible attempt to flood the server with excessive requests.");
        return null;
    }

    return { success: true };
}


export async function RateLimiterGet(action) {

    const baseurl = getBaseUrl();

    try {
        const res = await fetch(`${baseurl}/api/limiter?action=${action}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.status === 429) {
            console.warn("Rate limiting triggered: Possible attempt to flood the server with excessive requests.");
            return new Promise((resolve) => {
                setTimeout(() => { resolve(null) }, 60000); 
            });
        }

        return { success: true };

    } catch (error) {
        console.error("RateLimiterGet error:", error);
        return null;
    }
}

