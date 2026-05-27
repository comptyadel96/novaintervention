# Tester l'application en local (guide rapide)

## 1. Démarrer les services

```bash
# Terminal 1 — backend
cd nova-backend
# Neon : DATABASE_URL dans .env avec ?sslmode=require puis :
npx prisma migrate deploy
npx prisma generate
npm run dev
# (Postgres local optionnel : docker compose up -d && npm run db:migrate)

# Terminal 2 — frontend
cd novaintervention
npm run dev
```

Vérifier : http://localhost:4000/api/v1/health → `{ "status": "ok" }`

### Google Maps (carte artisan + adresse client)

Dans `novaintervention/.env.local` :

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
# Optionnel
NEXT_PUBLIC_GOOGLE_MAP_ID=
```

Activer dans Google Cloud : Maps JavaScript, Places, Geocoding, Directions.  
Voir [GOOGLE_MAPS_BACKEND.md](./GOOGLE_MAPS_BACKEND.md).

## 2. Comptes de test

**Obligatoire une fois** (base Neon vide après migration) :

```bash
cd nova-backend
npm run db:seed
```

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Client | `client@test.com` | `password123` |
| Artisan | `artisan@test.com` | `password123` |
| Admin | `admin@test.com` | `password123` |

Sinon : message **« email ou mot de passe invalide »** à la connexion.

Alternative : `/register` (mot de passe **8 caractères minimum**).

### Valider l'artisan (obligatoire)

Dans PostgreSQL ou Prisma Studio :

```sql
UPDATE profiles
SET verification_status = 'approved',
    verified_at = NOW(),
    latitude = 48.8566,
    longitude = 2.3522,
    trade = 'plomberie'
WHERE user_id = (SELECT id FROM users WHERE email = 'artisan@test.com');
```

Ou : connexion admin → `PATCH /profiles/:id/verification`.

### GPS artisan via l'UI

`/dashboard/profile` → **Ma position** → Enregistrer.

## 3. Parcours E2E (15 min)

### Client (navigateur 1)

1. `/login` → client@test.com  
2. `/demander` → photo (+ contexte optionnel) → **Lancer l'IA** → bandeau vert « Analyse réelle » ou ambre « Mode démo » → confirmer  
3. Renseigner adresse + **Utiliser ma position** (géoloc obligatoire)  
4. **Mandater l'artisan** → redirection `/dashboard/requests`

### Artisan (navigateur 2 / incognito)

1. `/login` → artisan@test.com  
2. `/dashboard` → carte **Radar** → **Accepter l'intervention**  
3. `/dashboard/missions` → **Démarrer l'intervention**  
4. Photo **après** + prix → **Terminer et envoyer au client**

### Client (suite)

1. `/dashboard` ou `/dashboard/requests` → bloc orange **Validez vos travaux**  
2. **Confirmer & clôturer (client)**

### Artisan (suite)

1. `/dashboard/missions` → **Confirmer ma part (artisan)**  
2. Statut **Terminée** → **Facture PDF**

## 4. Dépannage express

| Problème | Solution |
|----------|----------|
| Pas de missions sur la carte | Artisan non vérifié ou sans GPS |
| Erreur upload | Configurer Cloudinary dans `.env` backend |
| IA toujours « mode démo » | `OPENAI_API_KEY` sur le **backend** ; voir [AI_PHOTO_ANALYSIS.md](./AI_PHOTO_ANALYSIS.md) |
| Analyse IA échoue en local | `AI_ANALYZE_ALLOW_MOCK=true` dans `.env.local` front (démo) ou corriger l’API |
| 401 après 15 min | Normal → refresh auto ; se reconnecter si échec |
| WS déconnecté | Backend démarré + être connecté |
| CORS | `CORS_ORIGINS=http://localhost:3000` backend |

## 5. Fichiers clés UI

- Radar : `ArtisanMap.tsx`
- Actions artisan : `ArtisanMissionCard.tsx`
- Validation client : `ClientRequestsList.tsx`
- Profil GPS : `ProfileForm.tsx`
