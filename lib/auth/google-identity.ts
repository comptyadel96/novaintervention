const GSI_SCRIPT = "https://accounts.google.com/gsi/client";

let gsiLoadPromise: Promise<void> | null = null;

/** Charge le script Google Identity une seule fois (partagé entre login / register). */
export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (gsiLoadPromise) {
    return gsiLoadPromise;
  }

  gsiLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SCRIPT}"]`,
    );

    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GSI_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Identity script failed"));
    document.head.appendChild(script);
  });

  return gsiLoadPromise;
}
