export class ApiError extends Error {

  constructor(

    message: string,

    public status: number,

    public code?: string,

  ) {

    super(message);

    this.name = "ApiError";

  }

}



const ERROR_MESSAGES: Record<string, string> = {

  EMAIL_NOT_VERIFIED:

    "Vérifiez votre email ou votre téléphone pour continuer.",

  CONTACT_NOT_VERIFIED:

    "Vérifiez votre email ou votre numéro de téléphone pour utiliser cette fonctionnalité.",

  ACCOUNT_BANNED: "Votre compte a été suspendu. Contactez le support.",

  CANNOT_BAN_ADMIN: "Impossible de bannir un compte administrateur.",

  DATABASE_UNAVAILABLE:

    "Le service est temporairement indisponible. Réessayez dans quelques secondes.",

  UNAUTHORIZED: "Session expirée. Veuillez vous reconnecter.",
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect.",
  EMAIL_PHONE_MISMATCH:
    "Cet email et ce numéro de téléphone sont associés à des comptes différents. Connectez-vous ou contactez le support.",
  SESSION_EXPIRED:
    "Votre session a expiré. Reconnectez-vous puis réessayez.",

  TWILIO_NOT_CONFIGURED:

    "La connexion par SMS n'est pas disponible pour le moment. Utilisez l'email ou contactez le support.",

  INVALID_PHONE:

    "Numéro invalide. Utilisez le format 06 12 34 56 78 ou +33 6 12 34 56 78.",

  USER_NOT_FOUND:

    "Aucun compte associé à ce numéro. Créez un compte pour continuer.",

  GOOGLE_AUTH_NOT_CONFIGURED:

    "La connexion Google n'est pas disponible pour le moment.",

  GOOGLE_AUTH_ONLY:

    "Ce compte utilise Google. Cliquez sur « Continuer avec Google » ci-dessus.",

  INVALID_GOOGLE_TOKEN:

    "Connexion Google expirée ou invalide. Réessayez.",

  OPENAI_NOT_CONFIGURED:

    "L'analyse photo par IA n'est pas disponible pour le moment. Réessayez plus tard.",

  AI_UNAVAILABLE:

    "L'analyse IA est temporairement indisponible. Réessayez dans quelques instants.",

  AI_INVALID_JSON:

    "L'IA n'a pas pu interpréter cette image. Essayez une autre photo plus nette.",

  AI_INVALID_SHAPE:

    "Réponse IA inattendue. Réessayez ou contactez le support.",

  MISSION_INVALID_STATE:

    "Cette action n'est pas possible pour l'état actuel de la mission.",

  MISSION_ALREADY_CONFIRMED:

    "Vous avez déjà validé cette intervention.",

  FORBIDDEN:

    "Vous n'avez pas l'autorisation pour cette action.",

  NOT_FOUND:

    "Mission introuvable ou endpoint backend non disponible.",

};



export function isBannedError(error: unknown): boolean {

  if (error instanceof ApiError) {

    return (

      error.code === "ACCOUNT_BANNED" ||

      error.status === 403 &&

        /suspendu|banni|banned/i.test(error.message)

    );

  }

  return false;

}



export function getErrorMessage(error: unknown, fallback: string): string {

  if (error instanceof ApiError) {

    if (error.code === "UNAUTHORIZED" && error.message.trim()) {
      const generic = /^(non authentifi|unauthorized|unauthenticated)$/i.test(
        error.message.trim(),
      );
      if (!generic) {
        return error.message;
      }
    }

    if (error.code && ERROR_MESSAGES[error.code]) {

      return ERROR_MESSAGES[error.code];

    }

    if (isBannedError(error)) return ERROR_MESSAGES.ACCOUNT_BANNED;

    return error.message;

  }

  if (error instanceof Error) return error.message;

  return fallback;

}



export function apiErrorJson(

  error: unknown,

  fallback: string,

  fallbackStatus = 500,

) {

  const message = error instanceof Error ? error.message : fallback;

  const status = error instanceof ApiError ? error.status : fallbackStatus;

  const code = error instanceof ApiError ? error.code : undefined;

  return { message, status, code };

}

