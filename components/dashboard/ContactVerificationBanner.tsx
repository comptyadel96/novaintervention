"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Smartphone } from "lucide-react";
import { authApi } from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api/errors";

export function ContactVerificationBanner({
  email,
  phoneVerified,
}: {
  email: string;
  phoneVerified?: boolean;
}) {
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    setIsSending(true);
    setError(null);
    setFeedback(null);
    try {
      const data = await authApi.resendVerification();
      setFeedback(
        data.message ??
          `Un nouvel email a été envoyé à ${email}. Vérifiez vos spams.`,
      );
    } catch (err) {
      setError(getErrorMessage(err, "Impossible de renvoyer l'email."));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      role="alert"
      className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Mail className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Contact à vérifier</p>
            <p className="text-sm mt-1 text-amber-900/90">
              Certaines actions (demande d&apos;intervention, photos, acceptation
              de mission) nécessitent un <strong>email vérifié</strong> ou un{" "}
              <strong>téléphone vérifié</strong>.
            </p>
            {feedback && (
              <p className="text-sm mt-2 text-green-800 font-medium">{feedback}</p>
            )}
            {error && (
              <p className="text-sm mt-2 text-red-700 font-medium">{error}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={isSending}
            className="btn btn-primary btn-sm disabled:opacity-50"
          >
            {isSending ? "Envoi…" : "Renvoyer l'email"}
          </button>
          {!phoneVerified && (
            <Link
              href="/verify-phone"
              className="btn btn-outline btn-sm inline-flex items-center gap-2"
            >
              <Smartphone size={16} />
              Vérifier mon numéro
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
