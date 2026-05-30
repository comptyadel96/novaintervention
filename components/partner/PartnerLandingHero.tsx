"use client";

import { useState } from "react";
import Image from "next/image";
import "./partner-landing.css";

export const PARTNER_HERO_IMAGE = "/partner-artisan.jpeg";

export function PartnerLandingHero() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section className="partner-hero md:w-2/3 w-full mx-auto" aria-labelledby="partner-hero-title">
      <div className="partner-hero__inner">
        <div className="partner-hero__content">
          <span className="partner-hero__eyebrow">Devenir partenaire</span>
          <h1 id="partner-hero-title" className="partner-hero__title">
            Une application pensée pour les artisans du terrain
          </h1>
          <p className="partner-hero__text">
            Développez votre chiffre d&apos;affaires en toute sérénité
          </p>
          <p className="partner-hero__text">
            Recevez en moyenne 8 à 12 interventions par mois (selon votre zone
            et votre disponibilité).
          </p>
          <p className="partner-hero__text partner-hero__text--bold">
            Nova : Le partenaire de votre réussite au quotidien.
          </p>
          <p className="partner-hero__notice">
            <span className="partner-hero__notice-icon" aria-hidden="true">
              ⚠️
            </span>
            <span>Places limitées par secteur*</span>
          </p>
        </div>

        <div className="partner-hero__visual">
          {!imageFailed ? (
            <Image
              src={PARTNER_HERO_IMAGE}
              alt="Artisan Nova Intervention avec l'application mobile"
              width={520}
              height={480}
              priority
              className="partner-hero__image"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="partner-hero__image-placeholder">
              <span>Image indisponible</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
