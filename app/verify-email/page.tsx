"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { authApi } from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api/errors";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Lien invalide : token manquant.");
      return;
    }

    authApi
      .verifyEmail(token)
      .then(() => {
        setStatus("ok");
        router.refresh();
      })
      .catch((err) => {
        setStatus("error");
        setError(getErrorMessage(err, "Lien invalide ou expiré."));
      });
  }, [token, router]);

  if (status === "loading") {
    return (
      <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem] text-center text-text-muted">
        Confirmation de votre email en cours…
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem] text-center">
        <h2 className="text-2xl font-extrabold text-primary-dk mb-2">
          Email confirmé
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Vous pouvez maintenant utiliser toutes les fonctionnalités de la
          plateforme.
        </p>
        <Link href="/dashboard" className="btn btn-primary">
          Accéder au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem] text-center">
      <h2 className="text-2xl font-extrabold text-primary-dk mb-2">
        Confirmation impossible
      </h2>
      <p className="text-sm text-red-600 mb-6">{error}</p>
      <div className="flex flex-col gap-3">
        <Link href="/login" className="btn btn-primary">
          Se connecter
        </Link>
        <Link href="/dashboard" className="text-sm text-primary font-semibold">
          Tableau de bord (renvoyer l&apos;email)
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
              Vérification email
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
