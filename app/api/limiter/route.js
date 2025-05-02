"use server";

import { LRUCache } from "lru-cache";

const rateLimits = {
    default: { max: 5000, ttl: 1 * 60 * 1000 },

    // -------------------------------------
    // -------------------------------------

    home: { max: 20, ttl: 1 * 60 * 1000 },

    // -------------------------------------
    // -------------------------------------
    
    modify: { max: 5000, ttl: 1 * 60 * 1000 },
    image:  { max: 5000, ttl: 5 * 60 * 1000 },
    create: { max: 5000, ttl: 5 * 60 * 1000 },
    reset:  { max: 5000, ttl: 60 * 60 * 1000 },
    password: { max: 5000, ttl: 1 * 60 * 1000 },
    signup: { max: 5, ttl: 60 * 60 * 60 * 1000 },
    verify:  { max: 5, ttl: 60 * 60 * 1000 },
    // -------------------------------------
    
    listing: { max: 10, ttl: 1 * 60 * 1000 },
};

const rateLimiter = new LRUCache({
    max: 1000,
    updateAgeOnGet: true,
});

// ------------------------------------------------------------

function isRateLimited(ip, action) {
    const { max, ttl } = rateLimits[action] || rateLimits.default; 
    const key = `${action}:${ip}`;

    const requestCount = rateLimiter.get(key) || 0;

    if (requestCount >= max) {
        return true;
    }

    rateLimiter.set(key, requestCount + 1, { ttl });
    return false;
}

// ------------------------------------------------------------

export async function POST(req) {
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        "Unknown IP";

    if (ip === "Unknown IP") {
        console.warn("Unable to determine IP address");
    }

    const { action } = await req.json();

    if (!["modify", "image", "create", 'signup', "reset", "password", "verify"].includes(action)) {
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }

    if (isRateLimited(ip, action)) {
        return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
    }

    return new Response(JSON.stringify({ message: "Allowed" }), { status: 200 });
}

// -----------------------------------------------------------------

export async function GET(req) {
    // Get the 'action' query parameter from the URL
    const url = new URL(req.url);
    const action = url.searchParams.get('action');  // Get 'action' from the query
    
    // Validate the action
    if (!action || !["home", "listing", "signup"].includes(action)) {
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }

    // Get the user's IP (or use a fallback if necessary)
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0] ||
        req.headers.get('x-real-ip') ||
        'Unknown IP';

    // Apply rate limiting for the action
    if (isRateLimited(ip, action)) {
        return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}

// export async function GET(req) {
//     const ip =
//         req.headers.get("x-forwarded-for")?.split(",")[0] ||
//         req.headers.get("x-real-ip") ||
//         "Unknown IP";
    
//     if (ip === "Unknown IP") {
//         console.warn("Unable to determine IP address");
//     }

//     const { action } = await req.json();

//     if (!["home", "listing"].includes(action)) {
//         return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
//     }

//     if (isRateLimited(ip, action)) {
//         return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
//     }

//     return new Response(JSON.stringify({ message: "Allowed" }), { status: 200 });
// }