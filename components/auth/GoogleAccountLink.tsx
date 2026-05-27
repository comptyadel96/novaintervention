"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { authApi } from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api/errors";
import type { AuthUser } from "@/types/domain";

const GSI_SCRIPT = "https://accounts.google.com/gsi/client";

export function GoogleAccountLink({ user }: { user: AuthUser }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<{
    enabled: boolean;
    clientId?: string;
  } | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const renderedRef = useRef(false);

  const hasGoogle =
    user.hasGoogle === true || user.authProvider === "google";

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
      setMessage(null);
      setIsError(false);

      try {
        await authApi.linkGoogle(idToken);
        setMessage("Compte Google associé avec succès.");
        window.location.reload();
      } catch (err) {
        setMessage(getErrorMessage(err, "Impossible d'associer Google."));
        setIsError(true);
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (
      hasGoogle ||
      !status?.enabled ||
      !status.clientId ||
      !scriptReady ||
      !buttonRef.current ||
      renderedRef.current
    ) {
      return;
    }

    const google = window.google;
    if (!google?.accounts?.id) return;

    const width = buttonRef.current.offsetWidth || 280;

    google.accounts.id.initialize({
      client_id: status.clientId,
      callback: handleCredential,
    });

    google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      width: Math.min(Math.max(width, 200), 400),
      locale: "fr",
    });

    renderedRef.current = true;
  }, [status, scriptReady, hasGoogle, handleCredential]);

  if (hasGoogle) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-900">
        <p className="font-bold">Google connecté</p>
        <p className="mt-1 text-green-800/90">
          Vous pouvez vous connecter avec Google (
          {user.authProvider === "google" ? "méthode principale" : "lié"}).
        </p>
      </div>
    );
  }

  if (status === null) {
    return null;
  }

  if (!status.enabled || !status.clientId) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-primary-dk">Compte Google</h3>
        <p className="text-sm text-text-muted mt-1">
          Associez Google pour vous connecter sans mot de passe.
        </p>
      </div>

      <Script
        src={GSI_SCRIPT}
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />

      {message && (
        <p
          className={`text-sm rounded-xl px-3 py-2 ${
            isError
              ? "text-red-700 bg-red-50 border border-red-100"
              : "text-green-800 bg-green-50 border border-green-100"
          }`}
        >
          {message}
        </p>
      )}

      <div
        className={`relative flex justify-center min-h-[44px] ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div ref={buttonRef} className="w-full flex justify-center" />
      </div>
    </div>
  );
}
