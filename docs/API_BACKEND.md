# Contrat API REST (référence courte)

> **Documentation complète pour le développeur backend :** voir **[README_BACKEND.md](./README_BACKEND.md)**  
> (flux métier, WebSockets, Cloudinary, dispatch géo, dashboards, PDF, checklist).

## Base

- URL : `{API_URL}/api/v1`
- Auth : `Authorization: Bearer <accessToken>`
- Erreurs : `{ "message": "...", "code": "OPTIONAL" }`

## Endpoints implémentés par le BFF Next.js aujourd'hui

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/login` | Connexion |
| POST | `/auth/register` | Inscription |
| POST | `/auth/logout` | Déconnexion |
| GET | `/auth/me` | Session `{ user, profile }` — `user.emailVerified` |
| POST | `/auth/verify-email` | `{ token }` — page `/verify-email` |
| POST | `/auth/resend-verification` | Renvoyer l'email (connecté) |
| GET | `/auth/google/status` | `{ enabled, clientId? }` — afficher bouton Google |
| POST | `/auth/google` | `{ idToken, role?: "client" }` — connexion / inscription Google |
| POST | `/auth/google/link` | Bearer + `{ idToken }` — lier Google au compte |
| POST | `/auth/sms/send-code` | `{ phone }` — envoi OTP |
| POST | `/auth/sms/verify` | `{ phone, code, role?, firstName?, lastName?, email? }` |
| POST | `/auth/sms/link-phone` | Bearer + `{ phone, code }` — page `/verify-phone` |
| POST | `/auth/forgot-password` | Email reset |
| POST | `/auth/reset-password` | Nouveau mot de passe |
| PATCH | `/auth/password` | Changer mot de passe |
| GET | `/profiles/me` | Profil |
| PATCH | `/profiles/me` | Mise à jour profil |
| GET | `/profiles` | Liste (admin) |
| PATCH | `/profiles/:id/verification` | Vérification artisan |
| GET | `/missions` | Liste filtrée |
| POST | `/missions` | Création demande |
| PATCH | `/missions/:id` | Mise à jour |
| POST | `/uploads/interventions` | Upload photo (Cloudinary) |

## Statuts mission

`pending` → `confirmed` → `in_progress` → `waiting_confirmation` → `completed` | `cancelled`

## Erreurs courantes (codes API)

| code | Action front |
|------|----------------|
| `EMAIL_NOT_VERIFIED` | Bannière dashboard + bloquer création mission |
| `DATABASE_UNAVAILABLE` | Toast + retry |
| `UNAUTHORIZED` | Refresh token ou redirect `/login` |
| `FORBIDDEN` | Artisan non vérifié |
| `CLOUDINARY_NOT_CONFIGURED` | Message admin |

## Extensions requises (voir README_BACKEND)

- `POST /missions/:id/accept` — premier accepteur
- `POST /missions/:id/complete-work` — photo après
- `POST /missions/:id/confirm-client` / `confirm-artisan`
- `GET /artisans/me/stats`, `GET /clients/me/stats`
- `GET /missions/:id/invoice.pdf`
- WebSocket `ws://.../ws` — `mission.offer`, notifications, carte
- `POST /ai/analyze-photo` — diagnostic IA
