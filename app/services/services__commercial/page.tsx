import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Installation & remplacement plomberie | Nova Intervention",
  description: "Installation complète : chauffe-eau, appareil sanitaire, robinetterie, réseau de tuyauterie. Devis gratuit.",
};

const installations = [
  { icon: "🚿", title: "Appareil sanitaire", desc: "Installation ou remplacement de lavabo, WC, douche, baignoire, bidet et robinetterie associée." },
  { icon: "🔥", title: "Chauffe-eau & production d'eau chaude", desc: "Remplacement de chauffe-eau électrique, thermodynamique ou au gaz. Ballon solaire." },
  { icon: "🪠", title: "Réseau de tuyauterie", desc: "Remplacement ou extension de canalisations en cuivre, PER, multicouche ou PVC." },
  { icon: "🛁", title: "Remplacement de baignoire", desc: "Dépose de l'ancienne baignoire et installation d'une nouvelle, avec raccordement complet." },
  { icon: "🔧", title: "Robinetterie & mitigeurs", desc: "Remplacement de robinets, mitigeurs thermostatiques, vannes d'arrêt et équipements sanitaires." },
];

export default function CommercialPage() {
  return (
    <div className="page-wrap">
      <Header />
      <main className="main-content">
        <nav className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span className="breadcrumb__sep">›</span>
          <Link href="/services">Services</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Installation & remplacement</span>
        </nav>

        <div className="content-sidebar">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <section className="card-xl">
              <p className="label" style={{ marginBottom: "0.75rem" }}>🔧 Installation & remplacement</p>
              <h1 className="page-title" style={{ marginBottom: "1rem" }}>Installations planifiées par des pros</h1>
              <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                Contactez-nous pour planifier installation & remplacement : appareil sanitaire, robinetterie, production d&apos;eau chaude, réseau de tuyauterie.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/demander" className="btn btn-primary">Réservez un plombier !</Link>
                <Link href="tel:0788209773" className="btn btn-green">07 88 20 97 73</Link>
              </div>
            </section>

            <section className="card-xl" style={{ background: "var(--navy-mid)" }}>
              <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Nos prestations d&apos;installation</h2>
              <div className="problem-list">
                {installations.map((p) => (
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
              <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Comment planifier votre installation ?</h2>
              <div className="process-list">
                {[
                  { num: "01", title: "Décrivez votre projet", body: "Partagez vos besoins et photos. Un devis précis est établi avant toute intervention." },
                  { num: "02", title: "Planification et intervention", body: "Un artisan certifié intervient au créneau qui vous convient, équipé pour réaliser les travaux en une seule visite." },
                  { num: "03", title: "Réception et garantie", body: "Travaux vérifiés, paiement sécurisé et carnet d'entretien mis à jour. Garantie incluse." },
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
              <p style={{ color: "var(--muted)", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>Devis gratuit avant toute intervention planifiée.</p>
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
