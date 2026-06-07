import type {
  CreatePartnerApplicationInput,
  PartnerApplicationSubmitResult,
} from "@/types/domain";
import { mapPartnerApplication } from "@/lib/api/map-partner-application";

export async function submitPartnerApplication(
  input: CreatePartnerApplicationInput,
): Promise<PartnerApplicationSubmitResult> {
  const response = await fetch("/api/partner-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      trade: "plomberie",
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  if (!response.ok) {
    throw new Error(
      (payload.message as string | undefined) ??
        "Impossible d'envoyer la candidature.",
    );
  }

  const application = mapPartnerApplication(
    (payload.application as Record<string, unknown> | undefined) ?? payload,
  );

  return {
    application,
    message:
      (payload.message as string | undefined) ??
      "Candidature reçue. Vérifiez votre email pour vous connecter.",
    accountCreated: payload.accountCreated === true,
    emailSent: payload.emailSent === true,
    userId:
      typeof payload.userId === "string"
        ? payload.userId
        : typeof payload.user_id === "string"
          ? payload.user_id
          : undefined,
  };
}
