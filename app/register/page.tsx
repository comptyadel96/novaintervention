"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthMethodTabs } from "@/components/auth/AuthMethodTabs";
import { SmsAuthPanel } from "@/components/auth/SmsAuthPanel";
import { FormField, inputClassName } from "@/components/forms/FormField";
import { GoogleSignInSection } from "@/components/auth/GoogleSignInSection";
import { authApi } from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api/errors";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
  validatePhone,
} from "@/lib/forms/validate";

type RegisterErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterPage() {
  const [method, setMethod] = useState<"email" | "sms">("email");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegisterErrors>({});
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    const checks = {
      firstName: validateName(formData.firstName, "prénom"),
      lastName: validateName(formData.lastName, "nom"),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validatePasswordConfirm(
        formData.password,
        formData.confirmPassword,
      ),
    };

    const errors: RegisterErrors = {};
    (Object.keys(checks) as (keyof RegisterErrors)[]).forEach((key) => {
      if (!checks[key].valid) errors[key] = checks[key].message!;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }
    setFieldErrors({});

    try {
      await authApi.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: "client",
      });

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Inscription impossible. Réessayez."));
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
              Créer un compte
            </h1>
            <p className="text-sm text-text-muted">
              Espace client — email ou inscription par SMS.
            </p>
          </div>

          <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]">
            {!success && (
              <>
                <GoogleSignInSection
                  variant="signup"
                  signupRole="client"
                  onError={(msg) => setFormError(msg)}
                />
                <div className="h-px bg-border my-6 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-text-muted uppercase tracking-widest">
                    OU
                  </span>
                </div>
                <AuthMethodTabs value={method} onChange={setMethod} />
              </>
            )}

            {formError && (
              <div className="form-banner-error mb-6" role="alert">
                {formError}
              </div>
            )}

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary-dk mb-2">
                  Compte créé !
                </h2>
                <p className="text-text-muted mb-6">
                  Vérifiez vos emails pour confirmer votre inscription avant de
                  créer une demande d&apos;intervention.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/login" className="btn btn-primary w-full justify-center">
                    Aller à la connexion
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Accéder au tableau de bord
                  </Link>
                </div>
              </div>
            ) : method === "sms" ? (
              <SmsAuthPanel mode="register" />
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-5" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Prénom"
                    htmlFor="reg-firstName"
                    error={fieldErrors.firstName}
                    required
                  >
                    <input
                      id="reg-firstName"
                      type="text"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.firstName)}
                      placeholder="Jean"
                    />
                  </FormField>
                  <FormField
                    label="Nom"
                    htmlFor="reg-lastName"
                    error={fieldErrors.lastName}
                    required
                  >
                    <input
                      id="reg-lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.lastName)}
                      placeholder="Dupont"
                    />
                  </FormField>
                </div>
                <FormField
                  label="Email"
                  htmlFor="reg-email"
                  error={fieldErrors.email}
                  required
                >
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={inputClassName(!!fieldErrors.email)}
                    placeholder="jean.dupont@email.com"
                  />
                </FormField>
                <FormField
                  label="Téléphone"
                  htmlFor="reg-phone"
                  error={fieldErrors.phone}
                  required
                >
                  <input
                    id="reg-phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={inputClassName(!!fieldErrors.phone)}
                    placeholder="06 12 34 56 78"
                  />
                </FormField>
                <FormField
                  label="Mot de passe"
                  htmlFor="reg-password"
                  error={fieldErrors.password}
                  hint="Au moins 8 caractères."
                  required
                >
                  <input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={inputClassName(!!fieldErrors.password)}
                    placeholder="Minimum 8 caractères"
                  />
                </FormField>
                <FormField
                  label="Confirmer le mot de passe"
                  htmlFor="reg-confirm"
                  error={fieldErrors.confirmPassword}
                  required
                >
                  <input
                    id="reg-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={inputClassName(!!fieldErrors.confirmPassword)}
                    placeholder="Retapez le même mot de passe"
                  />
                </FormField>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full justify-center py-4 text-lg mt-2 disabled:opacity-50"
                >
                  {isLoading ? "Création du compte…" : "Créer mon compte"}
                </button>
              </form>
            )}

            {!success && (
              <>
                <div className="h-px bg-border my-8 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-text-muted uppercase tracking-widest">
                    OU
                  </span>
                </div>

                <p className="text-sm text-text-muted text-center mb-6">
                  Déjà un compte ?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-extrabold hover:underline"
                  >
                    Se connecter
                  </Link>
                </p>

                <p className="text-[10px] text-text-muted text-center uppercase tracking-widest font-bold">
                  Vous êtes artisan ?{" "}
                  <Link
                    href="/devenir-partenaire"
                    className="text-primary-dk hover:text-primary"
                  >
                    Candidatez ici →
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
