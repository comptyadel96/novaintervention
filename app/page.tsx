import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServiceCard } from "@/components/ServiceCard";
import { defaultFeatures, serviceList } from "@/lib/services";

const services = Object.keys(serviceList) as Array<keyof typeof serviceList>;

export default function Home() {
  return (
    <div className="page-wrap">
      <Header />
      <main className="main-content">

        {/* ── HERO ── */}
        <section className="hero" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "center" }}>
          <div>
            <p className="label" style={{ marginBottom: "1rem" }}>
              Plomberie urgence &amp; maintenance
            </p>
            <h1 className="page-title" style={{ marginBottom: "1.25rem" }}>
              Plombier en urgence &amp; maintenance
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "36rem", marginBottom: "2rem" }}>
              Fuite d&apos;eau, canalisation ou évacuation bouchée, chauffe-eau en panne ? Trouvez rapidement un artisan local qualifié pour vos dépannages en plomberie.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <a href="tel:+33788209773" className="btn btn-green">
                📞 Appel urgent
              </a>
              <Link href="/demander" className="btn btn-primary">
                Demander une intervention
              </Link>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {["2.7K avis", "Intervention sous 30 min", "Artisans certifiés"].map((t) => (
                <span key={t} className="badge badge-navy">{t}</span>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.08)", background: "var(--navy-mid)", overflow: "hidden", position: "relative", aspectRatio: "4/3" }}>
            <Image
              src="/images/main-slider/right.png"
              alt="Artisan plombier professionnel"
              fill
              className="overflow-hidden"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ marginTop: "1.5rem" }}>
          <div className="grid-3">
            {[
              {
                title: "Un problème ? Décrivez-le en quelques secondes",
                body: "Prenez une photo et expliquez votre besoin. Vous recevez une estimation claire avant intervention, sans surprise. Votre demande est analysée immédiatement pour envoyer le bon artisan.",
              },
              {
                title: "Un artisan certifié intervient rapidement chez vous",
                body: "Sélectionné pour son sérieux et sa réactivité, il dispose de toutes les informations pour intervenir efficacement dès le premier déplacement.",
              },
              {
                title: "Paiement sécurisé après intervention",
                body: "Vous ne payez qu'une fois le travail terminé et validé. Aucune mauvaise surprise, vous gardez le contrôle du début à la fin.",
              },
            ].map((item) => (
              <div key={item.title} className="card">
                <h3 className="h3" style={{ marginBottom: "1rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section style={{ marginTop: "4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p className="label" style={{ marginBottom: "0.5rem" }}>Services</p>
              <h2 className="h2">Nos services principaux</h2>
            </div>
            <Link href="/services" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--orange)" }}>
              Voir tous les services →
            </Link>
          </div>
          <div className="grid-4">
            {services.map((service) => (
              <ServiceCard key={service} service={service} />
            ))}
          </div>
        </section>

        {/* ── NOVA SCORE ── */}
        <section style={{ marginTop: "4rem" }}>
          <div className="card-xl" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2.5rem", alignItems: "center" }}>
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>Nova Score</p>
              <h2 className="h2" style={{ marginBottom: "1rem" }}>
                Le dossier du logement qui simplifie chaque intervention.
              </h2>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--muted)" }}>
                Le Carnet Nova centralise les historiques, les alertes et les indicateurs de santé du logement pour que chaque artisan arrive informé et chaque client garde la trace.
              </p>
            </div>
            <div className="card-mid">
              {defaultFeatures.map((f, i) => (
                <div key={f.title} style={{ paddingBottom: i < defaultFeatures.length - 1 ? "1.25rem" : 0, marginBottom: i < defaultFeatures.length - 1 ? "1.25rem" : 0, borderBottom: i < defaultFeatures.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                  <p style={{ fontWeight: 700, color: "#fff", marginBottom: "0.35rem" }}>{f.title}</p>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "var(--muted)" }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ marginTop: "1.5rem" }}>
          <div className="card-xl">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>
              <div>
                <p className="label" style={{ marginBottom: "0.75rem" }}>Témoignages</p>
                <h2 className="h2">
                  Les clients apprécient la rapidité et la transparence.
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  {
                    title: "Intervention rapide et très professionnelle.",
                    quote: "Le technicien est arrivé en moins de 30 minutes et a résolu la fuite immédiatement. Service sérieux et transparent.",
                    author: "Marie L.",
                  },
                  {
                    title: "Service excellent et à l'heure.",
                    quote: "Le plombier a été très professionnel et courtois. Réparation rapide, je recommande.",
                    author: "Sonia D.",
                  },
                  {
                    title: "Diagnostic clair et devis transparent.",
                    quote: "Deux techniciens sont venus à l'heure, ont diagnostiqué le problème et m'ont tout expliqué pour la réparation.",
                    author: "Donna B.",
                  },
                ].map((item) => (
                  <blockquote key={item.author} className="testimonial">
                    <p className="testimonial__title">{item.title}</p>
                    <p className="testimonial__quote">{item.quote}</p>
                    <footer className="testimonial__author">— {item.author}</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PARTNER CTA ── */}
        <section style={{ marginTop: "1.5rem" }}>
          <div className="cta-section">
            <div>
              <p className="label" style={{ marginBottom: "0.5rem" }}>Vous êtes artisan ?</p>
              <h2 className="h2" style={{ marginBottom: "0.5rem" }}>Rejoignez notre réseau partenaire.</h2>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                Candidatez en quelques minutes. Votre profil est vérifié par notre équipe avant activation.
              </p>
            </div>
            <Link href="/devenir-partenaire" className="btn btn-primary btn-lg">
              Devenir partenaire
            </Link>
          </div>
        </section>

        {/* ── CONTACT CTA ── */}
        <section style={{ marginTop: "1.5rem" }}>
          <div className="card-xl" style={{ background: "var(--navy-mid)" }}>
            <p className="label" style={{ marginBottom: "0.75rem" }}>nous contacter</p>
            <h2 className="h2" style={{ maxWidth: "36rem", marginBottom: "2rem" }}>
              Besoin d&apos;une intervention urgente ? Nos équipes sont disponibles 24h/7j.
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
