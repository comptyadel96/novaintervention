"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { authApi } from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api/errors";

export function EmailVerificationBanner({ email }: { email: string }) {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Mail className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Confirmez votre adresse email</p>
            <p className="text-sm mt-1 text-amber-900/90">
              Certaines actions (demande d&apos;intervention, acceptation de
              mission, photos) sont bloquées tant que vous n&apos;avez pas cliqué
              le lien reçu par email.
            </p>
            {feedback && (
              <p className="text-sm mt-2 text-green-800 font-medium">
                {feedback}
              </p>
            )}
            {error && (
              <p className="text-sm mt-2 text-red-700 font-medium">{error}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleResend}
          disabled={isSending}
          className="btn btn-primary shrink-0 self-start sm:self-center disabled:opacity-50"
        >
          {isSending ? "Envoi…" : "Renvoyer l'email"}
        </button>
      </div>
    </div>
  );
}
