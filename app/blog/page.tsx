import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog – Conseils plomberie & entretien | Nova Intervention",
  description: "Conseils, guides et actualités sur la plomberie, l'entretien de votre logement et les bonnes pratiques pour éviter les pannes.",
};

const categories = ["Tous", "Dépannage", "Entretien", "Conseils", "Guide", "Sécurité"];

const articles = [
  {
    id: 1,
    category: "Entretien",
    title: "Comment entretenir ses canalisations pour éviter les bouchons",
    excerpt: "Les bouchons récurrents dans vos évacuations peuvent être évités avec quelques gestes simples. Voici les bonnes pratiques à adopter.",
    readTime: "4 min",
    date: "28 avril 2026",
  },
  {
    id: 2,
    category: "Dépannage",
    title: "Fuite d'eau : les premiers gestes à faire avant l'arrivée du plombier",
    excerpt: "En cas de fuite, chaque minute compte. Voici les actions immédiates pour limiter les dégâts en attendant l'intervention.",
    readTime: "3 min",
    date: "22 avril 2026",
  },
  {
    id: 3,
    category: "Guide",
    title: "Chauffe-eau électrique : entretien, détartrage et durée de vie",
    excerpt: "Un chauffe-eau bien entretenu dure 2× plus longtemps. Découvrez comment le détartrer vous-même et quand faire appel à un professionnel.",
    readTime: "6 min",
    date: "15 avril 2026",
  },
  {
    id: 4,
    category: "Conseils",
    title: "Comment lire sa facture d'eau et détecter une consommation anormale",
    excerpt: "Une consommation en hausse peut signaler une fuite cachée. Apprenez à analyser votre facture et à prendre les bonnes décisions.",
    readTime: "5 min",
    date: "8 avril 2026",
  },
  {
    id: 5,
    category: "Sécurité",
    title: "Réglementation et normes plomberie en 2025 : ce que vous devez savoir",
    excerpt: "Quelles normes s'appliquent à votre installation ? Un tour d'horizon des obligations légales pour les particuliers et les artisans.",
    readTime: "7 min",
    date: "1 avril 2026",
  },
  {
    id: 6,
    category: "Guide",
    title: "Débouchage évier : quand le faire soi-même et quand appeler un pro ?",
    excerpt: "Ventouse, bicarbonate ou furet ? On vous dit quand chaque méthode fonctionne et quand il faut passer à l'hydrocurage professionnel.",
    readTime: "4 min",
    date: "24 mars 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <main className="main-content" style={{ flex: 1 }}>

        <p className="label" style={{ marginBottom: "1rem" }}>Blog</p>
        <h1 className="page-title" style={{ marginBottom: "0.5rem" }}>Conseils & actualités</h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Guides pratiques, conseils d&apos;entretien et bonnes pratiques pour votre logement.
        </p>

        {/* Categories */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {categories.map((c, i) => (
            <button
              key={c}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "9999px",
                border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.12)",
                background: i === 0 ? "var(--orange)" : "transparent",
                color: i === 0 ? "var(--dark)" : "var(--muted)",
                fontWeight: i === 0 ? 700 : 500,
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="grid-3">
          {articles.map((a) => (
            <article key={a.id} className="blog-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span className="badge badge-orange">{a.category}</span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{a.readTime} de lecture</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#fff", lineHeight: 1.4 }}>
                {a.title}
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.65 }}>{a.excerpt}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{a.date}</span>
                <Link href={`/blog/${a.id}`} style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--orange)" }}>
                  Lire →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="h2" style={{ marginBottom: "0.5rem" }}>Besoin d&apos;un plombier maintenant ?</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Un artisan certifié disponible 24h/7j.</p>
          </div>
          <Link href="/demander" className="btn btn-primary btn-lg">Demander une intervention</Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
