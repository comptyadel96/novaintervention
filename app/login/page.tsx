"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        throw new Error("Erreur de configuration : Variables d'environnement Supabase manquantes.");
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Une erreur inattendue est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrap flex flex-col min-h-screen bg-bg-body">
      <Header />
      <div className="auth-wrap flex-1 flex items-center justify-center py-12 px-4">
        <div className="auth-box w-full max-w-md">
          <div className="auth-box__header text-center mb-8">
            <p className="text-xl font-extrabold text-primary-dk mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Nova <span className="text-primary">Intervention</span>
            </p>
            <h1 className="text-2xl font-extrabold text-primary-dk mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Connexion
            </h1>
            <p className="text-sm text-text-muted">
              Accédez à votre espace client ou artisan.
            </p>
          </div>
          
          <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-primary-dk mb-2">Adresse email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full" 
                  placeholder="jean.dupont@email.com" 
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-primary-dk">Mot de passe</label>
                  <Link href="#" className="text-xs font-bold text-primary hover:underline">Mot de passe oublié ?</Link>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full" 
                  placeholder="••••••••" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn btn-primary w-full justify-center py-4 text-lg shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
            
            <div className="h-px bg-border my-8 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-text-muted uppercase tracking-widest">OU</span>
            </div>
            
            <p className="text-sm text-text-muted text-center">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-primary font-extrabold hover:underline">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
