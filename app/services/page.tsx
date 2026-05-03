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
    icon: "🚨",
    title: "Dépannage d'urgence",
    desc: "Intervention rapide 24h/24, 7j/7 pour toutes urgences plomberie. Diagnostic inclus, prix transparent avant tout déplacement.",
    tags: ["Urgent", "24h/7j"],
  },
  {
    href: "/services/services__residential",
    icon: "💧",
    title: "Réparation & fuite d'eau",
    desc: "Fuite sur tuyau, robinetterie défectueuse, joint à remplacer. Réparation durable avec pièces certifiées.",
    tags: ["Réparation", "Résidentiel"],
  },
  {
    href: "/services/services__commercial",
    icon: "🔧",
    title: "Installation & remplacement",
    desc: "Installation complète : chauffe-eau, appareil sanitaire, robinetterie, réseau de tuyauterie. Devis gratuit.",
    tags: ["Installation", "Planifié"],
  },
  {
    href: "/services/services__debouchage_conduites",
    icon: "💦",
    title: "Débouchage des conduites",
    desc: "WC, évier, douche bouchés ? Furet, hydrocurage et inspection caméra. Résolution rapide et efficace.",
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
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <main className="main-content" style={{ flex: 1 }}>

        <p className="label" style={{ marginBottom: "1rem" }}>Services</p>
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Nos services plomberie</h1>
        <p style={{ color: "var(--muted)", maxWidth: "40rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Des artisans certifiés interviennent rapidement chez vous pour tous vos besoins en plomberie, avec devis transparent avant chaque intervention.
        </p>

        {/* Services grid */}
        <div className="grid-2" style={{ marginBottom: "3rem" }}>
          {services.map((s) => (
            <Link key={s.href} href={s.href} className="service-card">
              <div className="service-card__icon">{s.icon}</div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                {s.tags.map((t) => (
                  <span key={t} className="badge badge-orange">{t}</span>
                ))}
              </div>
              <h2 className="service-card__title" style={{ fontSize: "1.2rem" }}>{s.title}</h2>
              <p className="service-card__desc">{s.desc}</p>
              <span className="service-card__cta">En savoir plus →</span>
            </Link>
          ))}
        </div>

        {/* Why us */}
        <div className="card-xl" style={{ background: "var(--navy-mid)" }}>
          <h2 className="h2" style={{ marginBottom: "1.5rem" }}>Pourquoi choisir Nova Intervention ?</h2>
          <div className="grid-3">
            {reasons.map((r) => (
              <div key={r.num} className="why-item">
                <span className="why-num">{r.num}</span>
                <span className="why-label">{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section" style={{ marginTop: "1.5rem" }}>
          <div>
            <h2 className="h2" style={{ marginBottom: "0.5rem" }}>Prêt à réserver un artisan ?</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Réponse sous 30 min, 24h/7j.</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="tel:+33788209773" className="btn btn-green">📞 07 88 20 97 73</Link>
            <Link href="/demander" className="btn btn-primary">Demander en ligne</Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
