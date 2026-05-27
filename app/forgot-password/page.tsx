"use client";



import { useState } from "react";

import Link from "next/link";

import { Header } from "@/components/layout/Header";

import { Footer } from "@/components/layout/Footer";

import { FormField, inputClassName } from "@/components/forms/FormField";

import { authApi } from "@/services/api/auth";

import { getErrorMessage } from "@/lib/api/errors";

import { validateEmail } from "@/lib/forms/validate";



export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState<{

    type: "success" | "error";

    text: string;

  } | null>(null);



  const handleResetRequest = async (e: React.FormEvent) => {

    e.preventDefault();

    setMessage(null);



    const emailCheck = validateEmail(email);

    if (!emailCheck.valid) {

      setEmailError(emailCheck.message);

      return;

    }

    setEmailError(null);



    setIsLoading(true);



    try {

      await authApi.forgotPassword(email.trim());

      setMessage({

        type: "success",

        text: "Si un compte existe avec cette adresse, un email de réinitialisation vient d'être envoyé. Pensez à vérifier vos spams.",

      });

    } catch (err) {

      setMessage({

        type: "error",

        text: getErrorMessage(err, "Envoi impossible. Réessayez dans quelques instants."),

      });

    }

    setIsLoading(false);

  };



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

              Mot de passe oublié

            </h1>

            <p className="text-sm text-text-muted">

              Saisissez l&apos;email de votre compte pour recevoir un lien de

              réinitialisation.

            </p>

          </div>



          <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]">

            {message && (

              <div

                className={`mb-6 p-4 rounded-xl text-sm font-medium border ${

                  message.type === "success"

                    ? "bg-green-50 border-green-200 text-green-800"

                    : "form-banner-error border-red-200"

                }`}

                role="alert"

              >

                {message.text}

              </div>

            )}



            <form onSubmit={handleResetRequest} className="flex flex-col gap-5" noValidate>

              <FormField

                label="Adresse email"

                htmlFor="forgot-email"

                error={emailError}

                required

              >

                <input

                  id="forgot-email"

                  type="email"

                  autoComplete="email"

                  value={email}

                  onChange={(e) => {

                    setEmail(e.target.value);

                    if (emailError) setEmailError(null);

                  }}

                  className={inputClassName(!!emailError)}

                  placeholder="jean.dupont@email.com"

                />

              </FormField>

              <button

                type="submit"

                disabled={isLoading}

                className="btn btn-primary w-full justify-center py-4 text-lg disabled:opacity-50"

              >

                {isLoading ? "Envoi en cours…" : "Envoyer le lien"}

              </button>

            </form>



            <div className="mt-8 text-center">

              <Link

                href="/login"

                className="text-sm font-bold text-primary hover:underline"

              >

                Retour à la connexion

              </Link>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );

}

