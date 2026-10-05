"use client";

import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";

import { ConfidenceBadge } from "@/components/passport/ConfidenceBadge";
import { getErrorMessage } from "@/lib/api/errors";
import { DOCUMENT_KIND_LABELS } from "@/lib/passport/labels";
import { clientUploadsApi } from "@/services/api/client";
import { passportApi } from "@/services/api/passport";
import type { PassportDocument, PassportDocumentKind } from "@/types/passport";

const KINDS = Object.keys(DOCUMENT_KIND_LABELS) as PassportDocumentKind[];

export function PassportDocuments({
  buildingId,
  documents,
  readOnly,
  onChange,
  onMutated,
}: {
  buildingId: string;
  documents: PassportDocument[];
  readOnly: boolean;
  onChange: (documents: PassportDocument[]) => void;
  onMutated?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<PassportDocumentKind>("invoice");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const { url } = await clientUploadsApi.uploadInterventionPhoto(file);
      const created = await passportApi.addDocument(buildingId, {
        kind,
        name: file.name,
        url,
        issuedAt: new Date().toISOString(),
      });
      onChange([created, ...documents]);
      onMutated?.();
    } catch (err) {
      setError(getErrorMessage(err, "Ajout du document impossible."));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await passportApi.deleteDocument(documentId);
      onChange(documents.filter((item) => item.id !== documentId));
      onMutated?.();
    } catch (err) {
      setError(getErrorMessage(err, "Suppression impossible."));
    }
  };

  return (
    <section className="card p-8 bg-white border border-border rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="page-h3 mb-1">Documents</h2>
          <p className="text-sm text-text-muted">
            Factures, garanties, notices, diagnostics.
          </p>
        </div>
      </div>

      {error && <p className="form-banner-error">{error}</p>}

      {!readOnly && (
        <div className="flex flex-wrap items-end gap-3 mb-6 p-5 bg-bg-alt rounded-2xl">
          <div className="form-field flex-1 min-w-[12rem]">
            <label className="form-label" htmlFor="document-kind">
              Type de document
            </label>
            <select
              id="document-kind"
              className="form-input"
              value={kind}
              onChange={(event) =>
                setKind(event.target.value as PassportDocumentKind)
              }
            >
              {KINDS.map((value) => (
                <option key={value} value={value}>
                  {DOCUMENT_KIND_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          <button
            type="button"
            className="btn btn-outline btn-sm flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={16} />
            {uploading ? "Envoi…" : "Ajouter un fichier"}
          </button>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-sm text-text-muted italic">
          Aucun document. Chaque facture ajoutée renforce la valeur de preuve de
          votre passeport.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map((document) => (
            <li
              key={document.id}
              className="flex items-center justify-between gap-3 p-4 border border-border rounded-2xl"
            >
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 min-w-0 group"
              >
                <span className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-primary-dk truncate group-hover:underline">
                    {document.name}
                  </span>
                  <span className="block text-xs text-text-muted">
                    {DOCUMENT_KIND_LABELS[document.kind]}
                  </span>
                </span>
              </a>

              <div className="flex items-center gap-2 shrink-0">
                <ConfidenceBadge level={document.confidence} />
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleDelete(document.id)}
                    aria-label={`Supprimer ${document.name}`}
                    className="p-2 rounded-xl text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
