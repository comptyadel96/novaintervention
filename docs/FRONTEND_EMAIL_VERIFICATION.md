# Vérification d'email (frontend)

Aligné sur le backend `nova-backend/docs/FRONTEND_EMAIL_VERIFICATION.md`.

## Pages

| Route | Rôle |
|-------|------|
| `/verify-email?token=` | Par défaut : formulaire mot de passe + confirmation email. `?auto=1` : confirmation seule (inscription classique). |
| Dashboard | Bannière + « Renvoyer l'email » si `user.emailVerified === false` |
| `/demander` | Parcours invité sans vérification email préalable |

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

Le backend utilise `FRONTEND_URL` pour générer le lien :

- **Compte invité (demande `/demander`)** : `…/verify-email?token={uuid}` — le front affiche le formulaire mot de passe.
- **Inscription `/register`** : `…/verify-email?token={uuid}&auto=1` — confirmation email seule (mot de passe déjà choisi).
