"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FormField, inputClassName } from "@/components/forms/FormField";
import {
  validateCity,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/lib/forms/validate";
import { submitPartnerApplication } from "@/services/api/partner-applications";
import { PartnerEarningsSimulator } from "@/components/partner/PartnerEarningsSimulator";
import { PartnerLandingHero } from "@/components/partner/PartnerLandingHero";
import { PartnerWhyJoinSection } from "@/components/partner/PartnerWhyJoinSection";
import { getErrorMessage } from "@/lib/api/errors";
import "@/components/partner/partner-landing.css";

export default function DevenirPartenairePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    city: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errors: Record<string, string> = {};
    const fn = validateName(formData.firstName, "prénom");
    const ln = validateName(formData.lastName, "nom");
    const ph = validatePhone(formData.phone);
    const em = validateEmail(formData.email);
    const pw = validatePassword(formData.password);
    const cityCheck = validateCity(formData.city);

    if (!fn.valid) errors.firstName = fn.message!;
    if (!ln.valid) errors.lastName = ln.message!;
    if (!ph.valid) errors.phone = ph.message!;
    if (!em.valid) errors.email = em.message!;
    if (!pw.valid) errors.password = pw.message!;
    if (!cityCheck.valid) errors.city = cityCheck.message!;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    try {
      const result = await submitPartnerApplication({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        city: formData.city.trim(),
      });
      setSuccessMessage(result.message);
      setIsSubmitted(true);
    } catch (err) {
      setFormError(
        getErrorMessage(
          err,
          "Envoi impossible. Vérifiez vos informations et réessayez.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrap bg-bg-body">
      <Header />

      <PartnerLandingHero />
      <PartnerWhyJoinSection />

      <section
        className="partner-form-section"
        aria-labelledby="partner-form-heading"
      >
        <div className="partner-form-section__inner">
          <div className="partner-form-section__simulator">
            <PartnerEarningsSimulator cityHint={formData.city} />
          </div>

          <div className="partner-form-section__form-wrap">
            <div className="card-xl bg-white border border-border shadow-2xl overflow-hidden h-full">
              <div className="bg-bg-alt px-8 py-6 border-b border-border">
                <h2
                  id="partner-form-heading"
                  className="text-2xl font-bold text-primary-dk mb-1"
                >
                  Postulez maintenant
                </h2>
                <p className="text-sm text-text-muted">
                  Votre compte artisan est créé à l&apos;envoi — vérifiez votre
                  email avant de vous connecter.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 text-center">
                  <p className="text-lg font-bold text-primary-dk mb-2">
                    Candidature envoyée
                  </p>
                  <p className="text-sm text-text-muted mb-6">
                    {successMessage ??
                      "Votre compte artisan a été créé. Consultez votre boîte mail pour activer votre accès."}
                  </p>
                  <Link href="/login" className="btn btn-primary btn-sm">
                    Se connecter
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-8 partner-form-grid"
                  noValidate
                >
                  {formError && (
                    <div
                      className="form-banner-error partner-form-grid__full"
                      role="alert"
                    >
                      {formError}
                    </div>
                  )}
                  <p className="text-xs text-text-muted partner-form-grid__full -mt-1">
                    Métier :{" "}
                    <strong className="text-primary-dk">Plomberie</strong>
                  </p>

                  <FormField
                    label="Prénom"
                    htmlFor="partner-firstName"
                    error={fieldErrors.firstName}
                    required
                  >
                    <input
                      id="partner-firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.firstName)}
                      placeholder="Jean"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Nom"
                    htmlFor="partner-lastName"
                    error={fieldErrors.lastName}
                    required
                  >
                    <input
                      id="partner-lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.lastName)}
                      placeholder="Dupont"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Email professionnel"
                    htmlFor="partner-email"
                    error={fieldErrors.email}
                    required
                  >
                    <input
                      id="partner-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.email)}
                      placeholder="jean.dupont@email.com"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </FormField>

                  <FormField
                    label="Téléphone"
                    htmlFor="partner-phone"
                    error={fieldErrors.phone}
                    hint="10 chiffres minimum"
                    required
                  >
                    <input
                      id="partner-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.phone)}
                      placeholder="06 12 34 56 78"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Mot de passe"
                    htmlFor="partner-password"
                    error={fieldErrors.password}
                    hint="Minimum 8 caractères — pour votre compte artisan"
                    required
                  >
                    <input
                      id="partner-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.password)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </FormField>

                  <FormField
                    label="Ville d'intervention"
                    htmlFor="partner-city"
                    error={fieldErrors.city}
                    required
                  >
                    <input
                      id="partner-city"
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.city)}
                      placeholder="Paris"
                      disabled={isLoading}
                    />
                  </FormField>

                  <div className="partner-form-grid__full mt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary w-full justify-center py-4 text-lg disabled:opacity-50"
                    >
                      {isLoading ? "Envoi en cours…" : "Envoyer ma candidature"}
                    </button>
                    <p className="text-[10px] text-text-muted text-center mt-4 uppercase tracking-widest font-bold">
                      Validation sous 48h · Paiements sécurisés Stripe Connect
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
