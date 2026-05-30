/** Normalise un numéro FR pour liens tel: / WhatsApp. */
export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function toWhatsAppInternational(phone: string): string {
  const d = digitsOnly(phone);
  if (d.startsWith("33")) return d;
  if (d.startsWith("0") && d.length >= 10) return `33${d.slice(1)}`;
  return d;
}

export function buildTelLink(phone: string): string {
  const d = digitsOnly(phone);
  if (d.startsWith("33")) return `tel:+${d}`;
  if (d.startsWith("0")) return `tel:+33${d.slice(1)}`;
  return `tel:${phone.trim()}`;
}

export function buildWhatsAppLink(
  phone: string,
  message?: string,
): string {
  const n = toWhatsAppInternational(phone);
  const base = `https://wa.me/${n}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function buildMailtoLink(
  email: string,
  options?: { subject?: string; body?: string },
): string {
  const params = new URLSearchParams();
  if (options?.subject) params.set("subject", options.subject);
  if (options?.body) params.set("body", options.body);
  const q = params.toString();
  return `mailto:${email.trim()}${q ? `?${q}` : ""}`;
}

export function defaultPartnerContactMessage(app: {
  firstName: string;
  lastName: string;
  city: string;
}): string {
  return `Bonjour ${app.firstName}, c'est Nova Intervention. Nous avons reçu votre candidature plombier (${app.city}). Pouvons-nous en discuter ?`;
}

export function defaultPartnerEmailSubject(app: {
  firstName: string;
  lastName: string;
}): string {
  return `Nova Intervention — votre candidature partenaire (${app.firstName} ${app.lastName})`;
}
