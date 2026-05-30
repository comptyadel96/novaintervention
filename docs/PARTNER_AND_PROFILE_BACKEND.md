# Backend — Candidatures partenaires & profil (téléphone + GPS)

Document pour aligner l’API `nova-backend` avec le front Next.js.

---

## 1. Problème actuel (candidatures)

La page `/devenir-partenaire` **n’enregistrait rien** (simple `console.log`).  
Le front appelle maintenant le BFF → **`POST /api/v1/partner-applications`**.

Tant que cette route n’existe pas côté backend, l’admin ne verra aucune demande.

---

## 2. Candidatures artisan (plomberie uniquement)

### Modèle Prisma suggéré

```prisma
model PartnerApplication {
  id         String   @id @default(uuid())
  firstName  String
  lastName   String
  phone      String
  city       String
  trade      String   @default("plomberie")
  status     String   @default("pending") // pending | contacted | approved | rejected
  adminNote  String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Routes

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| **POST** | `/api/v1/partner-applications` | Public | Nouvelle candidature |
| **GET** | `/api/v1/admin/partner-applications` | Admin | Liste (`?status=pending`) |
| **PATCH** | `/api/v1/admin/partner-applications/:id` | Admin | Changer statut |

### POST public — corps

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "0612345678",
  "city": "Paris",
  "trade": "plomberie"
}
```

Réponse `201` :

```json
{
  "id": "uuid",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "0612345678",
  "city": "Paris",
  "trade": "plomberie",
  "status": "pending",
  "createdAt": "2026-05-24T12:00:00.000Z"
}
```

### PATCH admin

```json
{
  "status": "approved",
  "adminNote": "Rappelé le 24/05"
}
```

Statuts : `pending` | `contacted` | `approved` | `rejected`.

### Dashboard admin

Enrichir `GET /api/v1/admin/dashboard` :

```json
{
  "artisans": {
    "pendingVerification": 2,
    "pendingApplications": 5
  }
}
```

`pendingApplications` = candidatures avec `status = pending`.

### Workflow recommandé

1. Artisan remplit `/devenir-partenaire` (prénom, nom, téléphone, ville).
2. Admin voit l’onglet **Candidatures** dans le tour de contrôle.
3. Admin appelle l’artisan → `status: contacted`.
4. Admin crée le compte artisan (`POST /auth/register` avec `role: artisan`, `trade: plomberie`) ou envoie un lien d’invitation.
5. Admin valide le profil artisan existant via `PATCH /profiles/:id/verification`.

**Pas de SIRET** ni choix de métier côté front — `trade` fixé à `plomberie`.

---

## 3. Téléphone à l’inscription → profil

### Bug observé

Le client saisit son téléphone à l’inscription, mais `/auth/me` ne le renvoie pas (ou seulement sur `User`, pas `Profile`) → formulaire « Compléter le profil » vide.

### Corrections backend obligatoires

#### A. `POST /auth/register`

Lors de la création du compte :

```typescript
// Pseudo-code
await prisma.user.create({ data: { phone, ... } });
await prisma.profile.create({
  data: {
    userId: user.id,
    phone,           // ← copier ici
    firstName,
    lastName,
    trade: role === "artisan" ? "plomberie" : undefined,
  },
});
```

#### B. `GET /auth/me` (et login / refresh)

Toujours renvoyer :

```json
{
  "user": {
    "id": "...",
    "email": "...",
    "phone": "0612345678",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "client"
  },
  "profile": {
    "id": "...",
    "phone": "0612345678",
    "firstName": "Jean",
    "lastName": "Dupont",
    "address": null,
    "latitude": null,
    "longitude": null,
    "city": "Paris"
  }
}
```

Le front lit `profile.phone ?? user.phone`.

#### C. `PATCH /profiles/me`

Accepter et persister :

```json
{
  "phone": "0612345678",
  "address": "12 rue de la Paix, Paris",
  "city": "Paris",
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

Réponse : profil complet avec les mêmes champs (pour refresh UI).

---

## 4. Complétion profil (client + artisan)

Règle front : profil complet = **téléphone valide** + **latitude/longitude**.

| Rôle | GPS obligatoire ? |
|------|-----------------|
| client | Oui |
| artisan | Oui (radar missions) |
| admin | Non (exempté côté front) |

Après complétion, l’utilisateur peut modifier téléphone et GPS dans **Mon profil** (`PATCH /profiles/me`).

---

## 5. Admin — navigation différente

Côté front (déjà fait) :

- Menu admin : Tour de contrôle, Mon profil, Paramètres — **pas** « Mes demandes ».
- Onglet **Candidatures** dans `AdminView`.

Backend : s’assurer que `user.role === "admin"` sur le compte admin seed.

---

## 6. Checklist backend

- [ ] Table `PartnerApplication` + migrations
- [ ] `POST /partner-applications` (public, rate-limit)
- [ ] `GET /admin/partner-applications`
- [ ] `PATCH /admin/partner-applications/:id`
- [ ] `pendingApplications` dans dashboard admin
- [ ] Copier `phone` User → Profile à l’inscription
- [ ] `GET /auth/me` renvoie `user.phone` et `profile.phone`
- [ ] `PATCH /profiles/me` accepte `phone`, `address`, `latitude`, `longitude`
- [ ] (Optionnel) SMS / email notif admin à chaque nouvelle candidature

---

## 7. Fichiers front concernés

| Fichier | Rôle |
|---------|------|
| `app/devenir-partenaire/page.tsx` | Formulaire simplifié → API |
| `app/api/partner-applications/route.ts` | BFF POST |
| `app/api/admin/partner-applications/*` | BFF admin |
| `components/dashboard/AdminView.tsx` | Onglet Candidatures |
| `components/dashboard/DashboardSidebar.tsx` | Menu admin |
| `components/dashboard/CompleteProfileForm.tsx` | Téléphone visible + GPS |
| `components/dashboard/ProfileForm.tsx` | Modification téléphone + GPS |
| `lib/auth/needs-profile-completion.ts` | Admin exempté |
