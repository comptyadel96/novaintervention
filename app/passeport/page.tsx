import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  Building2,
  FileText,
  History,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Passeport Nova – La mémoire de votre logement",
  description:
    "Créez gratuitement le passeport numérique de votre logement : équipements, factures, garanties, historique d'interventions et rappels d'entretien.",
};

const blocks = [
  {
    icon: Building2,
    title: "Identité du bien",
    desc: "Adresse, type, année, surface, photos.",
  },
  {
    icon: Wrench,
    title: "Équipements",
    desc: "Chaudière, chauffe-eau, climatisation, VMC, toiture…",
  },
  {
    icon: FileText,
    title: "Documents",
    desc: "Factures, garanties, notices, diagnostics.",
  },
  {
    icon: History,
    title: "Historique",
    desc: "Interventions, travaux, dates, professionnels.",
  },
  {
    icon: Bell,
    title: "Recommandations",
    desc: "Entretien, contrôle, remplacement à anticiper.",
  },
  {
    icon: ShieldCheck,
    title: "Preuves",
    desc: "Photos avant/après, facture, validation client.",
  },
];

const confidenceLevels = [
  {
    label: "Déclaré",
    desc: "Vous renseignez une information : utile, mais non certifiée.",
  },
  {
    label: "Confirmé par un pro",
    desc: "Un artisan Nova valide la donnée pendant son intervention.",
  },
  {
    label: "Justifié",
    desc: "Une facture, une photo ou un document vient l'appuyer.",
  },
  {
    label: "Confiance renforcée",
    desc: "Plusieurs événements du passeport concordent entre eux.",
  },
];

export default function PasseportLandingPage() {
  return (
    <div className="page-wrap bg-bg-body">
      <Header />

      <section className="relative w-full pt-28 pb-16 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-grid opacity-50" />
        <div className="container relative z-10">
          <p className="label">Gratuit — sans engagement</p>
          <h1 className="page-title max-w-4xl">
            Créez gratuitement le passeport numérique de votre logement
          </h1>
          <p className="text-lg text-text-muted leading-relaxed max-w-3xl mb-8">
            Vos équipements, vos factures, vos garanties et tout ce qui a été
            fait chez vous, au même endroit. Le passeport se remplit tout seul à
            chaque intervention Nova, et il suit le bien si vous le vendez.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/passeport" className="btn btn-primary btn-lg">
              Créer mon passeport
            </Link>
            <Link href="/demander" className="btn btn-outline btn-lg">
              J&apos;ai un problème maintenant
            </Link>
          </div>
        </div>
      </section>

      <main className="container py-16 space-y-16">
        <section>
          <h2 className="page-h2 mb-3">Ce que contient votre passeport</h2>
          <p className="text-text-muted max-w-2xl mb-10">
            Une mémoire structurée du bâtiment, pensée pour être utile le jour
            où vous en avez besoin : une panne, un entretien, une revente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block) => (
              <article
                key={block.title}
                className="card p-7 bg-white border border-border rounded-[2rem]"
              >
                <span className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-5">
                  <block.icon size={22} />
                </span>
                <h3 className="page-h3 mb-2">{block.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {block.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="card-xl">
          <h2 className="page-h2 mb-3">
            Toutes les informations ne se valent pas
          </h2>
          <p className="text-text-muted max-w-2xl mb-8">
            Chaque donnée du passeport affiche son niveau de preuve. Vous savez
            toujours ce qui est déclaré et ce qui est vérifié.
          </p>

          <ol className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {confidenceLevels.map((level, index) => (
              <li
                key={level.label}
                className="flex gap-4 p-5 bg-white border border-border rounded-2xl"
              >
                <span className="w-8 h-8 shrink-0 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">
                  {index + 1}
                </span>
                <div>
                  <p className="page-h4 mb-1">{level.label}</p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {level.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="cta-section">
          <div className="relative z-10 max-w-xl">
            <h2 className="page-h2 mb-3">
              Deux minutes aujourd&apos;hui, des années de tranquillité
            </h2>
            <p className="text-text-muted leading-relaxed">
              L&apos;adresse, le type de bien, vos équipements principaux. Nova
              s&apos;occupe du reste à chaque intervention.
            </p>
          </div>
          <Link
            href="/dashboard/passeport"
            className="btn btn-primary btn-lg relative z-10 shrink-0"
          >
            Créer mon passeport gratuit
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
