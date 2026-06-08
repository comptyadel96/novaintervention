"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FormField, inputClassName } from "@/components/forms/FormField";
import { authApi } from "@/services/api/auth";
import { ApiError } from "@/lib/api/errors";
import { getErrorMessage } from "@/lib/api/errors";
import {
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/forms/validate";

type PageStatus = "form" | "loading" | "ok" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  /** Inscription classique : email déjà confirmé sans redemander de mot de passe. */
  const autoVerifyOnly = searchParams.get("auto") === "1";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [status, setStatus] = useState<PageStatus>(
    autoVerifyOnly ? "loading" : "form",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !autoVerifyOnly) return;

    authApi
      .verifyEmail({ token })
      .then(() => {
        setStatus("ok");
        router.refresh();
      })
      .catch((err) => {
        setStatus("error");
        setError(getErrorMessage(err, "Lien invalide ou expiré."));
      });
  }, [token, autoVerifyOnly, router]);

  const activateWithPassword = async () => {
    if (!token) return;

    try {
      await authApi.verifyEmail({ token, password });
      return;
    } catch (err) {
      if (!(err instanceof ApiError)) throw err;
      const alreadyDone =
        err.code === "EMAIL_ALREADY_VERIFIED" ||
        /déjà vérifi|already verified/i.test(err.message);
      if (!alreadyDone) throw err;
      await authApi.resetPassword(password, token);
    }
  };

  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    const passwordCheck = validatePassword(password);
    const confirmCheck = validatePasswordConfirm(password, confirmPassword);
    const errors: { password?: string; confirmPassword?: string } = {};
    if (!passwordCheck.valid) errors.password = passwordCheck.message!;
    if (!confirmCheck.valid) errors.confirmPassword = confirmCheck.message!;
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("loading");

    try {
      await activateWithPassword();
      setStatus("ok");
      router.refresh();
    } catch (err) {
      setStatus("form");
      setError(getErrorMessage(err, "Activation impossible."));
    }
  };

  if (!token) {
    return (
      <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem] text-center">
        <h2 className="text-2xl font-extrabold text-primary-dk mb-2">
          Lien invalide
        </h2>
        <p className="text-sm text-red-600 mb-6">
          Token manquant. Utilisez le lien reçu par email.
        </p>
        <Link href="/login" className="btn btn-primary">
          Se connecter
        </Link>
      </div>
    );
  }

  if (status === "form") {
    return (
      <form
        onSubmit={handleActivateAccount}
        className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]"
        noValidate
      >
        <h2 className="text-2xl font-extrabold text-primary-dk mb-2 text-center">
          Activez votre compte
        </h2>
        <p className="text-sm text-text-muted mb-6 text-center">
          Confirmez votre email et choisissez un mot de passe pour accéder à
          Nova Intervention et suivre votre demande.
        </p>

        {error && (
          <div className="form-banner-error mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <FormField
            label="Mot de passe"
            htmlFor="verify-password"
            error={fieldErrors.password}
            hint="8 caractères minimum"
            required
          >
            <input
              id="verify-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClassName(!!fieldErrors.password)}
              autoComplete="new-password"
            />
          </FormField>
          <FormField
            label="Confirmer le mot de passe"
            htmlFor="verify-password-confirm"
            error={fieldErrors.confirmPassword}
            required
          >
            <input
              id="verify-password-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClassName(!!fieldErrors.confirmPassword)}
              autoComplete="new-password"
            />
          </FormField>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full justify-center mt-6"
        >
          Confirmer mon email et activer mon compte
        </button>
      </form>
    );
  }

  if (status === "loading") {
    return (
      <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem] text-center text-text-muted">
        {autoVerifyOnly
          ? "Confirmation de votre email en cours…"
          : "Activation de votre compte en cours…"}
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem] text-center">
        <h2 className="text-2xl font-extrabold text-primary-dk mb-2">
          {autoVerifyOnly ? "Email confirmé" : "Compte activé"}
        </h2>
        <p className="text-sm text-text-muted mb-6">
          {autoVerifyOnly
            ? "Vous pouvez maintenant utiliser toutes les fonctionnalités de la plateforme."
            : "Votre email est confirmé et votre mot de passe est enregistré. Connectez-vous pour suivre votre demande."}
        </p>
        <Link href="/login" className="btn btn-primary">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem] text-center">
      <h2 className="text-2xl font-extrabold text-primary-dk mb-2">
        Activation impossible
      </h2>
      <p className="text-sm text-red-600 mb-6">{error}</p>
      <div className="flex flex-col gap-3">
        {!autoVerifyOnly && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStatus("form");
            }}
            className="btn btn-primary"
          >
            Réessayer
          </button>
        )}
        <Link href="/login" className="btn btn-outline">
          Se connecter
        </Link>
        <Link href="/forgot-password" className="text-sm text-primary font-semibold">
          Mot de passe oublié
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="page-wrap flex flex-col min-h-screen bg-bg-body">
      <Header />
      <div className="auth-wrap flex-1 flex items-center justify-center py-12 px-4">
        <div className="auth-box w-full max-w-md">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-extrabold mb-2 text-primary-dk"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Activation du compte
            </h1>
          </div>
          <Suspense
            fallback={
              <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem] text-center text-text-muted">
                Chargement…
              </div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
