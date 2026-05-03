import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services plomberie – Nova Intervention",
  description: "Dépannage urgence, réparations, installations et débouchage. Des artisans certifiés interviennent rapidement.",
};

const services = [
  {
    href: "/services/services__emergency",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
    title: "Dépannage d'urgence",
    desc: "Intervention rapide 24h/24, 7j/7 pour toutes urgences. Diagnostic inclus, prix transparent.",
    tags: ["Urgent", "24h/7j"],
  },
  {
    href: "/services/services__residential",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>,
    title: "Réparation & fuite d'eau",
    desc: "Fuite sur tuyau, robinetterie défectueuse... Réparation durable avec pièces certifiées.",
    tags: ["Réparation", "Résidentiel"],
  },
  {
    href: "/services/services__commercial",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    title: "Installation & remplacement",
    desc: "Installation complète : chauffe-eau, réseau tuyauterie. Devis gratuit.",
    tags: ["Installation", "Planifié"],
  },
  {
    href: "/services/services__debouchage_conduites",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    title: "Débouchage des conduites",
    desc: "WC, évier bouchés ? Furet, hydrocurage. Résolution extrêmement rapide.",
    tags: ["Débouchage", "Urgent"],
  },
];

const reasons = [
  { num: "1", label: "Techniciens certifiés et assurés" },
  { num: "2", label: "Disponibilité 24h/24 – 7j/7" },
  { num: "3", label: "Prix transparents et encadrés" },
  { num: "4", label: "Paiement sécurisé après intervention" },
  { num: "5", label: "Aucun frais caché" },
  { num: "6", label: "Intervention garantie" },
];

export default function ServicesPage() {
  return (
    <div className="page-wrap bg-bg-body">
      <Header />
      
      {/* Dynamic Sub-header */}
      <div className="relative w-full min-h-[30vh] flex items-end pb-12 pt-28 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-dots opacity-50"></div>
        <div className="container relative z-10">
          <p className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Expertise professionnelle</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Nos services de plomberie
          </h1>
          <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
            Des artisans qualifiés interviennent rapidement pour toutes vos urgences, installations ou réparations.
          </p>
        </div>
      </div>

      <main className="container py-16">

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((s) => (
            <Link key={s.href} href={s.href} className="group relative bg-bg-body border border-border p-8 rounded-[2rem] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(12,76,147,0.15)] hover:border-primary-lt overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
              <div className="text-primary mb-6">{s.icon}</div>
              <div className="flex gap-2 flex-wrap mb-4">
                {s.tags.map((t) => (
                  <span key={t} className="px-3 py-1 bg-bg-alt text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-border">{t}</span>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-primary-dk mb-3">{s.title}</h2>
              <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-6">{s.desc}</p>
              <div className="flex items-center text-sm font-bold text-primary uppercase tracking-widest transition-transform group-hover:translate-x-2">
                Découvrir le service →
              </div>
            </Link>
          ))}
        </div>

        {/* Why us */}
        <div className="bg-dots border border-border p-10 md:p-14 rounded-[2.5rem] mb-12 shadow-sm">
          <h2 className="h2 text-primary-dk mb-10 text-center">Pourquoi faire appel à Nova Interactive ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((r) => (
              <div key={r.num} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-border/50">
                <span className="w-10 h-10 rounded-full bg-bg-alt text-primary flex items-center justify-center font-bold text-lg flex-shrink-0 border border-border">{r.num}</span>
                <span className="font-semibold text-primary-dk">{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section bg-[var(--bg-alt)] mt-6">
          <div>
            <h2 className="h2 mb-2 text-primary-dk">Besoin d'un artisan urgemment ?</h2>
            <p className="text-text-muted">Réponse sous 30 min, 24h/7j.</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link href="tel:+33788209773" className="btn btn-primary">📞 07 88 20 97 73</Link>
            <Link href="/demander" className="btn btn-outline bg-white">Demander en ligne</Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
