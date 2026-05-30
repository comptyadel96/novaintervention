import "./partner-landing.css";

const WHY_JOIN_ITEMS = [
  {
    title: "Recevez uniquement des missions qualifiées",
    desc: "Fini les appels inutiles – chaque intervention est validée en amont.",
  },
  {
    title: "Préparez vos interventions à l'avance",
    desc: "Photos + détails du problème pour intervenir efficacement dès la première visite.",
  },
  {
    title: "Zéro administratif",
    desc: "Nova gère devis, facturation et relances.",
  },
  {
    title: "Paiement sécurisé et rapide",
    desc: "Recevez votre règlement automatiquement sous 72h après intervention.",
  },
] as const;

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function PartnerWhyJoinSection() {
  return (
    <section className="partner-why" aria-labelledby="partner-why-title">
      <div className="partner-why__inner">
        <h2 id="partner-why-title" className="partner-why__title">
          Pourquoi nous rejoindre ?
        </h2>
        <div className="partner-why__grid">
          {WHY_JOIN_ITEMS.map((item) => (
            <article key={item.title} className="partner-why__card">
              <span className="partner-why__icon">
                <CheckIcon />
              </span>
              <div className="partner-why__card-body">
                <h3 className="partner-why__card-title">{item.title}</h3>
                <p className="partner-why__card-desc">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
