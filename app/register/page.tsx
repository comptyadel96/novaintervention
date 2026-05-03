import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Créer un compte – Nova Intervention",
  description: "Créez votre espace Nova Intervention pour suivre vos interventions et accéder à votre Carnet Nova.",
};

export default function RegisterPage() {
  return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div className="auth-wrap" style={{ flex: 1 }}>
        <div className="auth-box">
          <div className="auth-box__header">
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: "var(--primary-dk)", marginBottom: "0.35rem" }}>
              Nova <span style={{ color: "var(--primary)" }}>Intervention</span>
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-dk)", marginBottom: "0.5rem" }}>
              Créer un compte
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
              Espace client — accès au Carnet Nova et suivi des interventions.
            </p>
          </div>
          <div className="auth-box__card">
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Prénom</label>
                  <input type="text" className="form-input" placeholder="Jean" />
                </div>
                <div>
                  <label className="form-label">Nom</label>
                  <input type="text" className="form-input" placeholder="Dupont" />
                </div>
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="jean.dupont@email.com" />
              </div>
              <div>
                <label className="form-label">Téléphone</label>
                <input type="tel" className="form-input" placeholder="06 00 00 00 00" />
              </div>
              <div>
                <label className="form-label">Mot de passe</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
              <div>
                <label className="form-label">Confirmer le mot de passe</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: "0.25rem" }}>
                Créer mon compte
              </button>
            </form>
            <div className="divider" />
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center" }}>
              Déjà un compte ?{" "}
              <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Se connecter</Link>
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.75rem" }}>
              Vous êtes artisan ?{" "}
              <Link href="/devenir-partenaire" style={{ color: "var(--muted)" }}>Candidatez ici →</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
