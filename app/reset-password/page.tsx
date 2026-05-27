"use client";



import { Suspense, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Header } from "@/components/layout/Header";

import { Footer } from "@/components/layout/Footer";

import { FormField, inputClassName } from "@/components/forms/FormField";

import { authApi } from "@/services/api/auth";

import { getErrorMessage } from "@/lib/api/errors";

import { validatePassword, validatePasswordConfirm } from "@/lib/forms/validate";



function ResetPasswordForm() {

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{

    password?: string;

    confirmPassword?: string;

  }>({});

  const [formError, setFormError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const resetToken = searchParams.get("token") ?? undefined;



  const handleUpdatePassword = async (e: React.FormEvent) => {

    e.preventDefault();

    setFormError(null);



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



    if (!resetToken) {

      setFormError(

        "Le lien de réinitialisation est invalide ou expiré. Demandez un nouvel email.",

      );

      return;

    }



    setIsLoading(true);



    try {

      await authApi.resetPassword(password, resetToken);

      router.push("/login?reset=success");

    } catch (err) {

      setFormError(getErrorMessage(err, "Réinitialisation impossible."));

      setIsLoading(false);

    }

  };



  return (

    <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]">

      {formError && (

        <div className="form-banner-error mb-6" role="alert">

          {formError}

        </div>

      )}



      <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5" noValidate>

        <FormField

          label="Nouveau mot de passe"

          htmlFor="reset-password"

          error={fieldErrors.password}

          hint="Au moins 8 caractères."

          required

        >

          <input

            id="reset-password"

            type="password"

            autoComplete="new-password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            className={inputClassName(!!fieldErrors.password)}

            placeholder="Minimum 8 caractères"

          />

        </FormField>

        <FormField

          label="Confirmer le mot de passe"

          htmlFor="reset-confirm"

          error={fieldErrors.confirmPassword}

          required

        >

          <input

            id="reset-confirm"

            type="password"

            autoComplete="new-password"

            value={confirmPassword}

            onChange={(e) => setConfirmPassword(e.target.value)}

            className={inputClassName(!!fieldErrors.confirmPassword)}

            placeholder="Retapez le même mot de passe"

          />

        </FormField>

        <button

          type="submit"

          disabled={isLoading}

          className="btn btn-primary w-full justify-center py-4 text-lg disabled:opacity-50"

        >

          {isLoading ? "Mise à jour…" : "Réinitialiser le mot de passe"}

        </button>

      </form>

    </div>

  );

}



export default function ResetPasswordPage() {

  return (

    <div className="page-wrap flex flex-col min-h-screen bg-bg-body">

      <Header />

      <div className="auth-wrap flex-1 flex items-center justify-center py-12 px-4 text-primary-dk">

        <div className="auth-box w-full max-w-md">

          <div className="text-center mb-8">

            <h1

              className="text-3xl font-extrabold mb-2"

              style={{ fontFamily: "var(--font-display)" }}

            >

              Nouveau mot de passe

            </h1>

            <p className="text-sm text-text-muted">

              Choisissez un mot de passe d&apos;au moins 8 caractères.

            </p>

          </div>



          <Suspense

            fallback={

              <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem] text-center text-text-muted">

                Chargement…

              </div>

            }

          >

            <ResetPasswordForm />

          </Suspense>

        </div>

      </div>

      <Footer />

    </div>

  );

}

