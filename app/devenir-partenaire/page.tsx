import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Devenir partenaire artisan – Nova Intervention",
  description: "Rejoignez le réseau Nova Intervention. Accédez à des missions qualifiées, augmentez vos revenus et bénéficiez d'un profil certifié.",
};

const benefits = [
  { icon: "📋", title: "Missions qualifiées par IA", desc: "Recevez uniquement des demandes qui correspondent à votre spécialité, filtrées et qualifiées par l'analyse photo IA." },
  { icon: "💰", title: "Revenus prévisibles", desc: "Accédez à un tableau de bord temps réel de vos missions, revenus en attente et historique de paiements." },
  { icon: "⭐", title: "Profil certifié Nova", desc: "Votre certification Nova rassure les clients et vous positionne parmi les artisans de confiance de la région." },
  { icon: "🔔", title: "Notifications instantanées", desc: "Recevez les nouvelles missions en push sur votre téléphone. Acceptez ou refusez en 1 tap." },
  { icon: "📱", title: "App artisan dédiée", desc: "GPS, PDF d'intervention, signature électronique, photos avant/après — tout sur votre smartphone." },
  { icon: "🏆", title: "Valorisation de votre expertise", desc: "Vos avis clients et votre taux de satisfaction s'accumulent pour booster votre réputation sur la plateforme." },
];

export default function DevenirPartenairePage() {
  return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <main className="main-content" style={{ flex: 1 }}>

        <p className="label" style={{ marginBottom: "1rem" }}>Partenaires</p>
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Développez votre activité avec Nova Intervention
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", maxWidth: "42rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
          Accédez à un flux constant de demandes qualifiées, travaillez à votre rythme et développez votre réputation grâce à notre plateforme certifiée.
        </p>

        {/* Benefits */}
        <section style={{ marginBottom: "2rem" }}>
          <div className="grid-3">
            {benefits.map((b) => (
              <div key={b.title} className="benefit-card">
                <span className="benefit-icon">{b.icon}</span>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="card-xl" style={{ maxWidth: "40rem" }}>
          <h2 className="h2" style={{ marginBottom: "0.5rem" }}>Candidatez en quelques minutes</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Votre profil sera vérifié par notre équipe avant activation. Délai de validation : 48h.
          </p>
          <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="grid-2">
              <div>
                <label className="form-label">Prénom</label>
                <input type="text" className="form-input" placeholder="Jean" />
              </div>
              <div>
                <label className="form-label">Nom</label>
                <input type="text" className="form-input" placeholder="Dupont" />
              </div>
            </div>
            <div>
              <label className="form-label">Téléphone professionnel</label>
              <input type="tel" className="form-input" placeholder="06 00 00 00 00" />
            </div>
            <div>
              <label className="form-label">Ville d&apos;intervention principale</label>
              <input type="text" className="form-input" placeholder="Paris, Lyon, Marseille…" />
            </div>
            <div>
              <label className="form-label">Spécialité principale</label>
              <select className="form-input" style={{ appearance: "auto" }}>
                <option value="">Sélectionnez une spécialité</option>
                <option>Plomberie</option>
                <option>Électricité</option>
                <option>Chauffage</option>
                <option>Serrurerie</option>
                <option>Climatisation</option>
                <option>Vitrerie</option>
              </select>
            </div>
            <div>
              <label className="form-label">Numéro SIRET</label>
              <input type="text" className="form-input" placeholder="123 456 789 00010" />
            </div>
            <div>
              <label className="form-label">Présentez-vous brièvement</label>
              <textarea className="form-textarea" placeholder="Votre expérience, vos certifications, votre zone d'intervention…" />
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              Envoyer ma candidature →
            </button>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
              En soumettant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
            </p>
          </form>
        </section>

      </main>
      <Footer />
    </div>
  );
}
