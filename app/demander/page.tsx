"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const steps = ["Photo", "Analyse IA", "Coordonnées"];

export default function DemanderPage() {
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1, maxWidth: "40rem", margin: "0 auto", padding: "2.5rem 1.5rem 5rem", width: "100%" }}>

        {/* Step indicators */}
        <div className="steps">
          {steps.map((s, i) => (
            <div key={s} className="step-item">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div className={`step-circle step-circle--${i < step ? "done" : i === step ? "active" : "inactive"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="step-label" style={{ color: i <= step ? "var(--orange)" : "var(--muted)", fontWeight: i === step ? 600 : 400 }}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`step-line step-line--${i < step ? "done" : "inactive"}`} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 0 — Photo */}
        {step === 0 && (
          <div className="card-xl">
            <p className="label" style={{ marginBottom: "0.75rem" }}>Étape 1</p>
            <h1 className="h2" style={{ marginBottom: "0.75rem" }}>
              Décrivez votre problème en quelques secondes
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
              Prenez une photo et expliquez votre besoin. Vous recevrez une estimation claire avant intervention, sans surprise.
            </p>
            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              borderRadius: "1.25rem", border: "2px dashed rgba(255,107,43,0.35)",
              background: "rgba(255,107,43,0.03)", padding: "2.5rem 1.5rem",
              cursor: "pointer", marginBottom: "1.25rem",
            }}>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Aperçu" style={{ maxHeight: "200px", borderRadius: "0.75rem", objectFit: "cover" }} />
              ) : (
                <>
                  <span style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📷</span>
                  <p style={{ color: "#fff", fontWeight: 600, marginBottom: "0.25rem" }}>Ajouter une photo</p>
                  <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Cliquez pour sélectionner une image</p>
                </>
              )}
            </label>
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="form-label">Description du problème</label>
              <textarea className="form-textarea" placeholder="Ex: Ma baignoire fuit depuis ce matin, l'eau vient du joint…" style={{ minHeight: "5rem" }} />
            </div>
            <button onClick={() => setStep(1)} className="btn btn-primary btn-full">
              Analyser avec l&apos;IA →
            </button>
          </div>
        )}

        {/* STEP 1 — AI result */}
        {step === 1 && (
          <div className="card-xl">
            <p className="label" style={{ marginBottom: "0.75rem" }}>Étape 2</p>
            <h2 className="h2" style={{ marginBottom: "1.25rem" }}>Résultat de l&apos;analyse IA</h2>

            <div className="card-mid" style={{ marginBottom: "1.25rem" }}>
              {[
                { key: "Type d'intervention", val: "Plomberie", badge: true },
                { key: "Niveau d'urgence", val: "Urgent", badge: true, urgent: true },
                { key: "Estimation", val: "150€ – 250€ HT", badge: false },
                { key: "Durée estimée", val: "45 min", badge: false },
              ].map((row, i, arr) => (
                <div key={row.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{row.key}</span>
                    {row.badge ? (
                      <span className={`badge ${row.urgent ? "" : "badge-orange"}`} style={row.urgent ? { background: "rgba(239,68,68,0.15)", color: "#f87171" } : {}}>
                        {row.val}
                      </span>
                    ) : (
                      <span style={{ color: "#fff", fontWeight: 700 }}>{row.val}</span>
                    )}
                  </div>
                  {i < arr.length - 1 && <div className="divider" style={{ margin: 0 }} />}
                </div>
              ))}
            </div>

            <div style={{ borderRadius: "1rem", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", padding: "1rem", marginBottom: "1.25rem" }}>
              <p style={{ color: "var(--green)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.25rem" }}>✓ Confiance haute (91%)</p>
              <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Fuite probable au niveau du siphon ou du joint d&apos;évacuation.</p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setStep(0)} className="btn btn-outline" style={{ flex: 1 }}>← Retour</button>
              <button onClick={() => setStep(2)} className="btn btn-primary" style={{ flex: 2 }}>Confirmer →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Coordonnées */}
        {step === 2 && (
          <div className="card-xl">
            <p className="label" style={{ marginBottom: "0.75rem" }}>Étape 3</p>
            <h2 className="h2" style={{ marginBottom: "0.5rem" }}>Vos coordonnées</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Un artisan certifié vous sera envoyé rapidement.
            </p>
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Prénom</label>
                  <input type="text" className="form-input" placeholder="Jean" />
                </div>
                <div>
                  <label className="form-label">Téléphone</label>
                  <input type="tel" className="form-input" placeholder="06 00 00 00 00" />
                </div>
              </div>
              <div>
                <label className="form-label">Adresse complète</label>
                <input type="text" className="form-input" placeholder="12 rue de la Paix, 75001 Paris" />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>← Retour</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Envoyer la demande ✓</button>
              </div>
            </form>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "var(--muted)" }}>
          Besoin d&apos;aide immédiate ?{" "}
          <Link href="tel:+33788209773" style={{ color: "var(--green)", fontWeight: 600 }}>07 88 20 97 73</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
