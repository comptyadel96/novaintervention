"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const contacts = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: "Téléphone", value: "07 88 20 97 73", href: "tel:+33788209773", kind: "bg-primary text-white" },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, label: "Email", value: "contact@novaintervention.com", href: "mailto:contact@novaintervention.com", kind: "bg-bg-alt text-primary border border-border" },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: "Disponibilité", value: "24h/24 — 7j/7", href: undefined, kind: "bg-white text-primary border border-border" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    alert("Votre message a bien été envoyé ! Nous vous répondrons sous peu.");
  };
  return (
    <div className="page-wrap bg-bg-body">
      <Header />
      
      {/* Header section with grid pattern */}
      <div className="relative w-full min-h-[30vh] flex items-end pb-12 pt-28 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-grid opacity-50"></div>
        <div className="container relative z-10">
          <p className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Service Client</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Contactez-nous
          </h1>
          <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
            Nous répondons dans les plus brefs délais. Pour les urgences, appelez-nous directement.
          </p>
        </div>
      </div>

      <main className="container py-16">
        {/* Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contacts.map((c) => (
            <div key={c.label} className="card bg-white border border-border hover:border-primary-lt transition-colors shadow-sm flex items-center gap-5">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${c.kind}`}>
                {c.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">{c.label}</p>
                {c.href ? (
                  <Link href={c.href} className="font-bold text-primary-dk hover:text-primary transition-colors">{c.value}</Link>
                ) : (
                  <p className="font-bold text-primary-dk">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-3 card bg-white border border-border shadow-md">
            <h2 className="text-2xl font-bold text-primary-dk mb-2">Envoyer un message</h2>
            <p className="text-sm text-text-muted mb-8">
              Décrivez votre situation et nous vous répondrons rapidement.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-dk mb-2">Prénom</label>
                  <input type="text" required className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" placeholder="Jean" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-dk mb-2">Nom</label>
                  <input type="text" required className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" placeholder="Dupont" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-dk mb-2">Email</label>
                <input type="email" required className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" placeholder="jean.dupont@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-dk mb-2">Téléphone</label>
                <input type="tel" required className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" placeholder="06 00 00 00 00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-dk mb-2">Message</label>
                <textarea required className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3 min-h-[120px]" placeholder="Décrivez votre problème ou votre question…" />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full justify-center disabled:opacity-50">
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          </div>

          {/* Info panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="card bg-dots border-primary/20 bg-bg-alt shadow-sm">
              <h3 className="text-xl font-bold text-primary-dk mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Intervention urgente
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                Pour tout problème nécessitant une intervention immédiate (fuite, panne, bouchon), appelez directement notre ligne prioritaire.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="tel:+33788209773" className="btn bg-white border border-border text-primary-dk hover:border-primary justify-center shadow-sm">
                  📞 07 88 20 97 73
                </Link>
                <Link href="/demander" className="btn btn-primary justify-center">
                  Demander en ligne
                </Link>
              </div>
            </div>
            <div className="card bg-white border border-border shadow-sm">
              <h3 className="text-lg font-bold text-primary-dk mb-3">Vous êtes artisan ?</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Rejoignez notre réseau de professionnels certifiés et accédez à des missions exclusives depuis votre téléphone.
              </p>
              <Link href="/devenir-partenaire" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                Devenir partenaire 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
