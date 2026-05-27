import type { AuthUser, Profile } from "@/types/domain";
import {
  missingProfileFields,
  type ProfileCompletionField,
} from "@/lib/auth/profile-completion";

const FIELD_LABELS: Record<ProfileCompletionField, string> = {
  phone: "votre numéro de téléphone",
  location: "votre adresse et votre position GPS",
};

export function profileCompletionBannerText(
  user: AuthUser,
  profile?: Profile | null,
): string {
  const missing = missingProfileFields(user, profile);
  if (missing.length === 0) {
    return "Complétez votre profil pour utiliser Nova Intervention.";
  }
  if (missing.length === 1) {
    return `Ajoutez ${FIELD_LABELS[missing[0]]} pour utiliser Nova Intervention.`;
  }
  return "Ajoutez votre numéro de téléphone et votre adresse avec position GPS pour utiliser Nova Intervention.";
}
