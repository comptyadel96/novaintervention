"use client";

import { Phone, MessageCircle, Mail, X } from "lucide-react";
import type { PartnerApplication } from "@/types/domain";
import {
  buildMailtoLink,
  buildTelLink,
  buildWhatsAppLink,
  defaultPartnerContactMessage,
  defaultPartnerEmailSubject,
} from "@/lib/contact/contact-channels";

type Props = {
  application: PartnerApplication | null;
  open: boolean;
  onClose: () => void;
  onContacted?: (application: PartnerApplication) => void;
};

export function ContactApplicationDialog({
  application,
  open,
  onClose,
  onContacted,
}: Props) {
  if (!open || !application) return null;

  const message = defaultPartnerContactMessage(application);
  const emailSubject = defaultPartnerEmailSubject(application);
  const emailBody = message;
  const hasEmail = Boolean(application.email?.trim());

  const handleChannel = (channel: "phone" | "whatsapp" | "email") => {
    if (channel === "phone") {
      window.location.href = buildTelLink(application.phone);
    } else if (channel === "whatsapp") {
      window.open(
        buildWhatsAppLink(application.phone, message),
        "_blank",
        "noopener,noreferrer",
      );
    } else if (hasEmail && application.email) {
      window.location.href = buildMailtoLink(application.email, {
        subject: emailSubject,
        body: emailBody,
      });
    }
    onContacted?.(application);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-app-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white border border-border shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Contacter le candidat
            </p>
            <h3
              id="contact-app-title"
              className="text-xl font-extrabold text-primary-dk"
            >
              {application.firstName} {application.lastName}
            </h3>
            <p className="text-sm text-text-muted mt-1">
              {application.phone}
              {application.city ? ` · ${application.city}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-muted hover:bg-bg-alt"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-text-muted mb-5">
          Choisissez comment joindre l&apos;artisan. Le statut passera à{" "}
          <strong>contacté</strong> après votre action.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleChannel("phone")}
            className="btn btn-primary w-full justify-center gap-2 py-3"
          >
            <Phone size={18} />
            Appeler (téléphone)
          </button>

          <button
            type="button"
            onClick={() => handleChannel("whatsapp")}
            className="btn w-full justify-center gap-2 py-3 bg-[#25D366] text-white border-[#25D366] hover:opacity-90"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>

          {hasEmail ? (
            <button
              type="button"
              onClick={() => handleChannel("email")}
              className="btn btn-outline w-full justify-center gap-2 py-3"
            >
              <Mail size={18} />
              Email ({application.email})
            </button>
          ) : (
            <p className="text-xs text-text-muted text-center px-2">
              Pas d&apos;email sur cette candidature — le candidat peut en
              indiquer un sur le formulaire partenaire.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
