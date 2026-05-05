"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        throw new Error("Erreur de configuration : Variables d'environnement Supabase manquantes.");
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'client',
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
      } else {
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err: any) {
      console.error("Registration Error:", err);
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
              Créer un compte
            </h1>
            <p className="text-sm text-text-muted">
              Espace client — accès au Carnet Nova et suivi des interventions.
            </p>
          </div>

          <div className="card bg-white border border-border shadow-2xl p-8 rounded-[2rem]">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-primary-dk mb-2">Compte créé !</h2>
                <p className="text-text-muted mb-6">
                  Vérifiez vos emails pour confirmer votre inscription. Vous allez être redirigé vers la page de connexion.
                </p>
                <Link href="/login" className="btn btn-primary w-full justify-center">
                  Aller à la connexion
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-primary-dk mb-1.5">Prénom</label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="form-input w-full bg-bg-alt/30" 
                      placeholder="Jean" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary-dk mb-1.5">Nom</label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="form-input w-full bg-bg-alt/30" 
                      placeholder="Dupont" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary-dk mb-1.5">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input w-full bg-bg-alt/30" 
                    placeholder="jean.dupont@email.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary-dk mb-1.5">Téléphone</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="form-input w-full bg-bg-alt/30" 
                    placeholder="06 12 34 56 78" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary-dk mb-1.5">Mot de passe</label>
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="form-input w-full bg-bg-alt/30" 
                    placeholder="••••••••" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary-dk mb-1.5">Confirmer</label>
                  <input 
                    type="password" 
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="form-input w-full bg-bg-alt/30" 
                    placeholder="••••••••" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn btn-primary w-full justify-center py-4 text-lg shadow-lg shadow-primary/20 mt-2"
                >
                  {isLoading ? "Création..." : "Créer mon compte"}
                </button>
              </form>
            )}

            {!success && (
              <>
                <div className="h-px bg-border my-8 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-text-muted uppercase tracking-widest">OU</span>
                </div>
                
                <p className="text-sm text-text-muted text-center mb-6">
                  Déjà un compte ?{" "}
                  <Link href="/login" className="text-primary font-extrabold hover:underline">Se connecter</Link>
                </p>

                <p className="text-[10px] text-text-muted text-center uppercase tracking-widest font-bold">
                  Vous êtes artisan ?{" "}
                  <Link href="/devenir-partenaire" className="text-primary-dk hover:text-primary">Candidatez ici →</Link>
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
