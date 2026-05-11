"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      alert("Votre mot de passe a été mis à jour avec succès.");
      router.push("/login");
    }
  };

  return (
    <div className="page-wrap flex flex-col min-h-screen bg-bg-body">
      <Header />
      <div className="auth-wrap flex-1 flex items-center justify-center py-12 px-4 text-primary-dk">
        <div className="auth-box w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Nouveau mot de passe
            </h1>
            <p className="text-sm text-text-muted">
              Définissez votre nouveau mot de passe sécurisé.
            </p>
          </div>

          <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full" 
                  placeholder="••••••••" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input w-full" 
                  placeholder="••••••••" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn btn-primary w-full justify-center py-4 text-lg shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isLoading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
