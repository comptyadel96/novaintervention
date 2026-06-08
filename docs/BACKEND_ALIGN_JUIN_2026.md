# Alignement front ↔ backend (juin 2026)

Référence équipe Next.js après MAJ `nova-backend`.  
Docs détaillées : `GUEST_REQUEST_BACKEND.md`, `MISSION_CONFIRM_BACKEND.md`, `AI_PHOTO_ANALYSIS.md`, `PARTNER_AND_PROFILE_BACKEND.md`.

---

## Checklist front (état repo)

### Partenaire `/devenir-partenaire`

- [x] Champs `email` + `password` (min 8)
- [x] Message succès : compte créé + vérifier email
- [x] Pas d'auto-login après candidature
- [x] Erreur `CONFLICT` mappée

### Stats artisan

- [x] Graphique `GET /artisans/me/accounting?period=…`
- [x] État vide si `items: []`
- [x] `pendingRevenue` depuis `/artisans/me/stats` sous le graphique
- [x] Périodes Jour / Semaine / Mois / Année

### Demande `/demander`

- [x] Fallback IA (`meta.source` ≠ `openai`) — bandeau indicatif
- [x] Parcours texte (`/ai/analyze-text`) + « Continuer sans photo »
- [x] `POST /missions` sans photo (`creationMode: text_manual`)
- [x] Parcours invité (email, GPS, pas de login préalable)
- [x] `verificationEmailSent` dans réponse `201`
- [x] `/verify-email` : formulaire mot de passe par défaut (`setup=1` supporté)

### Artisan — missions

- [x] `assignedOnly=true` onglet Missions (plus `unassigned` seul)
- [x] Carte missions : charge les missions assignées actives
- [x] `POST /missions/:id/en-route` → toast si `clientNotified`
- [x] Badge « En route » si `enRouteAt` / `en_route_at`

### Client — confirmation

- [x] `POST /missions/:id/confirm-client` via BFF
- [x] Messages d'erreur backend affichés (plus alerte générique seule)

---

## Endpoints clés

| Front BFF | Backend |
|-----------|---------|
| `POST /api/partner-applications` | `POST /partner-applications` |
| `GET /api/artisans/me/accounting` | `GET /artisans/me/accounting` |
| `GET /api/artisans/me/stats` | `GET /artisans/me/stats` |
| `POST /api/ai/analyze-photo` | public, fallback 200 |
| `POST /api/ai/analyze-text` | public |
| `POST /api/missions` | public invité + auth client |
| `GET /api/missions?assigned_only=true` | `assignedOnly=true` |
| `POST /api/missions/:id/en-route` | notification client |
| `POST /api/missions/:id/confirm-client` | double confirmation |

---

## Parcours invité — email activation

Lien backend :

```
https://novaintervention.com/verify-email?token={uuid}&setup=1
```

Front : formulaire mot de passe même sans `setup=1` (lien simple `?token=` OK).

`POST /auth/verify-email` : `{ token, password }`.

---

## Migration serveur (backend)

```bash
docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy
docker compose -f docker-compose.prod.yml up -d --build
```

Migrations : `20260604120000_partner_application_account`, `20260608120000_guest_mission_flow`.

---

Questions : joindre requête Network (URL + status + body) à l'équipe backend.
