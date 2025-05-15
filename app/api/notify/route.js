
export async function POST(request) {
    const { message } = await request.json();

    const res = await fetch("https://api.pushover.net/1/messages.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
        body: new URLSearchParams({
        token: process.env.PUSHOVER_APP_TOKEN,
        user: process.env.PUSHOVER_USER_KEY,
        message: message || "Message is 'null'",
        title: "📣 New Notification",
        }),
    });

    const data = await res.json();

    if (res.ok) {
        return Response.json({ success: true, data });
    } else {
        return Response.json({ success: false, data }, { status: 500 });
    }
}
