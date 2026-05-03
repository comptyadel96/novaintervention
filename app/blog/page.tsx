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
    title: "Fuite d'eau : les premiers gestes avant l'arrivée du plombier",
    excerpt: "En cas de fuite, chaque minute compte. Voici les actions immédiates pour limiter les dégâts en attendant l'intervention.",
    readTime: "3 min",
    date: "22 avril 2026",
  },
  {
    id: 3,
    category: "Guide",
    title: "Chauffe-eau électrique : entretien, détartrage et durée de vie",
    excerpt: "Un chauffe-eau bien entretenu dure 2× plus longtemps. Découvrez comment le détartrer vous-même et quand faire appel à un expert.",
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
    title: "Réglementation et normes plomberie en 2026 : ce que vous devez savoir",
    excerpt: "Quelles normes s'appliquent à votre installation ? Un tour d'horizon des obligations légales pour les particuliers et artisans.",
    readTime: "7 min",
    date: "1 avril 2026",
  },
  {
    id: 6,
    category: "Guide",
    title: "Débouchage évier : quand le faire soi-même et quand appeler un pro ?",
    excerpt: "Ventouse, bicarbonate ou furet ? On vous dit quand chaque méthode fonctionne et quand il faut passer à l'hydrocurage prof.",
    readTime: "4 min",
    date: "24 mars 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="page-wrap bg-bg-body">
      <Header />

      <div className="relative w-full min-h-[30vh] flex items-end pb-12 pt-28 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-dots opacity-50"></div>
        <div className="container relative z-10">
          <p className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Actualités & Guides</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Conseils plomberie
          </h1>
          <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
            Guides pratiques, conseils d'entretien et bonnes pratiques pour votre logement partagés par nos artisans.
          </p>
        </div>
      </div>

      <main className="container py-16">

        {/* Categories */}
        <div className="flex gap-3 flex-wrap mb-12">
          {categories.map((c, i) => (
            <button
              key={c}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                i === 0 
                  ? "bg-primary text-white border border-primary shadow-sm" 
                  : "bg-white text-text-muted border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {articles.map((a) => (
            <article key={a.id} className="card bg-white border border-border hover:border-primary-lt transition-all hover:-translate-y-1 shadow-sm flex flex-col p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-bg-alt text-primary text-xs font-bold uppercase tracking-wider rounded-md border border-border">
                  {a.category}
                </span>
                <span className="text-xs text-text-muted font-semibold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {a.readTime}
                </span>
              </div>
              <h2 className="text-xl font-bold text-primary-dk mb-3 leading-snug">
                {a.title}
              </h2>
              <p className="text-sm text-text-muted leading-relaxed mb-6 flex-1">
                {a.excerpt}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-xs font-semibold text-text-muted">{a.date}</span>
                <Link href={`/blog/${a.id}`} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                  Lire l'article
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-section bg-dots border-border shadow-sm">
          <div>
            <h2 className="h2 mb-2 text-primary-dk">Un problème introuvable dans le blog ?</h2>
            <p className="text-text-muted">Un expert Nova certifié peut intervenir en moins de 30 minutes.</p>
          </div>
          <Link href="/demander" className="btn btn-primary">Demander une intervention</Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
