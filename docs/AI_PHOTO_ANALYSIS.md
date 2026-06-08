# Analyse photo IA — Guide front-end

Diagnostic plomberie (fuite, débouchage…) via **OpenAI Vision côté backend uniquement**.

## Variables

| Où | Variable |
|----|----------|
| **Backend** | `OPENAI_API_KEY=sk-proj-...` |
| **Backend** | `OPENAI_MODEL=gpt-4o-mini` (défaut, recommandé) |
| **Backend** | `AI_ANALYZE_ALLOW_MOCK=true` — dev seulement si pas de clé |
| **Front** | Jamais de clé OpenAI publique — `OPENAI_API_KEY` dans `.env.local` Next.js **ne sert pas** |
| **Front** (optionnel) | `AI_ANALYZE_ALLOW_MOCK=true` — secours si l’API est injoignable en local |

## Choix du modèle : backend ou console OpenAI ?

Le modèle est choisi **dans le code / la config du backend** via `OPENAI_MODEL` (ex. `gpt-4o-mini`).  
La **console OpenAI** sert à créer la clé API, gérer la facturation et les limites — pas à définir le modèle par requête côté Nova.

Pour changer de modèle : modifier `OPENAI_MODEL` sur le serveur API et redémarrer. Aucun changement front requis.

## Endpoints (via BFF Next)

| Action | Front | Backend |
|--------|-------|---------|
| Statut IA | `GET /api/ai/status` | `GET /api/v1/ai/status` |
| Analyse | `POST /api/ai/analyze-photo` | `POST /api/v1/ai/analyze-photo` |
| Santé | — | `GET /api/v1/health` → `features.aiPhotoAnalysis`, `features.aiPhotoModel` |

### Statut

```json
{ "enabled": true, "model": "gpt-4o-mini" }
```

Si `enabled: false` → `/demander` affiche « IA indisponible » et désactive le bouton.

### Analyse

Corps (l’un des deux pour l’image) :

```json
{
  "imageUrl": "https://res.cloudinary.com/.../photo.jpg",
  "context": "fuite sous l'évier depuis ce matin"
}
```

Réponse :

```json
{
  "analysis": {
    "type_intervention": "services__fuite_eau",
    "description_probleme": "...",
    "niveau_urgence": "urgent",
    "estimation_prix_min": 120,
    "estimation_prix_max": 220,
    "pieces_recommandees": ["Joint", "Siphon"],
    "conseils_client": ["Coupez l'arrivée d'eau générale"],
    "duree_estimee_minutes": 45,
    "confidence": 0.82
  },
  "meta": {
    "source": "openai",
    "model": "gpt-4o-mini"
  }
}
```

**`meta.source === "mock"`** → bandeau « Mode démonstration » sur `/demander`.  
**`meta.source === "openai"`** → bandeau vert « Analyse réelle · gpt-4o-mini ».

### Types d’intervention (IA)

- `services__emergency`
- `services__debouchage_conduites`
- `services__fuite_eau`
- `services__robinetterie`
- `services__chauffe_eau`
- `services__wc_sanitaires`
- `services__general_plomberie`

Libellés FR : `lib/ai/intervention-labels.ts`.

### Erreurs (codes backend → UI)

| code | Action UI |
|------|-----------|
| `OPENAI_NOT_CONFIGURED` | Bandeau « IA indisponible » |
| `AI_UNAVAILABLE` | Message + réessayer |
| `AI_INVALID_JSON` / `AI_INVALID_SHAPE` | Autre photo |
| `CONTACT_NOT_VERIFIED` | Vérifier email/téléphone |

Messages : `lib/api/errors.ts`.

## Dépannage

| Symptôme | Cause probable |
|----------|----------------|
| `GET /api/ai/status` → `enabled: true` mais analyse échoue | Clé OpenAI invalide/expirée sur **Hetzner**, quota dépassé, ou image trop lourde (upload Cloudinary échoué) |
| Clé dans Vercel / `.env.local` front | **Ignorée** — seul le backend appelle OpenAI |
| `401` sur analyse | Route backend pas encore publique (voir `GUEST_REQUEST_BACKEND.md`) |
| `500` / `AI_UNAVAILABLE` | Logs backend `docker logs` / PM2 sur le serveur API |

## Flux front (`/demander`)

1. `GET /api/ai/status` au chargement  
2. `POST /uploads/interventions` → `imageUrl`  
3. `POST /api/ai/analyze-photo` avec `{ imageUrl, context }`  
4. Pré-remplissage titre, urgence, prix, conseils  
5. Si `confidence < 0.6` → description complémentaire obligatoire  

Fichiers clés :

- `services/api/vision.ts` — appel analyse + `meta`
- `services/api/ai-photo.ts` — statut
- `app/api/ai/analyze-photo/route.ts` — proxy BFF
- `lib/ai/map-analysis.ts` — normalisation `analysis`
- `lib/ai/analysis-meta.ts` — `meta.source`

## Coût

Modèle par défaut **`gpt-4o-mini`** + `detail: low` sur l’image (config backend) → bon rapport qualité/prix pour la classification photo plomberie.
