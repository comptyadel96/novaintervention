"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth";
import { getErrorMessage, isBannedError } from "@/lib/api/errors";
import type { UserRole } from "@/types/domain";

const GSI_SCRIPT = "https://accounts.google.com/gsi/client";

type Props = {
  /** Inscription : rôle envoyé au backend (`client` ou `artisan`). */
  signupRole?: UserRole;
  /** Texte du bouton Google : inscription vs connexion. */
  variant?: "signin" | "signup";
  disabled?: boolean;
  onError?: (message: string) => void;
};

export function GoogleSignInSection({
  signupRole,
  variant = "signin",
  disabled,
  onError,
}: Props) {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<{
    enabled: boolean;
    clientId?: string;
  } | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    authApi
      .getGoogleStatus()
      .then(setStatus)
      .catch(() => setStatus({ enabled: false }));
  }, []);

  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      const idToken = response.credential;
      if (!idToken) return;

      setLoading(true);
      setLocalError(null);

      try {
        await authApi.signInWithGoogle(
          idToken,
          signupRole ? { role: signupRole } : undefined,
        );
        router.push("/dashboard");
        router.refresh();
      } catch (err) {
        if (isBannedError(err)) {
          router.push("/account-suspended");
          return;
        }
        const msg = getErrorMessage(err, "Connexion Google impossible.");
        setLocalError(msg);
        onError?.(msg);
        setLoading(false);
      }
    },
    [signupRole, router, onError],
  );

  useEffect(() => {
    if (
      !status?.enabled ||
      !status.clientId ||
      !scriptReady ||
      !buttonRef.current ||
      disabled ||
      renderedRef.current
    ) {
      return;
    }

    const google = window.google;
    if (!google?.accounts?.id) return;

    const width = buttonRef.current.offsetWidth || 320;

    google.accounts.id.initialize({
      client_id: status.clientId,
      callback: handleCredential,
      cancel_on_tap_outside: true,
    });

    google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: variant === "signup" ? "signup_with" : "continue_with",
      width: Math.min(Math.max(width, 200), 400),
      locale: "fr",
    });

    renderedRef.current = true;
  }, [status, scriptReady, disabled, variant, handleCredential]);

  if (status === null) {
    return (
      <div
        className="h-12 rounded-xl bg-bg-alt animate-pulse mb-2"
        aria-hidden
      />
    );
  }

  if (!status.enabled || !status.clientId) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Script
        src={GSI_SCRIPT}
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />

      {localError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {localError}
        </p>
      )}

      <div
        className={`relative flex justify-center min-h-[44px] ${
          disabled || loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div ref={buttonRef} className="w-full flex justify-center" />
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-muted bg-white/80 rounded-xl">
            Connexion…
          </span>
        )}
      </div>
    </div>
  );
}
