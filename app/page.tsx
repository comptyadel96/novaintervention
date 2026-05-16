import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { defaultFeatures, serviceList } from "@/lib/services";

const services = Object.keys(serviceList) as Array<keyof typeof serviceList>;

export default function Home() {
  return (
    <div className="page-wrap">
      <Header />
      <main className="main-content">
        {/* ── HERO ── */}
        <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-[75vh] md:min-h-[85vh] flex items-center py-20 md:py-32 -mt-22 mb-16 overflow-hidden">
          {/* Background Image Setup */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/main-slider/right.png"
              alt="Artisan plombier"
              fill
              className="hero-bg-image hide-mobile"
              priority
            />
            <Image
              src="/images/main-slider/right-2.png"
              alt="Artisan plombier mobile"
              fill
              className="hero-bg-image mobile-hero-image hide-desktop"
              priority
            />
            {/* Seamless linear gradient for elegant contrast without borders */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex mt-16">
            {/* Texts directly over the soft gradient - No borders or hard boxes */}
            <div className="max-w-[42rem] animate-fade-in pr-0 md:pr-6">
              {/* <p className="label">Plomberie Urgence & Maintenance</p> */}
              <h1 className="page-title mb-6 md:mb-8">
                Plombier en urgence & maintenance
              </h1>
              <p
                className="text-base sm:text-lg md:text-xl font-medium leading-7 sm:leading-8 mb-10 max-w-xl"
                style={{ color: "var(--text-main)" }}
              >
                Fuite d'eau, canalisation ou évacuation bouchée, chauffe-eau en
                panne ? Trouvez rapidement un artisan local qualifié pour vos
                dépannages en plomberie.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-10">
                <Link
                  href="tel:+33788209773"
                  className="btn btn-primary btn-lg w-full sm:w-auto justify-center"
                >
                  <span>📞</span> Appel urgent
                </Link>
                <Link
                  href="/demander"
                  className="btn btn-outline btn-lg w-full sm:w-auto justify-center"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                >
                  Demander une intervention
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  "2.7K+ avis",
                  "Intervention sous 45 min",
                  "Artisans certifiés",
                ].map((t) => (
                  <span
                    key={t}
                    className="badge"
                    style={{
                      color: "var(--primary-dk)",
                      background: "rgba(255,255,255,0.9)",
                      border: "none",
                      boxShadow: "0 4px 10px rgba(12,76,147,0.08)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ marginTop: "1.5rem" }}>
          <div className="grid-3">
            {[
              {
                title: "Un problème ? Décrivez-le en quelques secondes",
                body: "Prenez une photo et expliquez votre besoin. Vous recevez une estimation claire avant intervention, sans surprise. Votre demande est analysée immédiatement pour envoyer le bon artisan.",
                imgSrc: "/images/step__img01.png",
              },
              {
                title: "Un artisan certifié intervient rapidement chez vous",
                body: "Sélectionné pour son sérieux et sa réactivité, il dispose de toutes les informations pour intervenir efficacement dès le premier déplacement.",
                imgSrc: "/images/step__img02.png",
              },
              {
                title: "Paiement sécurisé après intervention",
                body: "Vous ne payez qu'une fois le travail terminé et validé. Aucune mauvaise surprise, vous gardez le contrôle du début à la fin.",
                imgSrc: "/images/step__img03.png",
              },
            ].map((item) => (
              <div key={item.title} className="card">
                <Image
                  src={item.imgSrc}
                  alt={item.title}
                  width={200}
                  height={150}
                  className="object-cover w-full rounded-lg my-2"
                />
                <h3 className="h3" style={{ marginBottom: "1rem" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES PRINCIPAUX ── */}
        <section
          className="relative w-screen left-1/2 -translate-x-1/2 bg-dots overflow-hidden py-16 mb-16 border-y"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "3rem",
              }}
            >
              <div>
                {/* <p className="label" style={{ marginBottom: "0.5rem" }}>
                  Services
                </p> */}
                <h2 className="h2">Nos services principaux</h2>
              </div>
              <Link
                href="/services"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                Voir tous les services →
              </Link>
            </div>

            <div className="grid-4">
              {services.map((service) => (
                <ServiceCard key={service} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* ── NOVA SCORE ── */}
        <section style={{ marginTop: "4rem" }}>
          <div
            className="card-xl"
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "2.5rem",
              alignItems: "center",
            }}
          >
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                Nova Score
              </p>
              <h2 className="h2" style={{ marginBottom: "1rem" }}>
                Le dossier du logement qui simplifie chaque intervention.
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: "var(--muted)",
                }}
              >
                Le Carnet Nova centralise les historiques, les alertes et les
                indicateurs de santé du logement pour que chaque artisan arrive
                informé et chaque client garde la trace.
              </p>
            </div>
            <div className="card-mid">
              {defaultFeatures.map((f, i) => (
                <div
                  key={f.title}
                  style={{
                    paddingBottom:
                      i < defaultFeatures.length - 1 ? "1.25rem" : 0,
                    marginBottom:
                      i < defaultFeatures.length - 1 ? "1.25rem" : 0,
                    borderBottom:
                      i < defaultFeatures.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      color: "var(--primary-dk)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    {f.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      lineHeight: 1.65,
                      color: "var(--muted)",
                    }}
                  >
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AVIS CLIENTS ── */}
        <section
          className="relative w-screen left-1/2 -translate-x-1/2 bg-grid py-20 border-y"
          style={{ borderColor: "var(--border)", marginTop: "4rem" }}
        >
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="label">Avis de nos clients</p>
              <h2 className="h2">Ils nous ont fait confiance</h2>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {[
                {
                  title: "Intervention rapide et très professionnelle.",
                  quote:
                    "Le technicien est arrivé en moins de 30 minutes et a résolu la fuite immédiatement. Service sérieux et transparent.",
                  author: "Marie L.",
                },
                {
                  title: "Service excellent et à l'heure.",
                  quote:
                    "Le plombier a été très professionnel et courtois. Réparation rapide, je recommande.",
                  author: "Sonia D.",
                },
                {
                  title: "Diagnostic clair et devis transparent.",
                  quote:
                    "Deux techniciens sont venus à l'heure, ont diagnostiqué le problème et m'ont tout expliqué pour la réparation.",
                  author: "Donna B.",
                },
              ].map((item) => (
                <blockquote key={item.author} className="testimonial">
                  <p className="testimonial__title">{item.title}</p>
                  <p className="testimonial__quote">{item.quote}</p>
                  <footer className="testimonial__author">
                    — {item.author}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNER CTA ── */}
        <section style={{ marginTop: "1.5rem" }}>
          <div className="cta-section">
            <div>
              <p className="label" style={{ marginBottom: "0.5rem" }}>
                Vous êtes artisan ?
              </p>
              <h2 className="h2" style={{ marginBottom: "0.5rem" }}>
                Rejoignez notre réseau partenaire.
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                Candidatez en quelques minutes. Votre profil est vérifié par
                notre équipe avant activation.
              </p>
            </div>
            <Link href="/devenir-partenaire" className="btn btn-primary btn-lg">
              Devenir partenaire
            </Link>
          </div>
        </section>

        {/* ── CONTACT CTA ── */}
        <section style={{ marginTop: "1.5rem" }}>
          <div className="card-xl" style={{ background: "var(--bg-alt)" }}>
            <p className="label" style={{ marginBottom: "0.75rem" }}>
              nous contacter
            </p>
            <h2
              className="h2"
              style={{ maxWidth: "36rem", marginBottom: "2rem" }}
            >
              Besoin d&apos;une intervention urgente ? Nos équipes sont
              disponibles 24h/7j.
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/demander" className="btn btn-primary">
                Demander une intervention
              </Link>
              <Link href="/contact-us" className="btn btn-outline">
                Contactez-nous
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
