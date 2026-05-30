# Backend — Contact us & simulateur revenus artisan

Spécification pour `nova-backend` — alignée sur le front Next.js (BFF).

---

## 1. Formulaire contact (`/contact-us`)

### Front

- Page : `/contact-us`
- BFF : `POST /api/contact-messages` → backend `POST /api/v1/contact-messages`

### Route backend

```
POST /api/v1/contact-messages
Auth : public (rate-limit recommandé : 5 req / 15 min / IP)
Content-Type: application/json
```

#### Corps

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@email.com",
  "phone": "0612345678",
  "message": "J'ai une question sur une intervention…",
  "source": "contact-page"
}
```

#### Réponse `201`

```json
{
  "id": "uuid",
  "message": "Message reçu. Nous vous répondrons sous peu."
}
```

#### Erreurs

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Champ manquant / invalide |
| `RATE_LIMITED` | 429 | Trop de messages |

### Modèle Prisma suggéré

```prisma
model ContactMessage {
  id        String   @id @default(uuid())
  firstName String
  lastName  String
  email     String
  phone     String
  message   String   @db.Text
  source    String   @default("contact-page")
  status    String   @default("new") // new | read | replied
  createdAt DateTime @default(now())
}
```

### Actions backend

1. **Persister** en base (`status: new`).
2. **Notifier l’admin** :
   - Email à `CONTACT_INBOX_EMAIL` ou `ADMIN_EMAIL` (Resend / SMTP / SendGrid).
   - Optionnel : entrée dans le dashboard admin (`GET /admin/contact-messages`).
3. **Rate limiting** (express-rate-limit ou Redis).

### Variables d’environnement

```env
CONTACT_INBOX_EMAIL=contact@novaintervention.com
# + config SMTP / Resend déjà utilisée pour verify-email
```

### Admin (optionnel mais recommandé)

```
GET  /api/v1/admin/contact-messages?status=new
PATCH /api/v1/admin/contact-messages/:id  { "status": "read" }
```

---

## 2. Simulateur revenus (`/devenir-partenaire`)

### Front

- Composant : `PartnerEarningsSimulator`
- BFF : `GET /api/public/artisan-earnings-estimate?trade=plomberie&city=Paris`
- Backend : `GET /api/v1/public/artisan-earnings-estimate`

Le simulateur **ne doit plus utiliser de chiffres en dur** quand l’API répond avec `dataSource: "live"`.

### Route backend (publique)

```
GET /api/v1/public/artisan-earnings-estimate
Query:
  trade=plomberie     (défaut plomberie — seul métier pour l’instant)
  city=Paris          (optionnel — filtre missions dans la ville)
Auth : aucune
Cache : 1 h (CDN ou Cache-Control) recommandé
```

#### Réponse `200`

```json
{
  "estimate": {
    "trade": "plomberie",
    "averageBasket": 218.5,
    "medianBasket": 195,
    "commissionRate": 0.2,
    "avgMissionsPerWeek": 8.2,
    "minMissionsPerWeek": 1,
    "maxMissionsPerWeek": 40,
    "avgWeeklyMissionsPlatform": 8.2,
    "sampleSize": 127,
    "city": "Paris",
    "dataSource": "live",
    "periodLabel": "12 derniers mois"
  }
}
```

#### Champs — définitions

| Champ | Calcul backend |
|-------|----------------|
| `averageBasket` | **Moyenne** `artisan_payout` (ou `price_final - platform_fee`) sur missions `status=completed`, `trade=plomberie`, période 12 mois |
| `medianBasket` | Médiane des mêmes montants |
| `commissionRate` | Taux plateforme config (`PLATFORM_COMMISSION_RATE`, ex. `0.2`) — identique admin dashboard |
| `avgMissionsPerWeek` | Moyenne hebdo missions terminées / nb artisans actifs (ou P50 artisans) — sert de **valeur initiale du slider** |
| `avgWeeklyMissionsPlatform` | Idem ou missions/semaine toutes confondues |
| `minMissionsPerWeek` | `1` |
| `maxMissionsPerWeek` | `max(40, P95 missions/semaine)` ou `40` |
| `sampleSize` | Nombre de missions utilisées pour `averageBasket` |
| `dataSource` | `"live"` si `sampleSize >= 10`, sinon `"default"` |
| `periodLabel` | `"12 derniers mois"` ou `"90 derniers jours"` |

#### Fallback si peu de données (`sampleSize < 10`)

```json
{
  "estimate": {
    "trade": "plomberie",
    "averageBasket": 220,
    "commissionRate": 0.2,
    "avgMissionsPerWeek": 10,
    "minMissionsPerWeek": 1,
    "maxMissionsPerWeek": 40,
    "sampleSize": 0,
    "dataSource": "default",
    "periodLabel": "estimation plateforme"
  }
}
```

Le front affiche un bandeau « Données par défaut » dans ce cas.

### Filtre par ville (optionnel)

Si `city` est fourni :

```sql
-- Pseudo : missions dont le client ou l'artisan est dans city
WHERE LOWER(mission.city) = LOWER(:city)
   OR LOWER(profile.city) = LOWER(:city)
