import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Réparation & fuite d'eau – Plomberie | Nova Intervention",
  description: "Fuite de tuyau, robinetterie défectueuse, baignoire qui fuit. Artisan certifié avec devis transparent.",
};

const problems = [
  { icon: "💧", title: "Fuite de tuyau", desc: "Fuite sur canalisation encastrée ou apparente ? Localisation précise et réparation durable." },
  { icon: "🚰", title: "Robinetterie défectueuse", desc: "Remplacement de robinets, mitigeurs, douchettes, flexibles, joints et cartouches." },
  { icon: "🛁", title: "Baignoire / douche qui fuit", desc: "Fuite au niveau de la bonde, du siphon ou du joint de baignoire. Intervention rapide." },
  { icon: "🔩", title: "Chauffe-eau qui fuit", desc: "Fuite sur le groupe de sécurité, les raccords ou le ballon. Diagnostic et réparation." },
  { icon: "🪠", title: "Canalisation bouchée", desc: "Évacuation lente ou complètement bouchée ? Débouchage par furet ou hydrocurage." },
];

export default function ResidentialPage() {
  return (
    <div className="page-wrap">
      <Header />
      <main className="main-content">
        <nav className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span className="breadcrumb__sep">›</span>
          <Link href="/services">Services</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Réparation & fuite d&apos;eau</span>
        </nav>

        <div className="content-sidebar">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <section className="card-xl">
              <p className="label" style={{ marginBottom: "0.75rem" }}>💧 Réparation & fuite d&apos;eau</p>
              <h1 className="page-title" style={{ marginBottom: "1rem" }}>Fuites et réparations plomberie, résolues rapidement</h1>
              <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                Après diagnostic, nous réparons fuites, robinetterie, canalisations, chauffe-eau — devis transparent et artisans certifiés.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/demander" className="btn btn-primary">Réservez un plombier !</Link>
                <Link href="tel:0788209773" className="btn btn-green">Appel d&apos;urgence</Link>
              </div>
            </section>

            <section className="card-xl" style={{ background: "var(--navy-mid)" }}>
              <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Types de réparations</h2>
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
              <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Comment fonctionne le service ?</h2>
              <div className="process-list">
                {[
                  { num: "01", title: "Envoyez une photo de la fuite", body: "Notre IA analyse la photo et vous propose une estimation transparente en quelques secondes." },
                  { num: "02", title: "Un artisan certifié intervient", body: "Sélectionné pour son expertise, il arrive équipé pour résoudre le problème dès le premier passage." },
                  { num: "03", title: "Paiement après intervention", body: "Vous payez uniquement une fois satisfait. Aucun frais caché, aucune surprise." },
                ].map((s) => (
                  <div key={s.num} className="process-item">
                    <span className="process-num">{s.num}</span>
                    <div className="process-body"><h3>{s.title}</h3><p>{s.body}</p></div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <aside className="sidebar">
            <div className="sidebar__card">
              <h3 className="h3" style={{ marginBottom: "0.5rem" }}>Réservez un plombier !</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>Devis gratuit avant toute intervention.</p>
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
                { href: "/services/services__commercial", label: "Installation & remplacement" },
                { href: "/services/services__debouchage_conduites", label: "Débouchage des conduites" },
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
