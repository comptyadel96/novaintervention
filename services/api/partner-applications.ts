import type {
  CreatePartnerApplicationInput,
  PartnerApplication,
} from "@/types/domain";

export async function submitPartnerApplication(
  input: CreatePartnerApplicationInput,
): Promise<PartnerApplication> {
  const response = await fetch("/api/partner-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (payload as { message?: string }).message ??
        "Impossible d'envoyer la candidature.",
    );
  }

  return (payload as { application: PartnerApplication }).application;
}