```

Si `sampleSize < 5` pour cette ville → élargir à toute la plateforme ou retourner `default` avec `city` dans la réponse.

### Formule côté front (pour info)

```
CA brut mensuel = missionsPerWeek × averageBasket × 4.33
Net artisan     = CA brut × (1 - commissionRate)
Commission Nova = CA brut × commissionRate
```

Le backend **ne calcule pas** le net pour chaque slider — il fournit les paramètres réels.

### Exemple requête SQL (Prisma raw / agrégation)

```typescript
// Missions terminées plomberie, 12 mois
const missions = await prisma.mission.findMany({
  where: {
    status: "completed",
    completedAt: { gte: twelveMonthsAgo },
    artisan: { profile: { trade: "plomberie" } },
    ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
  },
  select: { artisanPayout: true, priceFinal: true, platformFee: true },
});

const payouts = missions.map(m => m.artisanPayout ?? (m.priceFinal - m.platformFee));
const averageBasket = mean(payouts);
const medianBasket = median(payouts);
```

---

## 3. Candidatures partenaires — email (rappel)

Le formulaire `/devenir-partenaire` envoie déjà :

```json
{
  "firstName", "lastName", "phone", "email?", "city", "trade": "plomberie"
}
```

Assurez-vous que `PartnerApplication.email` est bien persisté pour le bouton **Email** dans l’admin (contacter candidat).

---

## 4. Checklist implémentation

### Contact

- [ ] `POST /contact-messages` + table Prisma
- [ ] Email notification admin
- [ ] Rate limit IP
- [ ] (Optionnel) `GET /admin/contact-messages`

### Simulateur

- [ ] `GET /public/artisan-earnings-estimate`
- [ ] Agrégation missions `completed` + `trade=plomberie`
- [ ] `commissionRate` depuis config (même source que admin)
- [ ] `dataSource: live` si `sampleSize >= 10`
- [ ] Filtre `city` optionnel
- [ ] Cache HTTP 1 h

### Tests manuels

```bash
# Contact
curl -X POST http://localhost:4000/api/v1/contact-messages \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"t@test.com","phone":"0612345678","message":"Hello"}'

# Simulateur
curl "http://localhost:4000/api/v1/public/artisan-earnings-estimate?trade=plomberie"
curl "http://localhost:4000/api/v1/public/artisan-earnings-estimate?trade=plomberie&city=Paris"
```

Front local : `/contact-us` + `/devenir-partenaire` → bandeau vert « X missions analysées » si `dataSource: live`.

---

## 5. Fichiers front liés

| Fichier | Rôle |
|---------|------|
| `app/contact-us/page.tsx` | Formulaire contact |
| `app/api/contact-messages/route.ts` | BFF POST |
| `services/api/contact.ts` | Client |
| `components/partner/PartnerEarningsSimulator.tsx` | UI simulateur |
| `app/api/public/artisan-earnings-estimate/route.ts` | BFF GET |
| `lib/api/map-earnings-estimate.ts` | Normalisation réponse |
