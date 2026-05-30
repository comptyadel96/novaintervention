"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth";
import { getErrorMessage, isBannedError } from "@/lib/api/errors";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { loadGoogleIdentityScript } from "@/lib/auth/google-identity";
import type { UserRole } from "@/types/domain";

const ENV_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

type Props = {
  signupRole?: UserRole;
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
  const gsiHostRef = useRef<HTMLDivElement>(null);
  const [clientId, setClientId] = useState<string | undefined>(ENV_CLIENT_ID);
  const [configured, setConfigured] = useState(Boolean(ENV_CLIENT_ID));
  const [gsiReady, setGsiReady] = useState(false);
  const [gsiHostReady, setGsiHostReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [statusLoaded, setStatusLoaded] = useState(false);

  const label =
    variant === "signup" ? "S'inscrire avec Google" : "Continuer avec Google";

  const gsiHostCallback = useCallback((node: HTMLDivElement | null) => {
    gsiHostRef.current = node;
    setGsiHostReady(Boolean(node));
  }, []);

  useEffect(() => {
    authApi
      .getGoogleStatus()
      .then((status) => {
        if (status.enabled && status.clientId) {
          setConfigured(true);
          setClientId(status.clientId);
        } else if (!ENV_CLIENT_ID) {
          setConfigured(false);
          setClientId(undefined);
        }
      })
      .catch(() => {
        if (!ENV_CLIENT_ID) {
          setConfigured(false);
          setClientId(undefined);
        }
      })
      .finally(() => setStatusLoaded(true));
  }, []);

  useEffect(() => {
    if (!configured || !clientId) return;

    let cancelled = false;

    loadGoogleIdentityScript()
      .then(() => {
        if (!cancelled) setGsiReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setLocalError(
            "Impossible de charger Google. Vérifiez votre connexion et réessayez.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [configured, clientId]);

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

  const renderGsiButton = useCallback(() => {
    const host = gsiHostRef.current;
    if (!host || !clientId) return;

    const google = window.google;
    if (!google?.accounts?.id) return;

    host.innerHTML = "";

    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
      cancel_on_tap_outside: true,
      ux_mode: "popup",
      locale: "fr",
    });

    const width = host.offsetWidth || host.parentElement?.offsetWidth || 320;

    google.accounts.id.renderButton(host, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: variant === "signup" ? "signup_with" : "continue_with",
      width: Math.min(Math.max(width, 240), 400),
      locale: "fr",
    });
  }, [clientId, variant, handleCredential]);

  useLayoutEffect(() => {
    if (
      !configured ||
      !clientId ||
      !gsiReady ||
      !gsiHostReady ||
      disabled ||
      loading
    ) {
      return;
    }

    renderGsiButton();

    const host = gsiHostRef.current;
    if (!host) return;

    const observer = new ResizeObserver(() => {
      renderGsiButton();
    });
    observer.observe(host);

    return () => {
      observer.disconnect();
      host.innerHTML = "";
    };
  }, [
    configured,
    clientId,
    gsiReady,
    gsiHostReady,
    disabled,
    loading,
    renderGsiButton,
  ]);

  const interactive =
    configured && clientId && gsiReady && !disabled && !loading;
  const showLoadingOverlay =
    loading || (!statusLoaded && !ENV_CLIENT_ID) || (configured && !gsiReady);

  return (
    <div className="space-y-3 w-full">
      {localError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {localError}
        </p>
      )}

      {!configured && statusLoaded && (
        <p className="text-xs text-text-muted text-center">
          Connexion Google non configurée sur ce serveur.
        </p>
      )}

      <div className="relative w-full">
        {/* Couche visuelle — toujours visible, donne la hauteur au conteneur */}
        <div
          className={`flex w-full items-center justify-center gap-3 rounded-xl border border-[#dadce0] bg-white px-4 py-2.5 text-sm font-medium text-[#3c4043] shadow-sm select-none min-h-[44px] ${
            interactive ? "" : "opacity-80"
          }`}
          aria-hidden={interactive ? undefined : "true"}
        >
          <GoogleIcon size={20} />
          <span>{label}</span>
        </div>

        {/* Iframe Google cliquable par-dessus */}
        {configured && clientId && (
          <div
            ref={gsiHostCallback}
            className={`absolute inset-0 z-10 overflow-hidden ${
              interactive
                ? "opacity-[0.01] cursor-pointer"
                : "pointer-events-none opacity-0"
            }`}
            aria-label={label}
          />
        )}

        {showLoadingOverlay && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/80 text-xs font-bold text-text-muted pointer-events-none"
            aria-live="polite"
          >
            {loading
              ? "Connexion…"
              : !statusLoaded
                ? "Chargement…"
                : "Chargement Google…"}
          </div>
        )}
      </div>
    </div>
  );
}
