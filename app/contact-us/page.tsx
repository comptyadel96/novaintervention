import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contactez-nous – Nova Intervention",
  description: "Besoin d'une intervention urgente ou d'un renseignement ? Contactez Nova Intervention par téléphone, email ou via notre formulaire.",
};

const contacts = [
  { icon: "📞", label: "Téléphone", value: "07 88 20 97 73", href: "tel:+33788209773", kind: "orange" as const },
  { icon: "✉️", label: "Email", value: "contact@novaintervention.com", href: "mailto:contact@novaintervention.com", kind: "teal" as const },
  { icon: "🕐", label: "Disponibilité", value: "24h/24 — 7j/7", href: undefined, kind: "green" as const },
];

export default function ContactPage() {
  return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <main className="main-content" style={{ flex: 1 }}>

        <p className="label" style={{ marginBottom: "1rem" }}>Contact</p>
        <h1 className="page-title" style={{ marginBottom: "0.5rem" }}>Contactez-nous</h1>
        <p style={{ color: "var(--muted)", marginBottom: "2.5rem", fontSize: "0.95rem" }}>
          Nous répondons dans les plus brefs délais. Pour les urgences, appelez directement.
        </p>

        {/* Contact info */}
        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          {contacts.map((c) => (
            <div key={c.label} className="info-card">
              <div className={`info-card__icon info-card__icon--${c.kind}`}>{c.icon}</div>
              <div>
                <p className="info-card__label">{c.label}</p>
                {c.href ? (
                  <Link href={c.href} className="info-card__value" style={{ color: "#fff" }}>{c.value}</Link>
                ) : (
                  <p className="info-card__value">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* Form */}
          <div className="card-xl">
            <h2 className="h2" style={{ marginBottom: "0.5rem" }}>Envoyer un message</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Décrivez votre situation et nous vous répondrons rapidement.
            </p>
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
                <label className="form-label">Message</label>
                <textarea className="form-textarea" placeholder="Décrivez votre problème ou votre question…" />
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Info panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card-xl" style={{ background: "var(--navy-mid)" }}>
              <h3 className="h3" style={{ marginBottom: "1rem" }}>Intervention urgente</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Pour tout problème nécessitant une intervention immédiate (fuite, panne, bouchon), appelez directement ou utilisez le formulaire en ligne.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link href="tel:+33788209773" className="btn btn-green btn-full">
                  📞 07 88 20 97 73
                </Link>
                <Link href="/demander" className="btn btn-primary btn-full">
                  Demander en ligne
                </Link>
              </div>
            </div>
            <div className="card">
              <h3 className="h3" style={{ marginBottom: "0.75rem" }}>Vous êtes artisan ?</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.65, marginBottom: "1rem" }}>
                Rejoignez notre réseau de professionnels certifiés et accédez à des missions qualifiées.
              </p>
              <Link href="/devenir-partenaire" style={{ color: "var(--orange)", fontWeight: 700, fontSize: "0.875rem" }}>
                Devenir partenaire →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
