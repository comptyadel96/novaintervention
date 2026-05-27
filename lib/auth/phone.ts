/** Normalise un numéro FR vers format international (+33…). */
export function normalizePhone(input: string): string {
  const cleaned = input.replace(/[\s.-]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("0") && cleaned.length >= 10) {
    return `+33${cleaned.slice(1)}`;
  }
  if (/^33\d{9}$/.test(cleaned)) return `+${cleaned}`;
  return cleaned;
}
