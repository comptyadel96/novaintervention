"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const steps = ["Photo IA", "Estimation", "Artisan"];

export default function DemanderPage() {
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  return (
    <div className="page-wrap bg-bg-body min-h-screen flex flex-col">
      <Header />
      <main className="container max-w-3xl py-12 flex-1">

        {/* Subheader */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Demande d'intervention
          </h1>
          <p className="text-text-muted">Réponse estimée &lt; 30 minutes. Zone d'intervention premium.</p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between items-center max-w-lg mx-auto mb-12 relative z-10">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -z-10 translate-y-[-10px]"></div>
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-bg-body px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2
                ${i < step ? "bg-primary border-primary text-white" : 
                  i === step ? "bg-white border-primary-dk text-primary-dk" : 
                  "bg-bg-alt border-border text-text-muted"}
              `}>
                {i < step ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : i + 1}
              </div>
              <span className={`text-xs uppercase tracking-widest font-bold ${i <= step ? "text-primary-dk" : "text-text-muted"}`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Content Wrapper */}
        <div className="card-xl bg-white border border-border shadow-sm">
          
          {/* STEP 0 — Photo */}
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Étape 1 sur 3</span>
              <h2 className="text-2xl font-bold text-primary-dk mb-4">Décrivez l'urgence</h2>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                Nova utilise l'analyse photo IA pour comprendre instantanément votre problème et afficher votre devis définitif.
              </p>
              
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 bg-bg-alt rounded-2xl p-10 cursor-pointer hover:bg-bg-body transition-colors mb-6">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Aperçu" className="max-h-48 rounded-xl object-cover shadow-sm mb-4" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-4"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                    <p className="text-primary-dk font-bold mb-1">Ajouter une photo</p>
                    <p className="text-xs text-text-muted">Glissez-déposez ou cliquez ici</p>
                  </>
                )}
              </label>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-primary-dk mb-2">Description additionnelle (optionnelle)</label>
                <textarea className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary w-full px-4 py-3 min-h-[100px]" placeholder="Précisez tout détail utile..." />
              </div>

              <button onClick={() => setStep(1)} className="btn btn-primary w-full justify-center text-lg py-4">
                Lancer l'analyse IA
              </button>
            </div>
          )}

          {/* STEP 1 — AI result */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Étape 2 sur 3</span>
              <h2 className="text-2xl font-bold text-primary-dk mb-6">Bilan de l'Intelligence Artificielle</h2>

              <div className="bg-bg-alt border border-border rounded-2xl p-6 mb-6">
                {[
                  { key: "Intervention", val: "Plomberie Expertise", badge: true },
                  { key: "Urgence", val: "Nécessite réaction immédiate", badge: true, urgent: true },
                  { key: "Estimation", val: "150€ – 250€ HT", badge: false, heavy: true },
                  { key: "Temps requis", val: "45 minutes estimées", badge: false },
                ].map((row, i, arr) => (
                  <div key={row.key} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 border-b border-border last:border-0 last:pb-0 first:pt-0">
                    <span className="text-sm font-semibold text-text-muted mb-2 sm:mb-0">{row.key}</span>
                    {row.badge ? (
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${row.urgent ? "bg-red-50 text-red-600 border-red-200" : "bg-bg-body text-primary-dk border-border"} self-start sm:self-auto`}>
                        {row.val}
                      </span>
                    ) : (
                      <span className={`text-sm ${row.heavy ? "font-extrabold text-primary text-xl" : "font-bold text-primary-dk"}`}>{row.val}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-8 flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 flex-shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div>
                  <p className="text-green-800 font-bold text-sm mb-1">Confiance de détection : 91%</p>
                  <p className="text-green-700 text-xs">Diagnostic IA : Fuite probable au niveau du siphon. Prêt pour mandater.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="btn bg-bg-alt border border-border text-text-muted hover:border-primary-lt w-1/3 justify-center">Retour</button>
                <button onClick={() => setStep(2)} className="btn btn-primary flex-1 justify-center">Accepter le devis prévisionnel</button>
              </div>
            </div>
          )}

          {/* STEP 2 — Coordonnées */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">C'est presque terminé</span>
              <h2 className="text-2xl font-bold text-primary-dk mb-2">Où doit-on intervenir ?</h2>
              <p className="text-sm text-text-muted mb-8">Un expert Nova certifié sera chez vous dans les minutes qui suivent.</p>
              
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-primary-dk mb-1.5">Nom complet</label>
                    <input type="text" className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary w-full px-4 py-3" placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dk mb-1.5">Téléphone d'urgence</label>
                    <input type="tel" className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary w-full px-4 py-3" placeholder="06 00 00 00 00" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-dk mb-1.5">Adresse exacte</label>
                  <input type="text" className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary w-full px-4 py-3" placeholder="Numéro, rue, bâtiment, code postal..." />
                </div>
                
                <div className="flex gap-4 mt-4">
                  <button type="button" onClick={() => setStep(1)} className="btn bg-bg-alt border border-border text-text-muted hover:border-primary-lt w-1/3 justify-center">Retour</button>
                  <button type="submit" className="btn btn-primary flex-1 justify-center bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-600/20">
                    Mandater l'Artisan !
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
