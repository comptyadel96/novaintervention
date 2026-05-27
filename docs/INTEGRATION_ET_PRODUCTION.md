# Intégration frontend + préparation production

Guide pour faire tourner **novaintervention** (Next.js) avec **nova-backend** (Node.js), tester le parcours complet, et passer en production (SMTP SendGrid, Cloudinary, etc.).

---

## 1. Démarrage local (test intégral)

### Terminal 1 — Backend

```bash
cd nova-backend
docker compose up -d
cp .env.example .env
npm install
npm run db:migrate
npm run dev
# → http://localhost:4000
# → GET http://localhost:4000/api/v1/health
```

### Terminal 2 — Frontend

```bash
cd novaintervention
cp .env.example .env.local
npm install
npm run dev
# → http://localhost:3000
```

### `.env.local` (frontend)

```env
API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# alias accepté par le front :
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=   # carte / géocodage (optionnel en local)
```

> **Important :** l’URL doit se terminer par `/api/v1` (pas seulement `:4000`).

### CORS backend

```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## 2. Scénario E2E (2 navigateurs)

| Étape | Client | Artisan |
|-------|--------|---------|
| 1 | `/register` → compte client | `/register` rôle artisan (ou SQL) |
| 2 | — | Admin valide l’artisan (`verification_status = approved`) |
| 3 | — | `/dashboard/profile` : renseigner GPS (Paris 48.8566, 2.3522) |
| 4 | `/demander` : photo → IA → adresse + **géoloc** → envoi | — |
| 5 | — | Radar carte + notif → **Accepter** |
| 6 | Notif « artisan assigné » | `start` → intervention |
| 7 | — | Upload photo après + `complete-work` |
| 8 | **Valider travaux** (écran orange) | `confirm-artisan` |
| 9 | Facture PDF | Stats / historique |

### Comptes de test suggérés

- `client@test.com` / `password123`
- `artisan@test.com` / `password123` (vérifié + GPS proche du client)

Sans SMTP, les emails reset apparaissent dans la **console backend** (`[email:dev]`).

---

## 3. Ce que le frontend fait déjà (BFF)

| Fonctionnalité | Route BFF Next | Backend |
|----------------|----------------|---------|
| Login / register / logout | `/api/auth/*` | `/auth/*` |
| Refresh JWT (15 min) | `/api/auth/refresh` | `/auth/refresh` |
| Session | cookie `nova_access_token` + `nova_refresh_token` | — |
| Missions CRUD + accept/start/confirm | `/api/missions/*` | `/missions/*` |
| Facture PDF | `/api/missions/:id/invoice` | `/missions/:id/invoice.pdf` |
| Upload photo | `/api/uploads/interventions` | + Cloudinary |
| IA photo | `/api/ai/analyze-photo` | `/ai/analyze-photo` (mock si absent) |
| Notifications REST | `/api/notifications/*` | `/notifications/*` |
| WebSocket token | `/api/auth/ws-token` | `ws://.../ws?token=` |
| Carte artisan | `ArtisanMap` + WS `mission.offer` | dispatch géo |

Sur **401**, le client appelle automatiquement `/api/auth/refresh` puis réessaie.

---

## 4. Préparation production

### 4.1 Hébergement

| Service | Rôle |
|---------|------|
| **Vercel** (ou similaire) | Frontend Next.js |
| **Railway / Render / VPS** | Backend Node + WebSocket |
| **Neon / Supabase / RDS** | PostgreSQL |
| **Upstash** | Redis (WS + locks) |
| **Cloudinary** | Photos |
| **SendGrid** (ou Brevo, Mailgun) | Emails transactionnels |

### 4.2 Variables frontend (production)

```env
API_URL=https://api.votredomaine.fr/api/v1
NEXT_PUBLIC_API_URL=https://api.votredomaine.fr/api/v1
NEXT_PUBLIC_WS_URL=wss://api.votredomaine.fr/ws
NEXT_PUBLIC_APP_URL=https://www.votredomaine.fr
NODE_ENV=production
```

Cookies auth : `secure: true` est déjà activé si `NODE_ENV=production`.

### 4.3 Variables backend (production)

```env
NODE_ENV=production
FRONTEND_URL=https://www.votredomaine.fr
CORS_ORIGINS=https://www.votredomaine.fr

JWT_SECRET=<secret-long-aleatoire>

DATABASE_URL=postgresql://...
REDIS_URL=redis://...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

OPENAI_API_KEY=sk-...

# SendGrid SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<SENDGRID_API_KEY>
SMTP_FROM=noreply@votredomaine.fr
```

### 4.4 SendGrid (mot de passe oublié + bienvenue)

1. Créer un compte [SendGrid](https://sendgrid.com)
2. **Settings → API Keys** → créer une clé « Mail Send »
3. **Settings → Sender Authentication** → vérifier votre domaine ou un expéditeur unique
4. Backend `.env` :

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxx
SMTP_FROM=noreply@votredomaine.fr
FRONTEND_URL=https://www.votredomaine.fr
```

Le lien envoyé doit être :  
`https://www.votredomaine.fr/reset-password?token=<uuid>`

La page Next `/reset-password` est déjà branchée.

**Alternative :** Brevo (`smtp-relay.brevo.com`), Mailtrap (staging), Amazon SES.

### 4.5 Cloudinary

1. Dashboard Cloudinary → **API Keys**
2. Backend :

```env
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

Sans ces variables : `503 CLOUDINARY_NOT_CONFIGURED` à l’upload.

### 4.6 WebSocket en production

- Utiliser **`wss://`** derrière un reverse proxy (Nginx / Caddy) qui supporte l’upgrade WebSocket
- Exemple Nginx :

```nginx
location /ws {
  proxy_pass http://127.0.0.1:4000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
}
```

---

## 5. Authentification par téléphone ?

**État actuel du contrat backend fourni :** authentification par **email + mot de passe** uniquement. Le **téléphone** est un champ de profil (`phone`) utilisé pour le contact mission, pas pour OTP/SMS login.

Pour ajouter plus tard :

| Option | Côté backend | Côté frontend |
|--------|--------------|---------------|
| SMS OTP (Twilio, Vonage) | `POST /auth/phone/send-code`, `POST /auth/phone/verify` | Écrans login téléphone |
| Firebase Auth | Middleware Firebase → JWT Nova | SDK Firebase |

**Recommandation MVP :** garder email/password + téléphone obligatoire à l’inscription (déjà le cas sur `/register`).

---

## 6. Checklist avant mise en prod

### Backend

- [ ] `GET /api/v1/health` OK
- [ ] Migrations DB appliquées
- [ ] Cloudinary configuré
- [ ] SMTP SendGrid testé (forgot-password)
- [ ] `FRONTEND_URL` correct
- [ ] CORS origines production
- [ ] WebSocket `wss` accessible
- [ ] Artisan test `verification_status = approved`

### Frontend

- [ ] `.env.local` / variables Vercel avec `/api/v1`
- [ ] Build `npm run build` OK
- [ ] Parcours `/demander` avec géoloc
- [ ] Refresh token après 15 min (rester connecté)
- [ ] Notifications cloche + WS
- [ ] PDF facture téléchargeable
- [ ] Reset password depuis email réel

---

## 7. Dépannage

| Symptôme | Cause probable | Action |
|----------|----------------|--------|
| `fetch failed` / CORS | Backend arrêté ou CORS | Démarrer backend, vérifier `CORS_ORIGINS` |
| 401 après 15 min | Token expiré | Vérifier `/api/auth/refresh` + cookie refresh |
| Pas d’offres artisan | Non vérifié / pas de GPS | SQL verification + profil lat/lng |
| Upload 503 | Cloudinary | Remplir `.env` Cloudinary backend |
| WS ne connecte pas | Mauvaise URL / pas de token | `NEXT_PUBLIC_WS_URL`, être connecté |
| Double `/api/v1` | Mauvaise `API_URL` | URL = `http://host/api/v1` une seule fois |
| Email non reçu | SMTP off | Lire console `[email:dev]` ou config SendGrid |

---

## 8. Fichiers utiles dans le repo frontend

| Fichier | Rôle |
|---------|------|
| `lib/api/mappers.ts` | camelCase backend ↔ types UI |
| `lib/auth/refresh.ts` | Refresh JWT serveur |
| `services/api/client.ts` | Appels BFF + missions/notifications |
| `hooks/useNovaWebSocket.ts` | WebSocket client |
| `docs/README_BACKEND.md` | Spécification API détaillée |

---

*Dernière mise à jour : alignement avec le guide d’intégration nova-backend.*
