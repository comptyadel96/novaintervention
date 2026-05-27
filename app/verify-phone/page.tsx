"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmsAuthPanel } from "@/components/auth/SmsAuthPanel";
import { authApi } from "@/services/api/auth";

export default function VerifyPhonePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    authApi
      .getSession()
      .then(() => setChecking(false))
      .catch(() => router.replace("/login"));
  }, [router]);

  if (checking) {
    return (
      <div className="page-wrap flex flex-col min-h-screen bg-bg-body">
        <Header />
        <div className="flex-1 flex items-center justify-center text-text-muted">
          Chargement…
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrap flex flex-col min-h-screen bg-bg-body">
      <Header />
      <div className="auth-wrap flex-1 flex items-center justify-center py-12 px-4">
        <div className="auth-box w-full max-w-md">
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-extrabold text-primary-dk mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Lier votre numéro
            </h1>
            <p className="text-sm text-text-muted">
              Associez un numéro mobile à votre compte email pour recevoir des
              alertes SMS.
            </p>
          </div>

          <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]">
            <SmsAuthPanel mode="link" />
            <p className="text-sm text-text-muted text-center mt-6">
              <Link href="/dashboard" className="text-primary font-semibold hover:underline">
                Retour au tableau de bord
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
