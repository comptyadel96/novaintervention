# Vérification d'email (frontend)

Aligné sur le backend `nova-backend/docs/FRONTEND_EMAIL_VERIFICATION.md`.

## Pages

| Route | Rôle |
|-------|------|
| `/verify-email?token=` | `POST /api/auth/verify-email` → BFF → backend |
| Dashboard | Bannière + « Renvoyer l'email » si `user.emailVerified === false` |
| `/demander` | Bouton de soumission désactivé tant que l'email n'est pas vérifié |

## Session

Le champ `user.emailVerified` est mappé depuis l'API (`lib/api/mappers.ts`) sur login, register et `GET /auth/me`.

## Erreur API

Code `EMAIL_NOT_VERIFIED` (403) : message utilisateur via `getErrorMessage()` dans `lib/api/errors.ts`.

## Variables d'environnement

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# alias accepté :
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Le backend utilise `FRONTEND_URL` pour générer le lien `…/verify-email?token=`.
