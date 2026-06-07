"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { analyzePhoto, analyzeText } from "@/services/api/vision";
import { fetchAiPhotoStatus } from "@/services/api/ai-photo";
import type { AnalyzePhotoMeta, AnalyzePhotoResult } from "@/types";
import { formatAiInterventionType } from "@/lib/ai/intervention-labels";
import { isIndicativeEstimate } from "@/lib/ai/analysis-meta";
import { clientMissionsApi, clientUploadsApi } from "@/services/api/client";
import { authApi } from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api/errors";
import {
  DemanderCoordinatesStep,
  validateDemanderCoordinates,
} from "@/components/demander/DemanderCoordinatesStep";
import { useRouter } from "next/navigation";
import { OptimizedImage } from "@/components/ui/OptimizedImage";


const steps = ["Photo", "Estimation", "Coordonnées", "Confirmation"];

export default function DemanderPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  
  // Real State for API
  const [isLoading, setIsLoading] = useState(false);
  const [iaResult, setIaResult] = useState<AnalyzePhotoResult | null>(null);
  const [extraDesc, setExtraDesc] = useState("");
  const [photoContext, setPhotoContext] = useState("");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [analysisMeta, setAnalysisMeta] = useState<AnalyzePhotoMeta | null>(
    null,
  );
  const [creationMode, setCreationMode] = useState<
    "ai_photo" | "text_manual" | "mixed" | null
  >(null);
  const [inputMode, setInputMode] = useState<"photo" | "text">("photo");
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{
    enabled: boolean;
    model?: string;
    textFallbackAvailable?: boolean;
  } | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [cityHint, setCityHint] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);


  const [file, setFile] = useState<File | null>(null);
  const [submittedMissionId, setSubmittedMissionId] = useState<string | null>(
    null,
  );
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    authApi
      .getSession()
      .then((session) => {
        const firstName =
          session.profile?.first_name ?? session.user.firstName ?? "";
        const lastName =
          session.profile?.last_name ?? session.user.lastName ?? "";
        const phone = session.profile?.phone ?? session.user.phone ?? "";
        setFormData((prev) => ({
          ...prev,
          firstName: prev.firstName || firstName,
          lastName: prev.lastName || lastName,
          email: prev.email || session.user.email || "",
          phone: prev.phone || phone,
        }));
      })
      .catch(() => {
        // Parcours invité : pas de redirection vers /login
      });

    fetchAiPhotoStatus()
      .then(setAiStatus)
      .catch(() => setAiStatus({ enabled: false }));
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setUploadedPhotoUrl(null);
      setIaResult(null);
      setAnalysisMeta(null);
      setAnalysisError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const startAnalysis = async () => {
    if (!preview || !file) return;
    setIsLoading(true);
    setAnalysisError(null);

    try {
      let imageUrl = uploadedPhotoUrl ?? undefined;

      if (!imageUrl) {
        try {
          const { url } = await clientUploadsApi.uploadInterventionPhoto(file);
          imageUrl = url;
          setUploadedPhotoUrl(url);
        } catch {
          // analyse via base64 si upload indisponible
        }
      }

      const { analysis, meta } = await analyzePhoto({
        imageUrl,
        image: imageUrl ? undefined : preview,
        context: photoContext.trim() || undefined,
      });

      setIaResult(analysis);
      setAnalysisMeta(meta);
      setCreationMode(photoContext.trim() ? "mixed" : "ai_photo");
      setStep(1);
    } catch (err) {
      console.error(err);
      setAnalysisError(
        getErrorMessage(
          err,
          "Impossible d'analyser la photo pour le moment.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startTextAnalysis = async () => {
    const description = photoContext.trim();
    if (description.length < 10) {
      setAnalysisError(
        "Décrivez le problème en au moins 10 caractères pour continuer sans photo.",
      );
      return;
    }

    setIsLoading(true);
    setAnalysisError(null);

    try {
      const { analysis, meta } = await analyzeText({
        description,
        category: "plomberie",
      });
      setIaResult(analysis);
      setAnalysisMeta(meta);
      setCreationMode("text_manual");
      setFile(null);
      setPreview(null);
      setUploadedPhotoUrl(null);
      setStep(1);
    } catch (err) {
      console.error(err);
      setAnalysisError(
        getErrorMessage(err, "Impossible d'estimer votre demande pour le moment."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const continueWithoutPhoto = () => {
    setInputMode("text");
    setAnalysisError(null);
    if (photoContext.trim().length >= 10) {
      void startTextAnalysis();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!iaResult) return;
    if (creationMode !== "text_manual" && !file) return;

    setFormError(null);
    const errors = validateDemanderCoordinates(formData, coords);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      let publicUrl = uploadedPhotoUrl ?? undefined;
      if (file && !publicUrl) {
        const uploaded = await clientUploadsApi.uploadInterventionPhoto(file);
        publicUrl = uploaded.url;
      }

      const mode =
        creationMode ??
        (publicUrl ? (photoContext.trim() ? "mixed" : "ai_photo") : "text_manual");

      const customerName = [formData.firstName, formData.lastName]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ");

      const result = await clientMissionsApi.create({
        title: formatAiInterventionType(iaResult.type_intervention),
        status: "pending",
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        customer_name: customerName,
        customer_email: formData.email.trim(),
        customer_phone: formData.phone,
        location: formData.address,
        city: cityHint ?? undefined,
        description: extraDesc || iaResult.description_probleme,
        price: iaResult.estimation_prix_max,
        priceEstimate: iaResult.estimation_prix_max,
        ...(publicUrl ? { photo_url: publicUrl } : {}),
        lat: coords!.lat,
        lng: coords!.lng,
        type_intervention: iaResult.type_intervention,
        niveau_urgence: iaResult.niveau_urgence,
        estimation_prix_min: iaResult.estimation_prix_min,
        estimation_prix_max: iaResult.estimation_prix_max,
        ai_confidence: iaResult.confidence,
        duree_estimee_minutes: iaResult.duree_estimee_minutes,
        pieces_recommandees: iaResult.pieces_recommandees,
        creationMode: mode,
      });

      setSubmittedMissionId(result.mission.id);
      setAccountCreated(result.accountCreated === true || result.autoLogin === true);
      setStep(3);
      router.refresh();
    } catch (err) {
      console.error("Error creating mission:", err);
      setFormError(
        getErrorMessage(err, "Une erreur est survenue lors de l'envoi de votre demande."),
      );
    } finally {
      setIsSubmitting(false);
    }
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
              <h2 className="text-2xl font-bold text-primary-dk mb-4">Décrivez l&apos;urgence</h2>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                Ajoutez une photo ou décrivez le problème : nous estimons le type
                d&apos;intervention, l&apos;urgence et une fourchette de prix indicative.
              </p>

              <div className="flex gap-2 p-1 bg-bg-alt rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setInputMode("photo")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                    inputMode === "photo"
                      ? "bg-white text-primary-dk shadow-sm"
                      : "text-text-muted"
                  }`}
                >
                  Avec photo
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("text")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                    inputMode === "text"
                      ? "bg-white text-primary-dk shadow-sm"
                      : "text-text-muted"
                  }`}
                >
                  Sans photo
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-primary-dk mb-2">
                  {inputMode === "photo"
                    ? "Décrivez le problème (optionnel)"
                    : "Décrivez le problème (obligatoire)"}
                </label>
                <textarea
                  value={photoContext}
                  onChange={(e) => setPhotoContext(e.target.value)}
                  className="form-input w-full min-h-[96px]"
                  placeholder="Ex. fuite sous l'évier cuisine, eau tiède, depuis ce matin…"
                  disabled={isLoading}
                />
              </div>

              {analysisError && (
                <div className="form-banner-error mb-4" role="alert">
                  {analysisError}
                </div>
              )}

              {inputMode === "photo" ? (
                <>
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
                      <OptimizedImage
                        src={preview}
                        alt="Aperçu"
                        width={320}
                        height={192}
                        className="max-h-48 rounded-xl object-cover shadow-sm mb-4"
                      />
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
                        Analyse en cours…
                      </>
                    ) : (
                      "Analyser ma photo"
                    )}
                  </button>

                  {(analysisError || aiStatus?.textFallbackAvailable !== false) && (
                    <button
                      type="button"
                      onClick={continueWithoutPhoto}
                      disabled={isLoading}
                      className="btn btn-outline w-full justify-center mt-3"
                    >
                      Continuer sans photo
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={startTextAnalysis}
                  disabled={isLoading || photoContext.trim().length < 10}
                  className="btn btn-primary w-full justify-center text-lg py-4 disabled:opacity-50"
                >
                  {isLoading ? "Estimation en cours…" : "Obtenir une estimation"}
                </button>
              )}
            </div>
          )}

          {/* STEP 1 — AI result */}
          {step === 1 && iaResult && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Étape 2 sur 3</span>
              <h2 className="text-2xl font-bold text-primary-dk mb-6">Estimation de votre intervention</h2>

              {analysisMeta && isIndicativeEstimate(analysisMeta) && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  <p className="font-bold">Estimation indicative</p>
                  <p className="mt-1">
                    Un artisan certifié affinera le diagnostic sur place. Les
                    montants peuvent varier selon l&apos;intervention réelle.
                  </p>
                </div>
              )}

              <div className="bg-bg-alt border border-border rounded-2xl p-6 mb-6">
                {[
                  { key: "Intervention", val: formatAiInterventionType(iaResult.type_intervention), badge: true },
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

              {iaResult.confidence > 0 ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6 flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 flex-shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <div>
                    <p className="text-green-800 font-bold text-sm mb-1">Confiance de détection : {Math.round(iaResult.confidence * 100)}%</p>
                    <p className="text-green-700 text-xs">{iaResult.description_probleme}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-bg-alt border border-border p-4 rounded-xl mb-6">
                  <p className="text-sm font-bold text-primary-dk mb-1">Description</p>
                  <p className="text-sm text-text-muted">{iaResult.description_probleme}</p>
                </div>
              )}

              {iaResult.pieces_recommandees.length > 0 && (
                <div className="mb-6 rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm font-bold text-primary-dk mb-2">
                    Pièces / actions suggérées
                  </p>
                  <ul className="text-sm text-text-muted list-disc pl-5 space-y-1">
                    {iaResult.pieces_recommandees.map((piece) => (
                      <li key={piece}>{piece}</li>
                    ))}
                  </ul>
                </div>
              )}

              {iaResult.conseils_client.length > 0 && (
                <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-bold text-primary-dk mb-2">
                    Conseils immédiats
                  </p>
                  <ul className="text-sm text-blue-950 list-disc pl-5 space-y-1">
                    {iaResult.conseils_client.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Règle Métier : Si confidence < 0.6, afficher le champ supplémentaire */}
              {iaResult.confidence < 0.6 && (
                <div className="mb-8 p-4 rounded-xl bg-orange-50 border border-orange-200">
                  <label className="block text-sm font-bold text-orange-900 mb-2">Pour affiner l&apos;estimation, décrivez davantage le problème :</label>
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

              <DemanderCoordinatesStep
                formData={formData}
                setFormData={setFormData}
                coords={coords}
                setCoords={setCoords}
                cityHint={cityHint}
                setCityHint={setCityHint}
                isSubmitting={isSubmitting}
                formError={formError}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                onBack={() => setStep(1)}
                onSubmit={handleSubmit}
              />
            </div>
          )}

          {/* STEP 3 — Confirmation */}
          {step === 3 && submittedMissionId && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-4">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                Demande envoyée
              </span>
              <h2 className="text-2xl font-bold text-primary-dk mb-3">
                Un artisan vous contacte sous 30 minutes
              </h2>
              <p className="text-sm text-text-muted mb-2 max-w-md mx-auto leading-relaxed">
                Votre demande{" "}
                <span className="font-mono text-primary-dk">#{submittedMissionId.slice(0, 8)}</span>{" "}
                a été transmise aux artisans certifiés près de{" "}
                {cityHint ?? "chez vous"}.
              </p>
              {accountCreated && (
                <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
                  Votre espace client a été créé. Un email de confirmation a
                  été envoyé à{" "}
                  <span className="font-semibold text-primary-dk">
                    {formData.email}
                  </span>
                  . Cliquez sur le lien pour activer votre compte et définir un
                  mot de passe.
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                <Link
                  href="/dashboard/requests"
                  className="btn btn-primary justify-center"
                >
                  Suivre ma demande
                </Link>
                <Link href="/" className="btn btn-outline justify-center">
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
