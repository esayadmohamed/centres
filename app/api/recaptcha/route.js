export async function POST(req) {
    const { captchaToken } = await req.json();
  
    if (!captchaToken) {
        return Response.json({ success: false, error: "Aucun code reCAPTCHA." }, { status: 400 });
    }
  
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
    
    const response = await fetch(verifyUrl, { method: "POST" });
    const data = await response.json();
  
    if (data.success) {
        return Response.json({ success: true });
    } else {
        return Response.json({ success: false, error: "La vérification du reCAPTCHA a échoué" }, { status: 400 });
    }
}

// export async function POST(request) {
//     const body = await request.json();
//     const token = body.token;
  
//     const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
//     const response = await fetch(
//       'https://www.google.com/recaptcha/api/siteverify',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `secret=${secretKey}&response=${token}`,
//       }
//     );
  
//     const data = await response.json();
  
//     if (data.success) {
//       return new Response(JSON.stringify({ success: true }), { status: 200 });
//     } else {
//       return new Response(
//         JSON.stringify({ success: false, errors: data['error-codes'] }),
//         { status: 400 }
//       );
//     }
//   }
  