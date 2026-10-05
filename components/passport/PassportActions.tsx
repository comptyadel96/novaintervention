"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Download, Send, Unlink } from "lucide-react";

import { getErrorMessage } from "@/lib/api/errors";
import { passportApi } from "@/services/api/passport";

export function PassportActions({
  buildingId,
  readOnly,
  onTransferred,
}: {
  buildingId: string;
  readOnly: boolean;
  onTransferred: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [keepAccess, setKeepAccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"json" | "pdf" | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [detaching, setDetaching] = useState(false);

  const handleExport = async (format: "json" | "pdf") => {
    setExporting(format);
    setError(null);
    try {
      await passportApi.exportBuilding(buildingId, format);
    } catch (err) {
      setError(getErrorMessage(err, "Export impossible."));
    } finally {
      setExporting(null);
    }
  };

  const handleTransfer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!confirmed) {
      setError("Cochez la confirmation avant de transférer.");
      return;
    }
    setTransferring(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await passportApi.transferBuilding(buildingId, {
        email: email.trim(),
        keepAccess,
      });
      setSuccess(result.message);
      setEmail("");
      setConfirmed(false);
      if (result.keepAccess) {
        onTransferred();
      } else {
        router.push("/dashboard/passeport");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Transfert impossible."));
    } finally {
      setTransferring(false);
    }
  };

  const handleDetach = async () => {
    const accepted = window.confirm(
      "Retirer ce passeport de votre compte ? L'historique du bâtiment n'est pas supprimé.",
    );
    if (!accepted) return;

    setDetaching(true);
    setError(null);
    try {
      await passportApi.deleteBuilding(buildingId);
      router.push("/dashboard/passeport");
    } catch (err) {
      setError(getErrorMessage(err, "Impossible de retirer ce passeport."));
      setDetaching(false);
    }
  };

  return (
    <section className="card p-8 bg-white border border-border rounded-[2rem] shadow-sm">
      <div className="mb-6">
        <h2 className="page-h3 mb-1">Export et transfert</h2>
        <p className="text-sm text-text-muted">
          Téléchargez le dossier, ou transmettez-le lors d&apos;une vente.
        </p>
      </div>

      {error && <p className="form-banner-error">{error}</p>}
      {success && (
        <p className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          type="button"
          className="btn btn-outline btn-sm flex items-center gap-2"
          onClick={() => handleExport("pdf")}
          disabled={exporting !== null}
        >
          <Download size={16} />
          {exporting === "pdf" ? "Export…" : "Télécharger le PDF"}
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm flex items-center gap-2"
          onClick={() => handleExport("json")}
          disabled={exporting !== null}
        >
          <Download size={16} />
          {exporting === "json" ? "Export…" : "Télécharger le JSON"}
        </button>
      </div>

      {!readOnly && (
        <form
          onSubmit={handleTransfer}
          className="p-5 bg-bg-alt rounded-2xl space-y-4 mb-6"
        >
          <p className="text-sm font-bold text-primary-dk">
            Transférer à un nouveau propriétaire
          </p>
          <p className="text-sm text-text-muted">
            Le destinataire doit déjà avoir un compte Nova. L&apos;historique du
            logement lui est transmis ; votre identité n&apos;y figure plus.
          </p>
          <div className="form-field">
            <label className="form-label" htmlFor="transfer-email">
              Email du nouveau propriétaire
            </label>
            <input
              id="transfer-email"
              type="email"
              required
              autoComplete="off"
              className="form-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nouveau.proprietaire@email.fr"
            />
          </div>
          <label className="flex items-start gap-3 text-sm text-text-muted">
            <input
              type="checkbox"
              className="mt-1"
              checked={keepAccess}
              onChange={(event) => setKeepAccess(event.target.checked)}
            />
            Conserver un accès en lecture seule après le transfert
          </label>
          <label className="flex items-start gap-3 text-sm text-text-muted">
            <input
              type="checkbox"
              className="mt-1"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            Je confirme transférer la propriété de ce passeport
          </label>
          <button
            type="submit"
            className="btn btn-primary btn-sm flex items-center gap-2"
            disabled={transferring}
          >
            <Send size={16} />
            {transferring ? "Transfert…" : "Transférer le passeport"}
          </button>
        </form>
      )}

      <button
        type="button"
        className="btn btn-outline btn-sm flex items-center gap-2 text-red-700 border-red-200 hover:bg-red-50"
        onClick={handleDetach}
        disabled={detaching}
      >
        <Unlink size={16} />
        {detaching ? "Retrait…" : "Retirer ce passeport de mon compte"}
      </button>
    </section>
  );
}
