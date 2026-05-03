import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dépannage plomberie urgence 24h/7j | Nova Intervention",
  description: "Plombier en urgence : fuite, panne chauffe-eau, WC bouché. Diagnostic rapide, artisan certifié en less de 30 min. Devis transparent.",
};

const problems = [
  { icon: "🚿", title: "Panne de chauffe-eau", desc: "Plus d'eau chaude ? Diagnostic rapide et réparation ou remplacement si nécessaire." },
  { icon: "🔧", title: "Canalisation bouchée", desc: "WC, évier ou douche bouchés ? Débouchage rapide avec matériel professionnel." },
  { icon: "🚽", title: "WC / chasse d'eau en panne", desc: "Fuite ou mécanisme défectueux ? Réparation rapide avec diagnostic inclus." },
  { icon: "🪛", title: "Robinet défectueux", desc: "Robinet qui fuit ou à remplacer ? Intervention propre et durable." },
  { icon: "💧", title: "Fuite d'eau visible", desc: "Fuite sur tuyau, raccord ou robinet ? Intervention rapide pour éviter les dégâts." },
];

const otherServices = [
  { href: "/services/services__residential", label: "Réparation & fuite d'eau" },
  { href: "/services/services__commercial",  label: "Installation & remplacement" },
  { href: "/services/services__debouchage_conduites", label: "Débouchage des conduites" },
];

export default function EmergencyPage() {
  return (
    <div className="page-wrap">
      <Header />
      <main className="main-content">

        <nav className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span className="breadcrumb__sep">›</span>
          <Link href="/services">Services</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Dépannage d&apos;urgence</span>
        </nav>

        <div className="content-sidebar">
          {/* Main column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Hero */}
            <section className="card-xl">
              <p className="label" style={{ marginBottom: "0.75rem" }}>🚨 Dépannage d&apos;urgence</p>
              <h1 className="page-title" style={{ marginBottom: "1rem" }}>Une urgence ne doit pas devenir un stress</h1>
              <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                Fuite d&apos;eau, canalisation bouchée, panne de chauffe-eau… Avec Nova Intervention, un professionnel qualifié est envoyé rapidement avec un diagnostic précis pour intervenir efficacement dès le premier déplacement.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/demander" className="btn btn-primary">Demander une intervention</Link>
                <Link href="tel:0788209773" className="btn btn-green">Appel d&apos;urgence</Link>
              </div>
            </section>

            {/* Problems */}
            <section className="card-xl" style={{ background: "var(--navy-mid)" }}>
              <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Vos problèmes de plomberie, résolus rapidement</h2>
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

            {/* Process */}
            <section className="card-xl" style={{ background: "var(--navy-mid)" }}>
              <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Une intervention simple, rapide et sans risque</h2>
              <div className="process-list">
                {[
                  { num: "01", title: "Décrivez votre problème en quelques secondes", body: "Prenez une photo et expliquez votre besoin. Vous recevez une estimation claire avant intervention." },
                  { num: "02", title: "Un artisan intervient rapidement", body: "Un professionnel certifié, sélectionné et vérifié, intervient avec toutes les informations nécessaires pour résoudre votre problème dès le premier passage." },
                  { num: "03", title: "Paiement sécurisé", body: "Vous ne payez qu'une fois le travail terminé et validé. Aucun dépassement sans votre accord." },
                ].map((s) => (
                  <div key={s.num} className="process-item">
                    <span className="process-num">{s.num}</span>
                    <div className="process-body">
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Carnet */}
            <section className="card-xl" style={{ background: "var(--navy-mid)" }}>
              <h2 className="h2" style={{ marginBottom: "0.75rem" }}>Un suivi intelligent de votre logement</h2>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                Chaque intervention génère un carnet d&apos;entretien digital.
              </p>
              <div className="feature-grid">
                {["Historique complet", "Recommandations personnalisées", "Prévention des pannes", "Valorisation de votre bien"].map((f) => (
                  <div key={f} className="feature-item">{f}</div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar__card">
              <h3 className="h3" style={{ marginBottom: "0.5rem" }}>Besoin d&apos;une intervention immédiate ?</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Un technicien peut intervenir chez vous rapidement.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link href="tel:0788209773" className="btn btn-green btn-full">07 88 20 97 73</Link>
                <Link href="/demander" className="btn btn-primary btn-full">Demander en ligne</Link>
              </div>
            </div>

            <div className="sidebar__card--mid">
              <h3 className="h3" style={{ marginBottom: "1rem" }}>Pourquoi choisir Nova ?</h3>
              <div className="why-list">
                {[
                  "Techniciens certifiés et assurés",
                  "Intervention rapide 24h/24 – 7j/7",
                  "Prix transparents et encadrés",
                  "Paiement sécurisé",
                  "Aucun frais caché",
                  "Intervention garantie",
                ].map((w, i) => (
                  <div key={w} className="why-item">
                    <span className="why-num">{i + 1}</span>
                    <span className="why-label">{w}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar__card--mid">
              <h3 className="h3" style={{ marginBottom: "1rem" }}>Autres services</h3>
              {otherServices.map((s) => (
                <Link key={s.href} href={s.href} className="site-footer__link" style={{ display: "block", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  → {s.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
