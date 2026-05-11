"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Un email de réinitialisation a été envoyé à votre adresse." });
    }
    setIsLoading(false);
  };

  return (
    <div className="page-wrap flex flex-col min-h-screen bg-bg-body">
      <Header />
      <div className="auth-wrap flex-1 flex items-center justify-center py-12 px-4 text-primary-dk">
        <div className="auth-box w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Mot de passe oublié
            </h1>
            <p className="text-sm text-text-muted">
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]">
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
                message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleResetRequest} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Adresse email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full" 
                  placeholder="jean.dupont@email.com" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn btn-primary w-full justify-center py-4 text-lg shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isLoading ? "Envoi..." : "Envoyer le lien"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link href="/login" className="text-sm font-bold text-primary hover:underline">
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
