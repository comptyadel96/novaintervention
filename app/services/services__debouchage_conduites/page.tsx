import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Débouchage des conduites – Plomberie | Nova Intervention",
  description: "WC, évier, douche bouchés ? Furet, hydrocurage et inspection caméra. Intervention rapide et efficace.",
};

const problems = [
  { icon: "🚽", title: "WC bouché", desc: "Toilettes bloquées ? Débouchage rapide par furet manuel ou électrique." },
  { icon: "🚰", title: "Évier ou lavabo bouché", desc: "Bonde ou siphon encrassé. Débouchage propre et rapide sans produit chimique." },
  { icon: "🛁", title: "Douche / baignoire bouchée", desc: "Eau stagnante dans la douche ? Débouchage du siphon et de l'évacuation." },
  { icon: "🏠", title: "Canalisation principale bouchée", desc: "Hydrocurage haute pression pour les canalisations collectives ou principales très encrassées." },
  { icon: "🌿", title: "Racines dans les canalisations", desc: "Inspection caméra et fraisage des racines qui obstruent vos évacuations enterrées." },
];

const methods = [
  { icon: "🔩", title: "Furet manuel", desc: "Pour débouchages courants sur WC, siphons et évacuations." },
  { icon: "⚡", title: "Furet électrique", desc: "Pour les bouchons tenaces dans les canalisations plus profondes." },
  { icon: "💦", title: "Hydrocurage", desc: "Nettoyage haute pression des canalisations collectives ou très encrassées." },
  { icon: "📹", title: "Inspection caméra", desc: "Diagnostic précis pour localiser la source du bouchon ou une casse." },
];

export default function DebouchagePage() {
  return (
    <div className="page-wrap">
      <Header />
      <main className="main-content">
        <nav className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span className="breadcrumb__sep">›</span>
          <Link href="/services">Services</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Débouchage des conduites</span>
        </nav>

        <div className="content-sidebar">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <section className="card-xl">
              <p className="label" style={{ marginBottom: "0.75rem" }}>💦 Débouchage des conduites</p>
              <h1 className="page-title" style={{ marginBottom: "1rem" }}>WC, évier ou douche bouché ? Intervention rapide.</h1>
              <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                Furet, hydrocurage et intervention rapide pour déboucher vos canalisations. Nos artisans interviennent avec le matériel professionnel adapté.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/demander" className="btn btn-primary">Réservez un plombier !</Link>
                <Link href="tel:0788209773" className="btn btn-green">Appel d&apos;urgence</Link>
              </div>
            </section>

            <section className="card-xl" style={{ background: "var(--navy-mid)" }}>
              <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Types de débouchages</h2>
              <div className="problem-list">
                {problems.map((p) => (
                  <div key={p.title} className="problem-item">
                    <span className="problem-icon">{p.icon}</span>
                    <div>
                      <p className="problem-title">{p.title}</p>
                      <p className="problem-desc">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-xl" style={{ background: "var(--navy-mid)" }}>
              <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Méthodes professionnelles</h2>
              <div className="grid-2">
                {methods.map((m) => (
                  <div key={m.title} className="card" style={{ background: "var(--navy)" }}>
                    <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem" }}>{m.icon}</span>
                    <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.35rem", fontFamily: "var(--font-sans)" }}>{m.title}</h3>
                    <p style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.55 }}>{m.desc}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <aside className="sidebar">
            <div className="sidebar__card">
              <h3 className="h3" style={{ marginBottom: "0.5rem" }}>Réservez un plombier !</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>Un technicien avec le bon matériel intervient rapidement.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link href="tel:0788209773" className="btn btn-green btn-full">07 88 20 97 73</Link>
                <Link href="/demander" className="btn btn-primary btn-full">Demander en ligne</Link>
              </div>
            </div>

            <div className="sidebar__card--mid">
              <h3 className="h3" style={{ marginBottom: "1rem" }}>6 raisons de nous faire confiance</h3>
              <div className="why-list">
                {["Techniciens certifiés et assurés", "Intervention rapide 24h/24 – 7j/7", "Prix transparents et encadrés", "Paiement sécurisé", "Aucun frais caché", "Intervention garantie"].map((w, i) => (
                  <div key={w} className="why-item">
                    <span className="why-num">{i + 1}</span>
                    <span className="why-label">{w}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar__card--mid">
              <h3 className="h3" style={{ marginBottom: "1rem" }}>Autres services</h3>
              {[
                { href: "/services/services__emergency", label: "Dépannage d'urgence" },
                { href: "/services/services__residential", label: "Réparation & fuite d'eau" },
                { href: "/services/services__commercial", label: "Installation & remplacement" },
              ].map((s) => (
                <Link key={s.href} href={s.href} className="site-footer__link" style={{ display: "block", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>→ {s.label}</Link>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
