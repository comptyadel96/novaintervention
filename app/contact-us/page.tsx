"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FormField, inputClassName } from "@/components/forms/FormField";
import {
  validateEmail,
  validateName,
  validatePhone,
  validateRequired,
} from "@/lib/forms/validate";
import { submitContactMessage } from "@/services/api/contact";
import { getErrorMessage } from "@/lib/api/errors";

const contacts = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Téléphone",
    value: "07 88 20 97 73",
    href: "tel:+33788209773",
    kind: "bg-primary text-white",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: "Email",
    value: "contact@novaintervention.com",
    href: "mailto:contact@novaintervention.com",
    kind: "bg-bg-alt text-primary border border-border",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "Disponibilité",
    value: "24h/24 — 7j/7",
    href: undefined,
    kind: "bg-white text-primary border border-border",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errors: Record<string, string> = {};
    const fn = validateName(formData.firstName, "prénom");
    const ln = validateName(formData.lastName, "nom");
    const em = validateEmail(formData.email);
    const ph = validatePhone(formData.phone);
    const msg = validateRequired(formData.message, "Message");

    if (!fn.valid) errors.firstName = fn.message!;
    if (!ln.valid) errors.lastName = ln.message!;
    if (!em.valid) errors.email = em.message!;
    if (!ph.valid) errors.phone = ph.message!;
    if (!msg.valid) errors.message = msg.message!;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await submitContactMessage({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        source: "contact-page",
      });
      setIsSubmitted(true);
    } catch (err) {
      setFormError(getErrorMessage(err, "Impossible d'envoyer le message."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrap bg-bg-body">
      <Header />

      <div className="relative w-full min-h-[30vh] flex items-end pb-12 pt-28 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-grid opacity-50" />
        <div className="container relative z-10">
          <p className="text-sm font-bold tracking-widest uppercase text-primary mb-3">
            Service Client
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contactez-nous
          </h1>
          <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
            Nous répondons dans les plus brefs délais. Pour les urgences,
            appelez-nous directement.
          </p>
        </div>
      </div>

      <main className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contacts.map((c) => (
            <div
              key={c.label}
              className="card bg-white border border-border hover:border-primary-lt transition-colors shadow-sm flex items-center gap-5"
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${c.kind}`}
              >
                {c.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  {c.label}
                </p>
                {c.href ? (
                  <Link
                    href={c.href}
                    className="font-bold text-primary-dk hover:text-primary transition-colors"
                  >
                    {c.value}
                  </Link>
                ) : (
                  <p className="font-bold text-primary-dk">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 card bg-white border border-border shadow-md p-8">
            <h2 className="text-2xl font-bold text-primary-dk mb-2">
              Envoyer un message
            </h2>
            <p className="text-sm text-text-muted mb-8">
              Décrivez votre situation et nous vous répondrons rapidement.
            </p>

            {isSubmitted ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8 text-center">
                <p className="text-lg font-bold text-green-900 mb-2">
                  Message envoyé
                </p>
                <p className="text-sm text-green-800">
                  Merci {formData.firstName} — nous vous répondrons à{" "}
                  {formData.email} sous peu.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
                noValidate
              >
                {formError && (
                  <div className="form-banner-error" role="alert">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Prénom"
                    htmlFor="contact-firstName"
                    error={fieldErrors.firstName}
                    required
                  >
                    <input
                      id="contact-firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.firstName)}
                      placeholder="Jean"
                      disabled={isSubmitting}
                    />
                  </FormField>
                  <FormField
                    label="Nom"
                    htmlFor="contact-lastName"
                    error={fieldErrors.lastName}
                    required
                  >
                    <input
                      id="contact-lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className={inputClassName(!!fieldErrors.lastName)}
                      placeholder="Dupont"
                      disabled={isSubmitting}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Email"
                  htmlFor="contact-email"
                  error={fieldErrors.email}
                  required
                >
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={inputClassName(!!fieldErrors.email)}
                    placeholder="jean.dupont@email.com"
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  label="Téléphone"
                  htmlFor="contact-phone"
                  error={fieldErrors.phone}
                  required
                >
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={inputClassName(!!fieldErrors.phone)}
                    placeholder="06 00 00 00 00"
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  label="Message"
                  htmlFor="contact-message"
                  error={fieldErrors.message}
                  required
                >
                  <textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`${inputClassName(!!fieldErrors.message)} min-h-[120px]`}
                    placeholder="Décrivez votre problème ou votre question…"
                    disabled={isSubmitting}
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full justify-center disabled:opacity-50"
                >
                  {isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="card bg-dots border-primary/20 bg-bg-alt shadow-sm p-6">
              <h3 className="text-xl font-bold text-primary-dk mb-4 flex items-center gap-2">
                Intervention urgente
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                Pour tout problème nécessitant une intervention immédiate,
                appelez directement notre ligne prioritaire.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="tel:+33788209773"
                  className="btn bg-white border border-border text-primary-dk hover:border-primary justify-center shadow-sm"
                >
                  07 88 20 97 73
                </Link>
                <Link href="/demander" className="btn btn-primary justify-center">
                  Demander en ligne
                </Link>
              </div>
            </div>
            <div className="card bg-white border border-border shadow-sm p-6">
              <h3 className="text-lg font-bold text-primary-dk mb-3">
                Vous êtes artisan ?
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Rejoignez notre réseau de plombiers certifiés.
              </p>
              <Link
                href="/devenir-partenaire"
                className="text-primary font-bold text-sm hover:underline"
              >
                Devenir partenaire →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
