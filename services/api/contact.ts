import type { ContactMessageInput } from "@/types/domain";

export async function submitContactMessage(
  input: ContactMessageInput,
): Promise<{ id?: string; message: string }> {
  const response = await fetch("/api/contact-messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      source: input.source ?? "contact-page",
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (payload as { message?: string }).message ??
        "Impossible d'envoyer le message.",
    );
  }

  return payload as { id?: string; message: string };
}
