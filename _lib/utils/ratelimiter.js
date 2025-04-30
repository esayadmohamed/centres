"use server"; 

export async function RateLimiterGet(action) {
    try {
        const res = await fetch(`http://localhost:3000/api/limiter?action=${action}`, {
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


export async function RateLimiter(action) { 
    const res = await fetch("http://localhost:3000/api/limiter", {
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
