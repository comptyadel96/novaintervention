import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "À propos – Nova Intervention",
  description: "Nova Intervention connecte les particuliers à des artisans certifiés via l'IA. Transparence, rapidité, qualité garantie.",
};

const values = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>, title: "Réactivité", desc: "Intervention en moins de 30 minutes, 24h/24." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>, title: "Fiabilité", desc: "Artisans vérifiés, assurés et notés après mission." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>, title: "Transparence", desc: "Estimation avant intervention. Aucun frais caché." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>, title: "Traçabilité", desc: "Carnet d'entretien numérique enrichi à chaque fois." },
];

const pricing = [
  { plan: "Particulier", price: "9,90 €", period: "/mois", features: ["Nova Score logement", "Carnet d'entretien", "Historique interventions", "Alertes préventives", "Factures digitales"] },
  { plan: "Artisan", price: "49 €", period: "/mois", features: ["Profil certifié", "Accès missions qualifiées", "Tableau de bord revenus", "Notifications push", "Support prioritaire"], highlight: true },
];

export default function AboutPage() {
  return (
    <div className="page-wrap bg-bg-body">
      <Header />

      {/* Dynamic Header for About Page */}
      <div className="relative w-full min-h-[35vh] flex items-end pb-12 pt-28 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-grid opacity-50"></div>
        <div className="container relative z-10">
          <nav className="flex items-center gap-2 text-sm text-text-muted font-bold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-primary-dk">À propos</span>
          </nav>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
              La plateforme qui digitalise le marché des services à domicile
            </h1>
            <p className="text-lg text-text-muted leading-relaxed max-w-3xl">
              Nova Intervention connecte les particuliers à des artisans certifiés via une IA performante. Prix fixe affiché avant intervention, artisan en route en moins de 30 min, chaque intervention documentée.
            </p>
          </div>
        </div>
      </div>

      <main className="container py-16">
        
        {/* Le Problème */}
        <section className="card bg-dots mb-16 border-border">
          <div className="max-w-3xl">
            <h2 className="h2 mb-4 text-primary-dk">Le problème qu'on résout</h2>
            <p className="text-base text-text-muted leading-relaxed">
              Trouver un artisan fiable en urgence en France est un parcours du combattant. Prix opaques, délais imprévisibles,
              zéro traçabilité. Nova Intervention digitalise ce marché de 12 milliards d'euros
              et y ajoute une couche de données unique : le carnet médical du logement.
            </p>
          </div>
        </section>

        {/* Valeurs */}
        <section className="mb-20">
          <h2 className="h2 mb-8 text-primary-dk">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card bg-bg-alt border-border transition-colors hover:border-primary-lt">
                <span className="text-primary mb-4 flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-sm border border-border">
                  {v.icon}
                </span>
                <h3 className="font-bold text-primary-dk text-xl mb-2">{v.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tarifs */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="h2 mb-2 text-primary-dk">Nos abonnements</h2>
            <p className="text-text-muted">Des tarifs simples et transparents pour particuliers et artisans.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((p) => (
              <div
                key={p.plan}
                className={`rounded-[2rem] p-8 md:p-10 relative flex flex-col ${p.highlight ? 'border-primary shadow-[0_20px_40px_rgba(12,76,147,0.15)] bg-primary border-transparent' : 'bg-bg-alt border border-[rgba(12,76,147,0.06)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
              >
                {p.highlight && (
                  <span className="absolute -top-4 right-8 bg-white text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                    Recommandé
                  </span>
                )}
                <p className={`font-bold uppercase tracking-widest mb-3 ${p.highlight ? 'text-white/80' : 'text-primary'}`}>
                  {p.plan}
                </p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className={`text-5xl font-extrabold ${p.highlight ? 'text-white' : 'text-primary-dk'}`} style={{ fontFamily: "var(--font-display)" }}>{p.price}</span>
                  <span className={p.highlight ? 'text-white/70' : 'text-text-muted'}>{p.period}</span>
                </div>
                <ul className="flex flex-col gap-4 mb-10 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-center gap-3 text-sm ${p.highlight ? 'text-white/90' : 'text-text-muted'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={p.highlight ? 'text-white' : 'text-primary'}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.highlight ? "/devenir-partenaire" : "/register"}
                  className={`btn w-full ${p.highlight ? 'bg-white text-primary hover:bg-bg-alt' : 'bg-primary text-white hover:bg-primary-lt'}`}
                >
                  Commencer →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="cta-section bg-dots border-primary/20">
          <div>
            <h2 className="h2 mb-2 text-primary-dk">Prêt à commencer ?</h2>
            <p className="text-text-muted">Rejoignez Nova Intervention dès aujourd'hui.</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link href="/devenir-partenaire" className="btn btn-primary">Je suis artisan</Link>
            <Link href="/demander" className="btn btn-outline bg-white">Je suis particulier</Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
