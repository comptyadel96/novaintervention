export type FieldValidation = {
  valid: boolean;
  message: string | null;
};

export function validateRequired(
  value: string,
  label: string,
): FieldValidation {
  if (!value.trim()) {
    return {
      valid: false,
      message: `${label} est obligatoire.`,
    };
  }
  return { valid: true, message: null };
}

export function validateEmail(value: string): FieldValidation {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, message: "L'adresse email est obligatoire." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      valid: false,
      message:
        "L'adresse email n'est pas valide. Exemple : jean.dupont@email.com",
    };
  }
  return { valid: true, message: null };
}

export function validatePassword(value: string): FieldValidation {
  if (!value) {
    return {
      valid: false,
      message: "Le mot de passe est obligatoire.",
    };
  }
  if (value.length < 8) {
    return {
      valid: false,
      message:
        "Le mot de passe doit contenir au moins 8 caractères.",
    };
  }
  return { valid: true, message: null };
}

export function validatePasswordConfirm(
  password: string,
  confirm: string,
): FieldValidation {
  if (!confirm) {
    return {
      valid: false,
      message: "Veuillez confirmer votre mot de passe.",
    };
  }
  if (password !== confirm) {
    return {
      valid: false,
      message: "Les deux mots de passe ne correspondent pas.",
    };
  }
  return { valid: true, message: null };
}

export function validatePhone(value: string): FieldValidation {
  const trimmed = value.trim();
  if (!trimmed) {
    return {
      valid: false,
      message: "Le numéro de téléphone est obligatoire.",
    };
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10) {
    return {
      valid: false,
      message:
        "Numéro invalide. Saisissez un numéro français à 10 chiffres (ex. 06 12 34 56 78 ou +33 6 12 34 56 78).",
    };
  }
  return { valid: true, message: null };
}

export function validateName(
  value: string,
  label: "prénom" | "nom",
): FieldValidation {
  const trimmed = value.trim();
  if (!trimmed) {
    return {
      valid: false,
      message: `Le ${label} est obligatoire.`,
    };
  }
  if (trimmed.length < 2) {
    return {
      valid: false,
      message: `Le ${label} doit contenir au moins 2 caractères.`,
    };
  }
  return { valid: true, message: null };
}

export function validateSmsCode(value: string): FieldValidation {
  const code = value.replace(/\D/g, "");
  if (!code) {
    return { valid: false, message: "Saisissez le code reçu par SMS." };
  }
  if (code.length < 4) {
    return {
      valid: false,
      message: "Le code doit contenir au moins 4 chiffres.",
    };
  }
  return { valid: true, message: null };
}

export function validateOptionalEmail(value: string): FieldValidation {
  if (!value.trim()) return { valid: true, message: null };
  return validateEmail(value);
}

export function validateFullName(value: string): FieldValidation {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, message: "Le nom complet est obligatoire." };
  }
  if (trimmed.length < 3) {
    return {
      valid: false,
      message:
        "Indiquez votre prénom et votre nom (au moins 3 caractères au total).",
    };
  }
  return { valid: true, message: null };
}

export function validateAddress(value: string): FieldValidation {
  const trimmed = value.trim();
  if (!trimmed) {
    return {
      valid: false,
      message: "L'adresse d'intervention est obligatoire.",
    };
  }
  if (trimmed.length < 8) {
    return {
      valid: false,
      message:
        "Saisissez une adresse complète : numéro, rue, code postal et ville.",
    };
  }
  return { valid: true, message: null };
}

export function validateCity(value: string): FieldValidation {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, message: "La ville est obligatoire." };
  }
  if (trimmed.length < 2) {
    return {
      valid: false,
      message: "La ville doit contenir au moins 2 caractères.",
    };
  }
  return { valid: true, message: null };
}

export function validateSiret(value: string): FieldValidation {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return { valid: false, message: "Le numéro SIRET est obligatoire." };
  }
  if (digits.length !== 14) {
    return {
      valid: false,
      message: "Le SIRET doit comporter exactement 14 chiffres.",
    };
  }
  return { valid: true, message: null };
}

export function validateSpecialty(value: string): FieldValidation {
  if (!value.trim()) {
    return {
      valid: false,
      message: "Sélectionnez votre métier ou spécialité.",
    };
  }
  return { valid: true, message: null };
}

/** Messages HTML5 en français pour la validation native */
export function setFrenchValidity(
  el: HTMLInputElement | HTMLTextAreaElement,
  message: string,
) {
  el.setCustomValidity(message);
}

export function clearValidity(el: HTMLInputElement | HTMLTextAreaElement) {
  el.setCustomValidity("");
}
