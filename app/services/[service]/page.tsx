import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { serviceList } from "@/lib/services";

interface ServicePageProps {
  params: {
    service: string;
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = params.service as keyof typeof serviceList;
  const meta = serviceList[service];

  if (!meta) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark text-text">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        <div className="rounded-4xl border border-white/10 bg-navy px-8 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-orange">
              Service
            </p>
            <h1 className="mt-4 text-4xl font-bold text-white">{meta.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
              {meta.description}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_0.8fr]">
            <section className="rounded-4xl border border-white/10 bg-navy-mid p-8">
              <h2 className="text-2xl font-semibold text-white">
                Quand utiliser ce service ?
              </h2>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-muted">
                <li>
                  • Intervention urgente et accompagnée de prise de photo.
                </li>
                <li>• Estimation transparente avant acceptation.</li>
                <li>
                  • Suivi GPS de l&apos;artisan et PV digital après
                  intervention.
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/demander"
                  className="inline-flex rounded-full bg-orange px-6 py-3 text-sm font-semibold text-dark transition hover:bg-orange-lt"
                >
                  Demander une intervention
                </Link>
              </div>
            </section>
            <section className="rounded-4xl border border-white/10 bg-navy-mid p-8">
              <h2 className="text-2xl font-semibold text-white">
                Ce qui est couvert
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
                <p>• Diagnostics rapides grâce à GPT-4o Vision.</p>
                <p>
                  • Correspondance avec un artisan certifié disponible près de
                  chez vous.
                </p>
                <p>• Paiement sécurisé et facture envoyée par email.</p>
                <p>• Tous les travaux documentés dans le Carnet Nova.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
