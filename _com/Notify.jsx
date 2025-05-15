

export default async function Notify(message = "Default message") {
    try {
        const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        });

        const result = await res.json();

        console.log(result.success ? "✅ Notification sent!" : "❌ Failed to send.");
    } catch (error) {
        console.error("❌ Error sending notification:", error);
    }
}




// export default async function Notify (){

//     const res = await fetch("/api/notify", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ message:'12345' }),
//     });
    
//     const result = await res.json();

//     console.log(result.success ? "✅ Notification sent!" : "❌ Failed to send.");

// }