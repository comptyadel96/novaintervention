import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "À propos – Nova Intervention",
  description: "Nova Intervention connecte les particuliers à des artisans certifiés via l'IA. Transparence, rapidité, qualité garantie.",
};

const values = [
  { icon: "⚡", title: "Réactivité", desc: "Intervention en moins de 30 minutes dans la zone desservie, 24h/24." },
  { icon: "🔒", title: "Fiabilité", desc: "Artisans vérifiés, assurés et notés après chaque mission." },
  { icon: "💡", title: "Transparence", desc: "Estimation avant chaque intervention. Aucun frais caché, aucune surprise." },
  { icon: "📋", title: "Traçabilité", desc: "Carnet d'entretien numérique pour chaque logement, enrichi à chaque visite." },
];

const pricing = [
  { plan: "Particulier", price: "9,90 €", period: "/mois", features: ["Nova Score logement", "Carnet d'entretien", "Historique interventions", "Alertes préventives", "Factures digitales"] },
  { plan: "Artisan", price: "49 €", period: "/mois", features: ["Profil certifié", "Accès missions qualifiées", "Tableau de bord revenus", "Notifications push", "Support prioritaire"], highlight: true },
];

export default function AboutPage() {
  return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <main className="main-content" style={{ flex: 1 }}>

        {/* Hero */}
        <section className="card-xl" style={{ marginBottom: "1.5rem" }}>
          <p className="label" style={{ marginBottom: "1rem" }}>À propos</p>
          <h1 className="page-title" style={{ maxWidth: "42rem", marginBottom: "1.25rem" }}>
            La plateforme qui digitalise le marché des services à domicile
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", maxWidth: "46rem" }}>
            Nova Intervention connecte les particuliers à des artisans certifiés via une photo analysée par IA.
            Prix fixe affiché avant intervention, artisan en route en &lt; 30 min, chaque intervention documentée dans un Carnet Nova.
          </p>
        </section>

        {/* Problem */}
        <section className="card-xl" style={{ marginBottom: "1.5rem", background: "var(--navy-mid)" }}>
          <h2 className="h2" style={{ marginBottom: "1rem" }}>Le problème qu&apos;on résout</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--muted)" }}>
            Trouver un artisan fiable en urgence en France est un parcours du combattant. Prix opaques, délais imprévisibles,
            zéro traçabilité, artisans isolés et sous-digitalisés. Nova Intervention digitalise ce marché de 12 milliards d&apos;euros
            et y ajoute une couche de données que personne n&apos;a construite : le dossier médical du logement.
          </p>
        </section>

        {/* Valeurs */}
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Nos valeurs</h2>
          <div className="grid-4">
            {values.map((v) => (
              <div key={v.title} className="card">
                <span style={{ fontSize: "2rem", marginBottom: "1rem", display: "block" }}>{v.icon}</span>
                <h3 className="h3" style={{ marginBottom: "0.5rem" }}>{v.title}</h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tarifs */}
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 className="h2" style={{ marginBottom: "0.5rem" }}>Nos abonnements</h2>
          <p style={{ marginBottom: "1.5rem", color: "var(--muted)" }}>Des tarifs simples et transparents pour particuliers et artisans.</p>
          <div className="grid-2">
            {pricing.map((p) => (
              <div
                key={p.plan}
                className={p.highlight ? "card-xl" : "card"}
                style={{
                  border: p.highlight ? "1px solid rgba(255,107,43,0.4)" : undefined,
                  background: p.highlight ? "linear-gradient(135deg, var(--navy-mid), var(--navy))" : undefined,
                }}
              >
                {p.highlight && (
                  <span className="badge badge-orange" style={{ marginBottom: "1rem" }}>Recommandé</span>
                )}
                <p className="label" style={{ marginBottom: "0.5rem" }}>{p.plan}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#fff" }}>{p.price}</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{p.period}</span>
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
                  {p.features.map((f) => (
                    <li key={f} className="feature-item">{f}</li>
                  ))}
                </ul>
                <Link
                  href={p.highlight ? "/devenir-partenaire" : "/register"}
                  className="btn btn-full"
                  style={{ background: p.highlight ? "var(--orange)" : "rgba(255,255,255,0.08)", color: p.highlight ? "var(--dark)" : "#fff", justifyContent: "center" }}
                >
                  Commencer →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="cta-section">
          <div>
            <h2 className="h2" style={{ marginBottom: "0.5rem" }}>Prêt à commencer ?</h2>
            <p style={{ color: "var(--muted)" }}>Rejoignez Nova Intervention dès aujourd&apos;hui.</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/devenir-partenaire" className="btn btn-primary">Je suis artisan</Link>
            <Link href="/demander" className="btn btn-outline">Je suis particulier</Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
