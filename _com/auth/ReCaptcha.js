"use client";
import { useEffect } from "react";

const ReCaptcha = ({ onVerify }) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  console.log("reCAPTCHA Site Key:", siteKey); // Log for debugging

  useEffect(() => {
    if (!siteKey) {
      console.error("reCAPTCHA site key is missing.");
      return;
    }

    if (typeof window !== "undefined" && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(siteKey, { action: "submit" })
          .then((token) => {
            if (onVerify) onVerify(token);
          })
          .catch((err) => console.error("reCAPTCHA error:", err));
      });
    }
  }, [siteKey]);

  return null;
};

export default ReCaptcha;
