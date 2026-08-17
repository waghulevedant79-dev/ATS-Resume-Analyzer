import { useEffect, useRef, useState } from "react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({
  onCredential,
  disabled = false,
}) {
  const buttonRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const renderGoogleButton = () => {
      if (
        cancelled ||
        !window.google?.accounts?.id ||
        !buttonRef.current ||
        !GOOGLE_CLIENT_ID
      ) {
        return;
      }

      const containerWidth = buttonRef.current.parentElement?.clientWidth || 400;

      const buttonWidth = Math.min(containerWidth, 400);

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response?.credential) {
            setError("Google authentication did not return a credential.");
            return;
          }

          try {
            setError("");
            await onCredential(response.credential);
          } catch (err) {
            setError(err.message || "Unable to sign in with Google.");
          }
        },
        use_fedcm_for_prompt: true,
      });

      buttonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: buttonWidth,
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", renderGoogleButton);

      return () => {
        cancelled = true;
        existingScript.removeEventListener("load", renderGoogleButton);
      };
    }

    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;

    script.onerror = () => {
      if (!cancelled) {
        setError("Unable to load Google Sign-In.");
      }
    };

    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [onCredential]);

  return (
    <div className="google-signin-wrap">
      <div
        ref={buttonRef}
        className={`google-gsi-button ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
      />

      {error && (
        <p
          role="alert"
          className="mt-2 text-center text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}