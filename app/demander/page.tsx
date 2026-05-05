"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { analyzePhoto } from "@/services/api/vision";
import type { AnalyzePhotoResult } from "@/types";

const steps = ["Photo IA", "Estimation", "Coordonnées"];

export default function DemanderPage() {
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  
  // Real State for API
  const [isLoading, setIsLoading] = useState(false);
  const [iaResult, setIaResult] = useState<AnalyzePhotoResult | null>(null);
  const [extraDesc, setExtraDesc] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const startAnalysis = async () => {
    if (!preview) return;
    setIsLoading(true);
    try {
      const result = await analyzePhoto({ image: preview });
      setIaResult(result);
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'analyse de l'image. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("== PAYLOAD TO SUPABASE ==");
    console.log("Intervention details:", iaResult);
    if (extraDesc) console.log("Extra info:", extraDesc);
    console.log("Client details:", formData);
    alert("Votre demande a été envoyée avec succès ! Un artisan vous contactera d'ici quelques minutes.");
  };

  return (
    <div className="page-wrap bg-bg-body min-h-screen flex flex-col">
      <Header />
      <main className="container max-w-3xl py-12 flex-1 relative z-10">

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
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleFileChange} 
                  className="hidden" 
                  disabled={isLoading} 
                />
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

              <button 
                onClick={startAnalysis} 
                disabled={!preview || isLoading} 
                className="btn btn-primary w-full justify-center text-lg py-4 flex items-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Analyse par l'IA en cours...
                  </>
                ) : (
                  "Lancer l'analyse IA"
                )}
              </button>
            </div>
          )}

          {/* STEP 1 — AI result */}
          {step === 1 && iaResult && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Étape 2 sur 3</span>
              <h2 className="text-2xl font-bold text-primary-dk mb-6">Bilan de l'Intelligence Artificielle</h2>

              <div className="bg-bg-alt border border-border rounded-2xl p-6 mb-6">
                {[
                  { key: "Intervention", val: iaResult.type_intervention.replace('services__', '').replace(/_/g, ' '), badge: true },
                  { key: "Urgence", val: iaResult.niveau_urgence, badge: true, urgent: iaResult.niveau_urgence === 'urgent' },
                  { key: "Estimation", val: `${iaResult.estimation_prix_min}€ – ${iaResult.estimation_prix_max}€ HT`, badge: false, heavy: true },
                  { key: "Temps requis", val: `${iaResult.duree_estimee_minutes} minutes estimées`, badge: false },
                ].map((row, i) => (
                  <div key={row.key} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 border-b border-border last:border-0 last:pb-0 first:pt-0">
                    <span className="text-sm font-semibold text-text-muted mb-2 sm:mb-0 capitalize">{row.key}</span>
                    {row.badge ? (
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border capitalize ${row.urgent ? "bg-red-50 text-red-600 border-red-200" : "bg-bg-body text-primary-dk border-border"} self-start sm:self-auto`}>
                        {row.val}
                      </span>
                    ) : (
                      <span className={`text-sm ${row.heavy ? "font-extrabold text-primary text-xl" : "font-bold text-primary-dk"}`}>{row.val}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6 flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 flex-shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div>
                  <p className="text-green-800 font-bold text-sm mb-1">Confiance de détection : {Math.round(iaResult.confidence * 100)}%</p>
                  <p className="text-green-700 text-xs">{iaResult.description_probleme}</p>
                </div>
              </div>

              {/* Règle Métier : Si confidence < 0.6, afficher le champ supplémentaire */}
              {iaResult.confidence < 0.6 && (
                <div className="mb-8 p-4 rounded-xl bg-orange-50 border border-orange-200">
                  <label className="block text-sm font-bold text-orange-900 mb-2">L'IA manque de certitude sur l'image. Veuillez détailler le problème :</label>
                  <textarea 
                    className="form-input bg-white border border-border text-primary-dk rounded-xl focus:ring-primary w-full px-4 py-3 min-h-[80px]" 
                    placeholder="Mon évier fuit par le dessous depuis ce matin..."
                    value={extraDesc}
                    onChange={(e) => setExtraDesc(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(0)} className="btn bg-bg-alt border border-border text-text-muted hover:border-primary-lt w-1/3 justify-center">Retour</button>
                <button onClick={() => setStep(2)} className="btn btn-primary flex-1 justify-center" disabled={iaResult.confidence < 0.6 && extraDesc.trim().length === 0}>
                  Confirmer le Bilan
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Coordonnées */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">C'est presque terminé</span>
              <h2 className="text-2xl font-bold text-primary-dk mb-2">Où doit-on intervenir ?</h2>
              <p className="text-sm text-text-muted mb-8">Un expert Nova certifié sera chez vous dans les minutes qui suivent.</p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-primary-dk mb-1.5">Nom complet</label>
                    <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary w-full px-4 py-3" placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dk mb-1.5">Téléphone d'urgence</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary w-full px-4 py-3" placeholder="06 00 00 00 00" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-dk mb-1.5">Adresse exacte</label>
                  <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary w-full px-4 py-3" placeholder="Numéro, rue, bâtiment, code postal..." />
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
