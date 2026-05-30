"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthMethodTabs } from "@/components/auth/AuthMethodTabs";
import { SmsAuthPanel } from "@/components/auth/SmsAuthPanel";
import { FormField, inputClassName } from "@/components/forms/FormField";
import { GoogleSignInSection } from "@/components/auth/GoogleSignInSection";
import { loadGoogleIdentityScript } from "@/lib/auth/google-identity";
import { authApi } from "@/services/api/auth";
import { ApiError } from "@/lib/api/errors";
import { getErrorMessage, isBannedError } from "@/lib/api/errors";
import { validateEmail, validatePassword } from "@/lib/forms/validate";

export default function LoginPage() {
  const [method, setMethod] = useState<"email" | "sms">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFormError(null);
    setFieldErrors({});
  }, [method]);

  useEffect(() => {
    loadGoogleIdentityScript().catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailCheck = validateEmail(email);
    const passwordCheck = validatePassword(password);
    const errors: { email?: string; password?: string } = {};
    if (!emailCheck.valid) errors.email = emailCheck.message!;
    if (!passwordCheck.valid) errors.password = passwordCheck.message!;
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);

    try {
      await authApi.login({ email: email.trim(), password });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (isBannedError(err)) {
        router.push("/account-suspended");
        return;
      }
      const msg = getErrorMessage(err, "Connexion impossible. Réessayez.");
      setFormError(
        err instanceof ApiError && err.code === "GOOGLE_AUTH_ONLY"
          ? `${msg} Utilisez le bouton Google en haut de la page.`
          : msg,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrap flex flex-col min-h-screen bg-bg-body">
      <Header />
      <div className="auth-wrap flex-1 flex items-center justify-center py-12 px-4">
        <div className="auth-box w-full max-w-md">
          <div className="auth-box__header text-center mb-8">
            <p
              className="text-xl font-extrabold text-primary-dk mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nova <span className="text-primary">Intervention</span>
            </p>
            <h1
              className="text-2xl font-extrabold text-primary-dk mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Connexion
            </h1>
            <p className="text-sm text-text-muted">
              Google, email + mot de passe ou code SMS.
            </p>
          </div>

          <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]">
            <GoogleSignInSection
              variant="signin"
              onError={(msg) => setFormError(msg)}
            />

            <div className="h-px bg-border my-6 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-text-muted uppercase tracking-widest">
                OU
              </span>
            </div>

            <AuthMethodTabs value={method} onChange={setMethod} />

            {method === "email" ? (
              <>
                {formError && (
                  <div className="form-banner-error" role="alert">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate>
                  <FormField
                    label="Adresse email"
                    htmlFor="login-email"
                    error={fieldErrors.email}
                    required
                  >
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) {
                          setFieldErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                      className={inputClassName(!!fieldErrors.email)}
                      placeholder="jean.dupont@email.com"
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={
                        fieldErrors.email ? "login-email-error" : undefined
                      }
                    />
                  </FormField>

                  <FormField
                    label="Mot de passe"
                    htmlFor="login-password"
                    error={fieldErrors.password}
                    required
                  >
                    <div className="flex justify-end -mt-8 mb-2 relative z-10">
                      <Link
                        href="/forgot-password"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                      }}
                      className={inputClassName(!!fieldErrors.password)}
                      placeholder="Votre mot de passe"
                      aria-invalid={!!fieldErrors.password}
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full justify-center py-4 text-lg mt-2 disabled:opacity-50"
                  >
                    {isLoading ? "Connexion en cours…" : "Se connecter"}
                  </button>
                </form>
              </>
            ) : (
              <SmsAuthPanel mode="login" />
            )}

            <div className="h-px bg-border my-8 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-text-muted uppercase tracking-widest">
                OU
              </span>
            </div>

            <p className="text-sm text-text-muted text-center">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="text-primary font-extrabold hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
