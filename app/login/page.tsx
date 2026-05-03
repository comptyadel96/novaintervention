import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Connexion – Nova Intervention",
  description: "Connectez-vous à votre espace Nova Intervention.",
};

export default function LoginPage() {
  return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div className="auth-wrap" style={{ flex: 1 }}>
        <div className="auth-box">
          <div className="auth-box__header">
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: "0.35rem" }}>
              Nova <span style={{ color: "var(--orange)" }}>Intervention</span>
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
              Connexion
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
              Accédez à votre espace client ou artisan.
            </p>
          </div>
          <div className="auth-box__card">
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Adresse email</label>
                <input type="email" className="form-input" placeholder="jean.dupont@email.com" />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <label className="form-label" style={{ margin: 0 }}>Mot de passe</label>
                  <Link href="#" style={{ fontSize: "0.78rem", color: "var(--orange)" }}>Mot de passe oublié ?</Link>
                </div>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: "0.25rem" }}>
                Se connecter
              </button>
            </form>
            <div className="divider" />
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center" }}>
              Pas encore de compte ?{" "}
              <Link href="/register" style={{ color: "var(--orange)", fontWeight: 600 }}>Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
