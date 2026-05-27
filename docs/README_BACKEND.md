# Nova Intervention — Guide développeur Backend

Ce document est la **référence unique** pour implémenter le backend Node.js afin que le frontend Next.js (`novaintervention`) soit **100 % fonctionnel** : demande client avec IA, dispatch géolocalisé, carte temps réel, notifications WebSocket, cycle de vie mission, dashboards, factures PDF et stockage Cloudinary.

Le frontend appelle déjà une API REST via un BFF Next.js (`/api/*` → `{API_URL}/api/v1`). Votre travail consiste à implémenter ce contrat **et** les extensions WebSocket / stats décrites ci-dessous.

---

## Table des matières

1. [Architecture](#1-architecture)
2. [Variables d'environnement](#2-variables-denvironnement)
3. [Modèle de données](#3-modèle-de-données)
4. [Cycle de vie d'une mission](#4-cycle-de-vie-dune-mission)
5. [Flux métier complets](#5-flux-métier-complets)
6. [API REST — Authentification](#6-api-rest--authentification)
7. [API REST — Profils & artisans](#7-api-rest--profils--artisans)
8. [API REST — Missions](#8-api-rest--missions)
9. [API REST — IA diagnostic photo](#9-api-rest--ia-diagnostic-photo)
10. [API REST — Uploads Cloudinary](#10-api-rest--uploads-cloudinary)
11. [API REST — Dashboards & facturation](#11-api-rest--dashboards--facturation)
12. [API REST — Admin](#12-api-rest--admin)
13. [WebSockets — Notifications & carte](#13-websockets--notifications--carte)
14. [Algorithme de dispatch géographique](#14-algorithme-de-dispatch-géographique)
15. [Règles de confidentialité des données](#15-règles-de-confidentialité-des-données)
16. [Sécurité & erreurs](#16-sécurité--erreurs)
17. [Correspondance avec le frontend](#17-correspondance-avec-le-frontend)
18. [Plan de livraison recommandé](#18-plan-de-livraison-recommandé)
19. [Checklist de tests](#19-checklist-de-tests)

---

## 1. Architecture

```mermaid
flowchart TB
  subgraph client [Navigateur]
    Next[Next.js Frontend]
  end
  subgraph bff [Next.js BFF]
    Routes["/api/auth, /api/missions, ..."]
  end
  subgraph backend [Backend Node.js]
    REST["REST /api/v1"]
    WS["WebSocket /ws"]
    PG[(PostgreSQL)]
    Redis[(Redis pub/sub)]
    CF[Cloudinary]
    OAI[OpenAI Vision]
  end
  Next --> Routes
  Routes -->|JWT cookie| REST
  Next -->|futur: connexion directe| WS
  REST --> PG
  REST --> CF
  REST --> OAI
  WS --> Redis
  Redis --> WS
```

| Composant | Rôle |
|-----------|------|
| **REST `/api/v1`** | CRUD, auth JWT, uploads, stats, PDF |
| **WebSocket `/ws`** | Notifications push, radar missions, suivi statut |
| **PostgreSQL + PostGIS** | Missions, profils, positions, historique |
| **Redis** | Pub/sub WebSocket, verrous « premier accepteur », sessions WS |
| **Cloudinary** | Photos avant/après, profils |
| **OpenAI GPT-4o Vision** | Diagnostic photo (peut rester sur Next au MVP, voir §9) |

**Stack suggérée :** Node 20+, Express ou Fastify, `socket.io` ou `ws`, Prisma ou Drizzle, `jsonwebtoken`, `bcrypt`, `@cloudinary/url-gen`, `pdfkit` ou `puppeteer` pour factures.

---

## 2. Variables d'environnement

```env
# Serveur
PORT=4000
NODE_ENV=development
API_BASE_URL=http://localhost:4000
CORS_ORIGIN=http://localhost:3000

# JWT
JWT_SECRET=change-me
JWT_ACCESS_EXPIRES=1h
JWT_REFRESH_EXPIRES=7d

# Base de données
DATABASE_URL=postgresql://user:pass@localhost:5432/nova

# Redis (WebSocket + locks)
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=nova/interventions

# OpenAI (si diagnostic côté backend)
OPENAI_API_KEY=

# Dispatch
MISSION_SEARCH_RADIUS_KM=25
MAX_ARTISANS_NOTIFIED=20
PLATFORM_COMMISSION_RATE=0.20

# Email (reset password)
SMTP_URL=
EMAIL_FROM=noreply@novaintervention.fr
```

Le frontend utilise `API_URL` / `NEXT_PUBLIC_API_URL` (voir `.env.example` à la racine du repo).

---

## 3. Modèle de données

### 3.1 Table `users`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID PK | |
| email | string unique | |
| password_hash | string | bcrypt |
| role | enum | `client`, `artisan`, `admin` |
| first_name, last_name, phone | string? | |
| city | string? | |
| availability | string? | `Disponible`, `Occupé`, `Indisponible` |
| settings | JSONB | `{ emailAlerts, smsAlerts, availability }` |
| created_at | timestamptz | |

### 3.2 Table `profiles` (extension métier — peut être fusionnée avec `users`)

Pour compatibilité frontend actuel, exposer un objet `profile` lié à `user.id` :

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID PK | = `users.id` |
| email | string | |
| role | enum | |
| first_name, last_name, phone, city | string? | |
| specialty | enum? | `plomberie`, `electricite`, … |
| is_verified | boolean | admin valide l'artisan |
| latitude, longitude | float? | position temps réel artisan |
| is_available | boolean | reçoit des offres |
| acceptance_rate_30d | float | stats |
| average_rating | float | |
| created_at | timestamptz | |

### 3.3 Table `missions`

| Colonne | Type | Notes |
|---------|------|-------|
| id | UUID PK | |
| title | string | ex. « emergency » humanisé |
| status | enum | voir §4 |
| customer_id | UUID FK users? | null si invité |
| artisan_id | UUID FK users? | null tant que pending |
| customer_name, customer_phone | string | |
| location | string | adresse texte |
| lat, lng | float | **obligatoire** pour dispatch |
| description | text | diagnostic IA + complément client |
| price | decimal | estimation max retenue |
| estimation_prix_min, estimation_prix_max | decimal? | |
| type_intervention | string | `services__emergency`, etc. |
| niveau_urgence | enum | `urgent`, `standard`, `planifiable` |
| pieces_recommandees | JSONB | string[] |
| duree_estimee_minutes | int? | |
| ai_confidence | float? | 0–1 |
| photo_url | string | Cloudinary — **avant** |
| photo_before | string | alias ou copie de photo_url |
| photo_after | string? | Cloudinary — **après** réparation |
| scheduled_at | timestamptz? | |
| accepted_at | timestamptz? | |
| started_at | timestamptz? | |
| completed_at | timestamptz? | |
| client_confirmed_at | timestamptz? | |
| artisan_confirmed_at | timestamptz? | |
| created_at, updated_at | timestamptz | |

### 3.4 Table `mission_events` (historique / audit)

| Colonne | Type |
|---------|------|
| id | UUID |
| mission_id | UUID |
| actor_id | UUID? |
| type | string | `created`, `offered`, `accepted`, `started`, `photo_after`, `client_confirmed`, `artisan_confirmed`, `completed`, `cancelled` |
| payload | JSONB |
| created_at | timestamptz |

### 3.5 Table `notifications`

| Colonne | Type |
|---------|------|
| id | UUID |
| user_id | UUID |
| type | string |
| title, body | string |
| mission_id | UUID? |
| read | boolean |
| created_at | timestamptz |

---

## 4. Cycle de vie d'une mission

```mermaid
stateDiagram-v2
  [*] --> pending: Client crée la demande
  pending --> confirmed: Artisan accepte (1er arrivé)
  confirmed --> in_progress: Artisan démarre intervention
  in_progress --> waiting_confirmation: Photo APRÈS uploadée
  waiting_confirmation --> completed: Client ET artisan confirment
  pending --> cancelled: Timeout / admin
  confirmed --> cancelled: Annulation
  waiting_confirmation --> completed: Les deux confirmations
```

| Statut | Signification | Visible client | Visible artisan |
|--------|---------------|----------------|-----------------|
| `pending` | En attente d'acceptation | Oui | Radar + offre (position approximative) |
| `confirmed` | Artisan assigné | Oui + notif | Adresse exacte + contact |
| `in_progress` | Sur place / en cours | Suivi | Mission active |
| `waiting_confirmation` | Photos avant/après, attente validation | Bloc « Validez vos travaux » | Attente confirmation client |
| `completed` | Clôturée | Historique + facture PDF | Revenus + historique |
| `cancelled` | Annulée | — | — |

**Règle critique — premier accepteur :**  
`POST /missions/:id/accept` doit être **atomique** (transaction SQL + verrou Redis `mission:{id}:accept`). Si `artisan_id` déjà renseigné → `409 MISSION_ALREADY_TAKEN`.

---

## 5. Flux métier complets

### 5.1 Parcours client (`/demander`)

Correspond au wizard frontend en 3 étapes : **Photo IA → Estimation → Coordonnées**.

```mermaid
sequenceDiagram
  participant C as Client
  participant F as Frontend Next
  participant B as Backend
  participant IA as OpenAI Vision
  participant CF as Cloudinary
  participant WS as WebSocket

  C->>F: Photo de la panne
  F->>B: POST /ai/analyze-photo (ou via Next /api/analyze-photo)
  B->>IA: Analyse image
  IA-->>B: type, urgence, prix min/max, confidence
  B-->>F: Bilan IA
  C->>F: Confirme + adresse + géoloc
  F->>B: POST /uploads/interventions (photo)
  B->>CF: Upload
  CF-->>B: URL publique
  F->>B: POST /missions (pending + lat/lng + IA)
  B->>B: Trouve artisans dans rayon
  B->>WS: mission.offer → artisans proches
  B->>WS: mission.created → client (optionnel)
  B-->>F: mission id
```

**Champs minimum à la création (`POST /missions`) :**

```json
{
  "title": "emergency",
  "status": "pending",
  "customer_name": "Jean Dupont",
  "customer_phone": "0612345678",
  "location": "12 rue de la Paix, 75002 Paris",
  "description": "Fuite sévère sous évier...",
  "price": 250,
  "photo_url": "https://res.cloudinary.com/.../before.jpg",
  "lat": 48.8698,
  "lng": 2.3314,
  "type_intervention": "services__emergency",
  "niveau_urgence": "urgent",
  "estimation_prix_min": 150,
  "estimation_prix_max": 250,
  "pieces_recommandees": ["Joint 40mm"],
  "duree_estimee_minutes": 45,
  "ai_confidence": 0.85
}
```

Si le client est connecté, renseigner `customer_id` depuis le JWT.

---

### 5.2 Dispatch artisans (carte « Radar Nova »)

Le composant `ArtisanMap` affiche les missions **pending** non assignées avec bouton **« Accepter l'intervention »**.

1. À la création, le backend calcule les artisans :
   - `role = artisan`
   - `is_verified = true` (recommandé)
   - `is_available = true`
   - distance(lat/lng mission, lat/lng artisan) ≤ `MISSION_SEARCH_RADIUS_KM`
   - filtre optionnel sur `specialty` vs `type_intervention`
2. Envoyer une notification WebSocket `mission.offer` à chacun (max `MAX_ARTISANS_NOTIFIED`).
3. Les artisans reçoivent la mission sur :
   - **REST** `GET /missions?status=pending&unassigned=true&near_lat=&near_lng=&radius_km=`
   - **WS** canal `radar` (mises à jour live)

**Payload `mission.offer` (WebSocket) :**

```json
{
  "event": "mission.offer",
  "mission": {
    "id": "uuid",
    "title": "Dépannage urgence",
    "status": "pending",
    "price": 250,
    "niveau_urgence": "urgent",
    "distance_km": 3.2,
    "location_approx": "75002 Paris",
    "lat": 48.8698,
    "lng": 2.3314,
    "photo_url": "https://...",
    "created_at": "2026-05-21T10:00:00Z"
  }
}
```

> **Confidentialité :** tant que `status === pending`, ne pas exposer `customer_phone` ni l'adresse complète — uniquement zone approximative (arrondissement / rayon).

---

### 5.3 Acceptation (premier arrivé, premier servi)

```http
POST /api/v1/missions/:id/accept
Authorization: Bearer <token_artisan>
```

**Réponse 200 :**

```json
{
  "mission": {
    "id": "uuid",
    "status": "confirmed",
    "artisan_id": "uuid-artisan",
    "customer_name": "Jean Dupont",
    "customer_phone": "0612345678",
    "location": "12 rue de la Paix, 75002 Paris",
    "lat": 48.8698,
    "lng": 2.3314,
    "photo_url": "...",
    "description": "..."
  }
}
```

**Effets serveur :**

1. Transaction : `UPDATE missions SET artisan_id=?, status='confirmed', accepted_at=NOW() WHERE id=? AND artisan_id IS NULL`
2. Si 0 ligne mise à jour → `409` + code `MISSION_ALREADY_TAKEN`
3. WS `mission.accepted` → **client** (artisan assigné, ETA optionnel)
4. WS `mission.removed` → **autres artisans** (retirer du radar)
5. Notification persistante en base pour le client

---

### 5.4 Intervention sur site

```http
POST /api/v1/missions/:id/start
Authorization: Bearer <artisan>
```

→ `status = in_progress`, `started_at = now()`  
→ WS `mission.status.changed`

Optionnel : l'artisan envoie sa position en temps réel :

```http
PATCH /api/v1/artisans/me/location
{ "latitude": 48.87, "longitude": 2.33 }
```

→ WS vers le client `mission.artisan.location` (carte suivi).

---

### 5.5 Fin de travaux — photo APRÈS

```http
POST /api/v1/missions/:id/complete-work
Authorization: Bearer <artisan>
Content-Type: multipart/form-data
```

Body : `file` (photo réparation) → upload Cloudinary →  

```json
{
  "photo_after": "https://res.cloudinary.com/.../after.jpg"
}
```

→ `status = waiting_confirmation`  
→ WS + notification **client** : « Validez vos travaux » (écran déjà prévu dans `ClientView`)

---

### 5.6 Double confirmation client + artisan

Le frontend client appelle déjà :

```json
PATCH /missions/:id
{ "status": "completed", "completed_at": "..." }
```

**À implémenter côté backend :**

| Endpoint | Acteur | Effet |
|----------|--------|-------|
| `POST /missions/:id/confirm-client` | Client | `client_confirmed_at = now()` |
| `POST /missions/:id/confirm-artisan` | Artisan | `artisan_confirmed_at = now()` |

Quand **les deux** timestamps sont renseignés :

- `status = completed`
- `completed_at = now()`
- Calcul commission plateforme (20 %)
- WS `mission.completed` des deux côtés
- Notification + mission disponible pour **facture PDF**

---

## 6. API REST — Authentification

Base : `/api/v1`  
Headers : `Authorization: Bearer <accessToken>` (le BFF Next lit le cookie `nova_access_token`).

| Méthode | Route | Body | Réponse |
|---------|-------|------|---------|
| POST | `/auth/register` | `{ email, password, first_name, last_name, phone, role? }` | `201` + message ou tokens |
| POST | `/auth/login` | `{ email, password }` | `{ accessToken, refreshToken?, user }` |
| POST | `/auth/logout` | — | `204` |
| GET | `/auth/me` | — | `{ user, profile }` |
| POST | `/auth/forgot-password` | `{ email }` | `{ message }` + email lien `?token=` |
| POST | `/auth/reset-password` | `{ password, token? }` | `{ message }` |
| PATCH | `/auth/password` | `{ password }` | `{ message }` (connecté) |
| POST | `/auth/refresh` | `{ refreshToken }` | nouveaux tokens |

### Objet `user` (camelCase — attendu par le frontend)

```json
{
  "id": "uuid",
  "email": "client@mail.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "0612345678",
  "role": "client",
  "city": "Paris",
  "availability": "Disponible",
  "settings": {
    "emailAlerts": true,
    "smsAlerts": false,
    "availability": "Disponible"
  }
}
```

### Objet `profile` (snake_case — attendu par le frontend)

```json
{
  "id": "uuid",
  "email": "client@mail.com",
  "first_name": "Jean",
  "last_name": "Dupont",
  "phone": "0612345678",
  "role": "client",
  "city": "Paris",
  "specialty": "plomberie",
  "is_verified": false,
  "created_at": "2026-01-01T00:00:00Z"
}
```

---

## 7. API REST — Profils & artisans

| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| GET | `/profiles/me` | tous | Profil connecté |
| PATCH | `/profiles/me` | tous | Mise à jour (nom, téléphone, ville, settings, dispo) |
| PATCH | `/artisans/me/location` | artisan | `{ latitude, longitude }` — tracking carte |
| PATCH | `/artisans/me/availability` | artisan | `{ is_available, availability }` |
| GET | `/profiles` | admin | Liste tous les profils |
| PATCH | `/profiles/:id/verification` | admin | `{ is_verified: true/false }` |

**Inscription artisan** : page `/devenir-partenaire` — prévoir `POST /auth/register` avec `role: "artisan"` + `specialty`, statut `is_verified: false` jusqu'à validation admin.

---

## 8. API REST — Missions

| Méthode | Route | Query / Body | Rôle |
|---------|-------|--------------|------|
| GET | `/missions` | Voir ci-dessous | filtré par rôle |
| GET | `/missions/:id` | — | participant ou admin |
| POST | `/missions` | corps création §5.1 | client / public |
| PATCH | `/missions/:id` | mise à jour partielle | selon statut |
| POST | `/missions/:id/accept` | — | artisan |
| POST | `/missions/:id/start` | — | artisan assigné |
| POST | `/missions/:id/complete-work` | multipart `file` | artisan — photo après |
| POST | `/missions/:id/confirm-client` | — | client |
| POST | `/missions/:id/confirm-artisan` | — | artisan |
| POST | `/missions/:id/cancel` | `{ reason? }` | client / artisan / admin |

### Query `GET /missions`

| Paramètre | Usage |
|-----------|--------|
| `customer_id` | Dashboard client — historique |
| `artisan_id` | Missions de l'artisan |
| `status` | `pending`, `confirmed`, … |
| `unassigned=true` | Missions sans artisan (radar) |
| `near_lat`, `near_lng`, `radius_km` | Radar géographique |
| `from`, `to` | Filtre dates (historique) |

**Réponse :** tableau de `Mission` (+ relation `artisan` optionnelle) :

```json
{
  "id": "uuid",
  "title": "Fuite cuisine",
  "status": "waiting_confirmation",
  "customer_id": "uuid",
  "artisan_id": "uuid",
  "customer_name": "Jean Dupont",
  "customer_phone": "0612345678",
  "location": "12 rue de la Paix",
  "description": "...",
  "price": 250,
  "photo_url": "https://...",
  "photo_before": "https://...",
  "photo_after": "https://...",
  "lat": 48.87,
  "lng": 2.33,
  "scheduled_at": null,
  "created_at": "...",
  "completed_at": null,
  "artisan": {
    "first_name": "Marc",
    "last_name": "Plombier"
  }
}
```

---

## 9. API REST — IA diagnostic photo

Aujourd'hui le frontend appelle `POST /api/analyze-photo` (Next.js, mock 3s). **Recommandation production :** déplacer vers le backend.

```http
POST /api/v1/ai/analyze-photo
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..." 
}
```

**Réponse (identique à `types/api.types.ts`) :**

```json
{
  "type_intervention": "services__emergency",
  "description_probleme": "Fuite sévère probable...",
  "niveau_urgence": "urgent",
  "estimation_prix_min": 150,
  "estimation_prix_max": 250,
  "pieces_recommandees": ["Joint 40mm", "Flexible"],
  "duree_estimee_minutes": 45,
  "confidence": 0.85
}
```

**Règle métier frontend :** si `confidence < 0.6`, le client doit saisir une description complémentaire (`extraDesc`) avant de continuer.

Prompt OpenAI suggéré : plomberie/chauffage/dépannage, sortie JSON stricte, prix en EUR HT, enum `type_intervention` aligné sur les slugs du site (`services__emergency`, `services__residential`, etc.).

---

## 10. API REST — Uploads Cloudinary

```http
POST /api/v1/uploads/interventions
Content-Type: multipart/form-data
Champ: file
```

**Réponse :**

```json
{
  "url": "https://res.cloudinary.com/<cloud>/image/upload/v123/nova/interventions/abc.jpg",
  "public_id": "nova/interventions/abc",
  "width": 1920,
  "height": 1080
}
```

**Bonnes pratiques :**

- Dossier `nova/interventions/{missionId}/before|after`
- Transformation auto : max 1920px, qualité 80 %
- Types MIME autorisés : `image/jpeg`, `image/png`, `image/webp`
- Taille max : 10 Mo
- Ne jamais stocker de fichiers en local en production

Routes associées déjà proxyfiées par le BFF : `POST /api/uploads/interventions` → backend.

---

## 11. API REST — Dashboards & facturation

### 11.1 Stats artisan

Le dashboard artisan (`ArtisanView`, `/dashboard`, `/dashboard/missions`, `/dashboard/planning`) attend des agrégats.

```http
GET /api/v1/artisans/me/stats?period=month
Authorization: Bearer <artisan>
```

**Réponse :**

```json
{
  "totalRevenue": 9120,
  "monthlyRevenue": 3450,
  "weeklyMissionsCount": 8,
  "activeClients": 24,
  "retentionRate": 0.72,
  "recentMissions": [ /* Mission[] max 5 */ ],
  "confirmedMissions": [ /* Mission[] */ ],
  "availableMissions": [ /* Mission[] pending à proximité */ ],
  "charts": {
    "weeklyClients": [4, 5, 7, 6, 8, 9, 8],
    "monthlyRevenue": [500, 600, 720, 800, 900, 950, 1100],
    "last6Months": [62, 70, 74, 82, 88, 96]
  }
}
```

Le frontend calcule déjà une partie en server component (`buildArtisanStats`) — centraliser côté backend simplifie la cohérence.

### 11.2 Stats client

```http
GET /api/v1/clients/me/stats
```

```json
{
  "historyCount": 12,
  "activeCount": 2,
  "documentsCount": 10,
  "totalSpent": 2840,
  "recentMissions": [ /* Mission[] */ ]
}
```

### 11.3 Historique & dépenses

```http
GET /api/v1/clients/me/expenses?from=2026-01-01&to=2026-12-31
GET /api/v1/artisans/me/revenue?from=...&to=...
```

```json
{
  "items": [
    {
      "mission_id": "uuid",
      "title": "Fuite cuisine",
      "amount": 250,
      "status": "completed",
      "date": "2026-05-21",
      "invoice_url": "/api/v1/missions/uuid/invoice.pdf"
    }
  ],
  "total": 2840,
  "currency": "EUR"
}
```

### 11.4 Facture PDF

Le frontend génère aujourd'hui un PDF **côté client** (`lib/pdf/invoice-generator.ts`). Pour production :

```http
GET /api/v1/missions/:id/invoice.pdf
Authorization: Bearer <client | artisan | admin>
```

- Contenu : en-tête Nova, n° facture `FA-{missionId}`, client, description, montant TTC, statut paiement, mentions légales
- Content-Type : `application/pdf`
- Stockage optionnel : Cloudinary `raw` ou S3

Le bouton `DownloadInvoiceButton` pourra pointer vers cette URL (évolution frontend).

---

## 12. API REST — Admin

Tour de contrôle (`AdminView`) :

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/admin/overview` | Totaux missions, artisans, volume, commission 20 % |
| GET | `/profiles?role=artisan` | Liste artisans |
| PATCH | `/profiles/:id/verification` | Valider / révoquer |
| GET | `/missions` | Toutes missions (pagination) |
| GET | `/admin/activity` | Flux récent (mission_events) |

**Exemple `/admin/overview` :**

```json
{
  "totalMissions": 156,
  "artisanCount": 42,
  "totalVolume": 45600,
  "platformCommission": 9120,
  "pendingVerifications": 5
}
```

---

## 13. WebSockets — Notifications & carte

### 13.1 Connexion

```
ws://localhost:4000/ws?token=<JWT>
```

Ou Socket.IO : `io(API_URL, { auth: { token } })`.

À la connexion :

1. Vérifier JWT
2. Joindre les rooms :
   - `user:{userId}` — notifications personnelles
   - `role:artisan` — broadcast système (optionnel)
   - `radar:{geohash}` — pour artisans (missions proches)
   - `mission:{missionId}` — si mission active

### 13.2 Événements serveur → client

| Event | Destinataires | Payload clé |
|-------|---------------|-------------|
| `notification` | `user:{id}` | `{ id, type, title, body, mission_id, created_at }` |
| `mission.offer` | artisans proches | mission résumée §5.2 |
| `mission.removed` | artisans (sauf gagnant) | `{ mission_id }` |
| `mission.accepted` | client | `{ mission, artisan: { name, phone, rating } }` |
| `mission.status.changed` | client + artisan | `{ mission_id, status }` |
| `mission.artisan.location` | client | `{ mission_id, lat, lng, eta_minutes? }` |
| `mission.work_completed` | client | `{ mission_id, photo_after }` — attente validation |
| `mission.completed` | client + artisan | `{ mission_id, final_price }` |

### 13.3 Événements client → serveur

| Event | Émetteur | Action |
|-------|----------|--------|
| `radar.subscribe` | artisan | `{ latitude, longitude, radius_km }` — rejoindre geohash |
| `radar.unsubscribe` | artisan | quitter room |
| `mission.subscribe` | client/artisan | suivre une mission |
| `location.update` | artisan | mettre à jour position (alternative au REST) |

### 13.4 Notifications in-app (persistance)

Même si WS déconnecté, le client doit pouvoir :

```http
GET /api/v1/notifications
PATCH /api/v1/notifications/:id/read
POST /api/v1/notifications/read-all
```

Types suggérés :

- `MISSION_OFFER` (artisan)
- `MISSION_ACCEPTED` (client)
- `MISSION_STARTED` (client)
- `MISSION_WAITING_CONFIRMATION` (client)
- `MISSION_COMPLETED` (les deux)
- `PROFILE_VERIFIED` (artisan)

---

## 14. Algorithme de dispatch géographique

Pseudo-code à l' création de mission :

```text
1. Lire (lat, lng) de la mission — refuser si absent
2. SELECT artisans WHERE role='artisan' AND is_verified AND is_available
3. Calculer distance Haversine ou PostGIS ST_DWithin
4. Filtrer specialty compatible (mapping type_intervention → specialty)
5. Trier par distance ASC, rating DESC
6. Prendre les N premiers (MAX_ARTISANS_NOTIFIED)
7. Pour chaque artisan : INSERT notification + WS mission.offer
8. Enregistrer mission_event type='offered' avec liste artisan_ids
```

**PostGIS (recommandé) :**

```sql
SELECT id, ST_Distance(location, ST_MakePoint(:lng, :lat)::geography) AS distance
FROM profiles
WHERE is_available = true AND is_verified = true
ORDER BY distance
LIMIT 20;
```

---

## 15. Règles de confidentialité des données

| Donnée | `pending` (radar) | `confirmed`+ |
|--------|-------------------|------------|
| Position exacte client | Floutée (~500m) ou arrondie | Exacte |
| `customer_phone` | Masqué | Visible artisan assigné |
| `customer_name` | Prénom ou « Client Nova » | Complet |
| Photo avant | Visible (pour diagnostic) | Visible |

---

## 16. Sécurité & erreurs

### Format d'erreur

```json
{
  "message": "Description lisible en français",
  "code": "MISSION_ALREADY_TAKEN"
}
```

### Codes HTTP

| Code | Usage |
|------|-------|
| 400 | Validation |
| 401 | Non authentifié |
| 403 | Rôle insuffisant |
| 404 | Ressource absente |
| 409 | Conflit (mission déjà prise) |
| 422 | Règle métier (mauvais statut) |
| 500 | Erreur serveur |

### Codes métier

| Code | Description |
|------|-------------|
| `MISSION_ALREADY_TAKEN` | Un autre artisan a accepté |
| `INVALID_STATUS_TRANSITION` | Action impossible dans cet état |
| `ARTISAN_NOT_VERIFIED` | Artisan non validé par admin |
| `LOCATION_REQUIRED` | lat/lng manquants |
| `AI_LOW_CONFIDENCE` | Description client requise |

---

## 17. Correspondance avec le frontend

### Routes BFF Next.js existantes (proxy vers votre API)

| BFF Next | Backend cible |
|----------|---------------|
| `POST /api/auth/login` | `POST /api/v1/auth/login` |
| `POST /api/auth/register` | `POST /api/v1/auth/register` |
| `POST /api/auth/logout` | `POST /api/v1/auth/logout` |
| `GET /api/auth/me` | `GET /api/v1/auth/me` |
| `GET/POST /api/missions` | `GET/POST /api/v1/missions` |
| `PATCH /api/missions/[id]` | `PATCH /api/v1/missions/:id` |
| `GET/PATCH /api/profiles/me` | `/api/v1/profiles/me` |
| `POST /api/uploads/interventions` | `/api/v1/uploads/interventions` |

### Pages à alimenter

| Page / composant | Besoins backend |
|------------------|-----------------|
| `/demander` | IA + upload + `POST /missions` + dispatch WS |
| `/dashboard` (client) | missions, stats, confirmation travaux |
| `/dashboard` (artisan) | stats, radar, `availableMissions` |
| `/dashboard/requests` | `GET /missions?customer_id=` |
| `/dashboard/missions` | `GET /missions?artisan_id=` |
| `/dashboard/planning` | missions avec `scheduled_at` |
| `ArtisanMap` | missions pending + lat/lng réels + `POST accept` |
| `ClientView` | `waiting_confirmation`, photos avant/après |
| `AdminView` | profiles, missions, vérification |
| `DownloadInvoiceButton` | `GET /missions/:id/invoice.pdf` (à brancher) |

### Évolutions frontend prévues (après votre API)

1. Connexion WebSocket dans `ArtisanMap` et header notifications
2. Remplacer stats mockées dans `ArtisanView` par `GET /artisans/me/stats`
3. Facture : lien vers PDF backend
4. Déplacer `analyze-photo` vers backend si souhaité

---

## 18. Plan de livraison recommandé

| Phase | Livrable | Priorité |
|-------|----------|----------|
| **P0** | Auth JWT, profiles, Cloudinary upload, CRUD missions basique | Bloquant |
| **P1** | Machine à états complète + accept atomique + dispatch géo | Bloquant |
| **P1** | WebSocket `mission.offer`, `mission.accepted`, `notification` | Bloquant |
| **P2** | IA analyze-photo backend, double confirmation, photo after | Haute |
| **P2** | Stats dashboards + historique dépenses | Haute |
| **P3** | PDF factures serveur, tracking position artisan | Moyenne |
| **P3** | Admin overview, emails reset password | Moyenne |

---

## 19. Checklist de tests

- [ ] Client anonyme ou connecté crée une mission avec photo + géoloc
- [ ] Diagnostic IA retourne prix min/max et confidence
- [ ] Au moins 2 artisans proches reçoivent `mission.offer` en WS
- [ ] Premier `accept` gagne, second reçoit `409`
- [ ] Client reçoit notification + voit artisan assigné
- [ ] Artisan voit adresse exacte et téléphone après acceptation
- [ ] Artisan upload photo après → statut `waiting_confirmation`
- [ ] Client voit avant/après et confirme
- [ ] Artisan confirme → statut `completed`
- [ ] Client télécharge facture PDF
- [ ] Dashboard artisan : revenus et liste missions cohérents
- [ ] Dashboard client : historique et dépenses
- [ ] Admin valide un artisan → il reçoit des offres
- [ ] Upload Cloudinary : URLs valides, pas de fuite entre missions

---

## Référence rapide

- Contrat minimal déjà utilisé par le BFF : [`API_BACKEND.md`](./API_BACKEND.md)
- Types frontend : [`types/domain.ts`](../types/domain.ts), [`types/api.types.ts`](../types/api.types.ts)
- Flux demande : [`app/demander/page.tsx`](../app/demander/page.tsx)
- Cycle validation client : [`components/dashboard/ClientView.tsx`](../components/dashboard/ClientView.tsx)
- Carte artisan : [`components/dashboard/ArtisanMap.tsx`](../components/dashboard/ArtisanMap.tsx)

Pour toute question sur le contrat actuel du proxy Next.js, inspecter le dossier [`app/api/`](../app/api/) et [`services/api/`](../services/api/).

---

*Document généré pour l'équipe backend Nova Intervention — à maintenir à jour lors de l'ajout d'endpoints.*
