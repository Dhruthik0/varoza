import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleScriptPromise;

const isLikelyInvalidClientId = (clientId) =>
  !clientId ||
  clientId.includes("your_google_web_client_id") ||
  !clientId.endsWith(".apps.googleusercontent.com");

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google script")), {
        once: true
      });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

const GOOGLE_CLIENT_ID_FALLBACK =
  "8463172399-gagijvikmsqqoh8iqmq6q16pbaletbni.apps.googleusercontent.com";

export default function GoogleAuthButton({ onCredential, onError, disabled = false }) {
  const buttonRef = useRef(null);
  const [renderError, setRenderError] = useState("");

  useEffect(() => {
    const clientId =
      String(import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim() ||
      GOOGLE_CLIENT_ID_FALLBACK;

    if (isLikelyInvalidClientId(clientId)) {
      setRenderError("Google login is not configured with a valid Web Client ID.");
      return;
    }

    let active = true;

    loadGoogleScript()
      .then(() => {
        if (!active || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response?.credential) {
              onError?.("Google login failed. Please try again.");
              return;
            }
            onCredential(response.credential);
          }
        });

        buttonRef.current.innerHTML = "";
        const buttonWidth = Math.min(360, buttonRef.current.offsetWidth || 320);
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: buttonWidth
        });
      })
      .catch((err) => {
        setRenderError(err.message || "Failed to load Google login");
      });

    return () => {
      active = false;
    };
  }, [onCredential, onError]);

  return (
    <div className={`${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <div ref={buttonRef} className="flex justify-center" />
      {renderError && (
        <p className="mt-2 text-center text-sm font-semibold text-[#58181F]">{renderError}</p>
      )}
    </div>
  );
}
