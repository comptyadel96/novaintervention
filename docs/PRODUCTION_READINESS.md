# Production — fonctionnalités réelles vs mockups

Audit front Next.js + dépendances backend (mai 2026).

---

## Légende

| Statut | Signification |
|--------|----------------|
| **OK** | Branché API backend, utilisable en prod si env configuré |
| **PARTIEL** | UI réelle, dépend d’une config backend ou d’un champ manquant |
| **MOCK** | Aucune persistance / fausse réponse — à implémenter avant prod |
| **STATIQUE** | Contenu marketing local, pas d’API |

---

## Parcours métier (cœur produit)

| Fonctionnalité | Statut | Détail |
|----------------|--------|--------|
| Inscription client (email) | **OK** | `POST /auth/register` |
| Connexion / refresh JWT | **OK** | Cookies httpOnly |
| Connexion Google | **PARTIEL** | OK si `GOOGLE_CLIENT_ID` backend + front |
| Connexion SMS (Twilio) | **PARTIEL** | OK si Twilio configuré backend |
| Vérification email | **OK** | Routes verify + bandeau |
| Compléter profil (tél + GPS) | **OK** | `PATCH /profiles/me` — tél doit venir de `/auth/me` |
| Demande intervention `/demander` | **OK** | Upload Cloudinary + mission + IA |
| Analyse photo IA | **PARTIEL** | Réelle si `OPENAI_API_KEY` ; mock si `AI_ANALYZE_ALLOW_MOCK=true` (front) |
| Dashboard client (demandes) | **OK** | Missions API |
| Radar artisan + accepter mission | **OK** | Maps + WS + missions |
| Cycle mission (start → complete → confirm) | **OK** | API missions |
| Facture PDF | **OK** | `GET /missions/:id/invoice` |
| Notifications | **PARTIEL** | WS + REST si backend actif |
| Candidatures partenaire | **OK** | `POST /partner-applications` |
| Admin candidatures + contacter | **OK** | WhatsApp / tel / email (si email candidat) |
| Admin validation artisans | **OK** | `PATCH /profiles/:id/verification` |
| Admin users / ban | **OK** | Routes admin |
| Comptabilité admin / artisan | **OK** | Si missions terminées avec prix |

---

## Pages / features MOCK ou STATIQUE (à traiter avant prod)

| Élément | Statut | Action recommandée |
|---------|--------|-------------------|
| **`/contact-us` formulaire** | **OK** | `POST /contact-messages` — backend persister + email admin |
| **`/blog`** | **STATIQUE** | Articles en dur — CMS ou markdown plus tard (non bloquant) |
| **Stripe Connect** (texte partenaire) | **MOCK** | Mention marketing seulement — pas de payout réel |
| **App artisan mobile** (landing) | **STATIQUE** | Texte marketing — pas d’app native |
| **Push notifications** (landing partenaire) | **STATIQUE** | Pas de FCM/APNs branché |
| **Simulateur revenus** (`/devenir-partenaire`) | **PARTIEL** | Live si `GET /public/artisan-earnings-estimate` ; sinon fallback |
| **IA mode démo** | **MOCK** | Désactiver `AI_ANALYZE_ALLOW_MOCK` en prod Vercel |

---

## Variables d’environnement prod (checklist)

### Front (Vercel)

```env
NEXT_PUBLIC_API_URL=https://votre-api/api/v1
NEXT_PUBLIC_WS_URL=wss://votre-api/ws
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
# NE PAS définir en prod :
# AI_ANALYZE_ALLOW_MOCK
```

### Backend

```env
DATABASE_URL
JWT_SECRET
OPENAI_API_KEY
CLOUDINARY_*
CORS_ORIGINS=https://novaintervention.vercel.app
# Optionnel : GOOGLE_*, TWILIO_*, SMTP pour emails
```

---

## Candidatures — contacter un artisan

Admin → onglet **Candidatures** → **Contacter** :

1. **Appeler** — lien `tel:+33…`
2. **WhatsApp** — `wa.me` avec message prérempli
3. **Email** — `mailto:` si le candidat a renseigné un email (champ ajouté au formulaire partenaire)

Le statut passe à `contacted` automatiquement.

**Backend** : ajouter champ optionnel `email` sur `PartnerApplication` si pas déjà fait.

---

## Priorités avant mise en prod

1. **Désactiver** `AI_ANALYZE_ALLOW_MOCK` en prod.
2. **Implémenter** contact + simulateur backend : [`BACKEND_CONTACT_AND_EARNINGS.md`](./BACKEND_CONTACT_AND_EARNINGS.md)
3. **Vérifier** OpenAI, Cloudinary, Maps, CORS prod.
3. **Tester** E2E : inscription → profil GPS → demander → artisan accepte → clôture → facture.
4. **Tester** candidature partenaire → admin contacter → valider artisan.
5. Brancher backend contact + simulateur : voir [`BACKEND_CONTACT_AND_EARNINGS.md`](./BACKEND_CONTACT_AND_EARNINGS.md).
