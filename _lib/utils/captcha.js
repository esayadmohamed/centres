"use server";

export async function verifyCaptcha(captchaToken) {
    const url = process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/recaptcha`
      : 'http://localhost:3000/api/recaptcha';
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captchaToken }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Erreur HTTP: ${res.status}`, errorText);
        return null;
      }
  
      const data = await res.json();
      return data.success ? { success: true } : null;
  
    } catch (error) {
      console.error("Erreur dans verifyCaptcha:", error.message);
      return null;
    }
}