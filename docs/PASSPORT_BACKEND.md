# Passeport Nova — instructions backend

Le front est livré et fonctionnel. Tant que les routes ci-dessous n'existent pas,
le BFF traduit les 404 en `backendReady: false` et l'interface affiche un encart
« Passeport en cours d'activation » au lieu d'une erreur. Il n'y a donc **aucune
urgence de synchronisation** : dès que les routes répondent, l'UI s'active seule.

Référence produit : `docs/NOVA_Blueprint_Strategique_MVP.pdf`, §7 « Passeport Nova »
et §8 « Stratégie data ».

---

## 1. Principe fondateur

Le passeport appartient **au bâtiment**, pas au compte utilisateur. Un bâtiment est
identifié par son adresse normalisée (+ coordonnées GPS). Conséquences :

- un utilisateur possède un lien vers un bâtiment (table de liaison), pas le bâtiment ;
- lors d'une vente, l'historique doit pouvoir être transféré au nouveau propriétaire
  sans être dupliqué (prévoir le champ dès maintenant, la fonctionnalité plus tard) ;
- un même bâtiment peut avoir plusieurs occupants dans le temps.

## 2. Modèle de données

### `buildings`

| colonne | type | notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `address` | text NOT NULL | adresse formatée Google |
| `address_normalized` | text | clé de déduplication (minuscules, sans ponctuation) |
| `city`, `postal_code` | text | |
| `latitude`, `longitude` | numeric | |
| `kind` | enum | `apartment \| house \| building \| commercial \| other` |
| `construction_year` | int | |
| `surface_m2` | numeric | |
| `photo_url` | text | |
| `created_at`, `updated_at` | timestamptz | |

Index unique sur `address_normalized` (ou sur un geohash) pour éviter les doublons.

### `building_members`

| colonne | type | notes |
| --- | --- | --- |
| `building_id` | uuid FK | |
| `user_id` | uuid FK | |
| `role` | enum | `owner \| occupant \| viewer` |
| `label` | text | nom donné par l'utilisateur (« Résidence principale ») |
| `is_primary` | boolean | bien par défaut de l'utilisateur |

Clé primaire `(building_id, user_id)`.

### `building_equipments`

| colonne | type | notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `building_id` | uuid FK | |
| `category` | enum | `heating \| water_heater \| air_conditioning \| ventilation \| roof \| plumbing \| electrical \| other` |
| `name`, `brand`, `model` | text | |
| `installed_at`, `last_service_at`, `next_service_at`, `warranty_until` | date | |
| `health` | enum | `up_to_date \| watch \| action_required` |
| `confidence` | enum | `declared \| confirmed \| proven \| reinforced` |
| `notes` | text | |

### `building_documents`

| colonne | type | notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `building_id` | uuid FK | |
| `equipment_id` | uuid FK NULL | |
| `mission_id` | uuid FK NULL | rempli si généré par une intervention |
| `kind` | enum | `invoice \| warranty \| manual \| diagnostic \| photo \| other` |
| `name`, `url` | text | URL Cloudinary |
| `issued_at` | date | |
| `confidence` | enum | `proven` par défaut (un document est une preuve) |

### `building_events` (historique)

| colonne | type | notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `building_id` | uuid FK | |
| `equipment_id` | uuid FK NULL | |
| `mission_id` | uuid FK NULL UNIQUE | une mission ne crée qu'un événement |
| `kind` | enum | `intervention \| maintenance \| works \| note` |
| `title`, `description` | text | |
| `occurred_at` | timestamptz | |
| `professional_name` | text | dénormalisé, doit rester lisible même si l'artisan quitte la plateforme |
| `price` | numeric | prix final payé |
| `photo_before_url`, `photo_after_url` | text | |
| `confidence` | enum | `confirmed` si issu d'une mission Nova |

### `building_recommendations`

| colonne | type | notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `building_id` | uuid FK | |
| `equipment_id` | uuid FK NULL | |
| `kind` | enum | `maintenance \| check \| replacement` |
| `title`, `description` | text | |
| `due_at` | date | |
| `priority` | enum | `low \| medium \| high` |
| `suggested_service` | text | catégorie pré-remplie dans `/demander` |

Migration suggérée : `20260915120000_passport_nova`.

## 3. Endpoints attendus (`/api/v1/passport/*`)

Tous authentifiés par JWT, scoping via `building_members`.

| Méthode | Route | Réponse |
| --- | --- | --- |
| `GET` | `/passport/buildings` | `{ items: Building[] }` ou tableau brut |
| `POST` | `/passport/buildings` | `{ building }` ou le bâtiment à plat, **201** |
| `GET` | `/passport/buildings/:id` | vue agrégée (voir ci-dessous) |
| `PATCH` | `/passport/buildings/:id` | bâtiment mis à jour |
| `DELETE` | `/passport/buildings/:id` | **204** — retire le lien `building_members`, ne supprime pas l'historique |
| `POST` | `/passport/buildings/:id/equipments` | `{ equipment }`, **201** |
| `PATCH` | `/passport/equipments/:id` | équipement mis à jour |
| `DELETE` | `/passport/equipments/:id` | **204** |
| `POST` | `/passport/buildings/:id/documents` | `{ document }`, **201** |
| `DELETE` | `/passport/documents/:id` | **204** |
| `POST` | `/passport/buildings/:id/events` | `{ event }`, **201** — note déclarée par le client |

### Vue agrégée `GET /passport/buildings/:id`

```json
{
  "building": {
    "id": "…",
    "label": "Résidence principale",
    "address": "12 rue de la Paix, 75002 Paris",
    "city": "Paris",
    "kind": "apartment",
    "constructionYear": 1975,
    "surfaceM2": 72,
    "latitude": 48.86,
    "longitude": 2.33,
    "isPrimary": true,
    "completeness": 62,
    "health": "watch",
    "equipmentsCount": 3,
    "documentsCount": 5,
    "eventsCount": 4
  },
  "equipments": [],
  "documents": [],
  "events": [],
  "recommendations": []
}
```

Le front accepte aussi bien `camelCase` que `snake_case` (mappers dans
`lib/api/map-passport.ts`), et tolère l'absence de `completeness` / `health`
(recalculés côté client). Les compteurs `equipmentsCount`, `documentsCount` et
`eventsCount` sont utilisés sur la liste des passeports : les renvoyer dans
`GET /passport/buildings` évite N+1 appels.

### Création d'un bâtiment

Corps envoyé par le front :

```json
{
  "label": "Résidence principale",
  "address": "12 rue de la Paix, 75002 Paris",
  "city": "Paris",
  "kind": "apartment",
  "constructionYear": 1975,
  "surfaceM2": 72,
  "lat": 48.86,
  "lng": 2.33
}
```

Comportement attendu : **find-or-create** sur `address_normalized`. Si le bâtiment
existe déjà, on ajoute simplement une ligne `building_members` pour l'utilisateur
courant (rôle `occupant`), sans exposer l'historique des précédents occupants
— seuls les événements postérieurs au rattachement sont visibles par défaut.

## 4. Alimentation automatique depuis les missions

C'est le point qui donne sa valeur au passeport (blueprint §8 : « chaque intervention
doit produire une donnée structurée et réutilisable »).

Au passage d'une mission à `completed` :

1. résoudre le bâtiment à partir de `latitude/longitude` + adresse de la mission
   (find-or-create, même logique que ci-dessus) et rattacher le client ;
2. créer un `building_events` avec `mission_id`, `kind: "intervention"`,
   `title` = titre de la mission, `occurred_at` = `completed_at`,
   `professional_name` = nom de l'artisan, `price` = `price_final`,
   les deux photos, et `confidence: "confirmed"` ;
3. si une facture est générée, créer un `building_documents`
   (`kind: "invoice"`, `confidence: "proven"`, `mission_id` renseigné) ;
4. si l'artisan a renseigné un équipement traité, mettre à jour
   `last_service_at`, `next_service_at` et passer `confidence` de `declared`
   à `confirmed`.

L'opération doit être **idempotente** : contrainte unique sur
`building_events.mission_id`.

## 5. Niveaux de preuve

Règle de progression (à appliquer côté backend, le front se contente d'afficher) :

| niveau | déclencheur |
| --- | --- |
| `declared` | saisi par le client |
| `confirmed` | validé par un artisan pendant une intervention |
| `proven` | un document (facture, photo, diagnostic) est rattaché |
| `reinforced` | au moins deux événements concordants sur le même équipement |

## 6. Recommandations

Niveau 1 du blueprint = **règles métier simples**, pas de ML :

- chaudière gaz : entretien obligatoire tous les 12 mois → `maintenance`,
  `priority: high` si dépassé, `medium` à 1 mois de l'échéance ;
- chauffe-eau > 12 ans → `replacement`, `priority: medium` ;
- VMC : contrôle tous les 3 ans → `check`, `priority: low` ;
- toiture > 25 ans sans événement → `check`, `priority: medium`.

Recalcul à chaque écriture sur le passeport, ou par un job quotidien.
`health` de l'équipement dérive de la recommandation la plus prioritaire :
`high → action_required`, `medium → watch`, sinon `up_to_date`.

## 7. Complétude

`completeness` (0–100) sert la barre de progression. Formule utilisée côté front
en secours, à répliquer côté backend :

adresse, type, année, surface, ≥ 1 équipement, ≥ 3 équipements, ≥ 1 document,
≥ 1 événement → 8 critères, chacun valant 12,5 %.

## 8. Upload des documents

Le front réutilise pour l'instant `POST /uploads/interventions` (Cloudinary) puis
envoie l'URL obtenue à `POST /passport/buildings/:id/documents`. Deux évolutions
souhaitables :

- accepter les PDF sur cet endpoint (aujourd'hui orienté images) ;
- créer un dossier Cloudinary dédié `nova/passport/{buildingId}` via un endpoint
  `POST /uploads/passport-documents`, pour séparer les cycles de rétention.

## 9. Codes d'erreur

Réutiliser les codes existants (`UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`) et ajouter :

| code | situation |
| --- | --- |
| `BUILDING_NOT_FOUND` | id inconnu ou utilisateur non rattaché |
| `BUILDING_ALREADY_LINKED` | l'utilisateur est déjà membre de ce bâtiment |
| `EQUIPMENT_NOT_FOUND` | équipement inconnu |
| `DOCUMENT_NOT_FOUND` | document inconnu |

Les libellés FR sont à ajouter dans `lib/api/errors.ts` côté front une fois les
codes figés.

## 10. RGPD

Le passeport contient des données de localisation précises et un historique de vie
du logement. À prévoir dès la conception (blueprint §18, risque « Réglementation / data ») :

- consentement explicite au rattachement d'un bâtiment ;
- export du passeport (JSON + PDF) à la demande ;
- suppression = détacher l'utilisateur et anonymiser les événements le concernant,
  sans détruire l'historique technique du bâtiment ;
- durée de rétention documentée par type de document.

## 11. Ordre de livraison conseillé

1. Tables + migration + `GET`/`POST /passport/buildings` et `GET /passport/buildings/:id`
   → l'écran Passeport s'active immédiatement.
2. Équipements et documents (CRUD).
3. Alimentation automatique depuis les missions terminées (le plus gros gain
   utilisateur : le passeport se remplit sans effort).
4. Recommandations par règles métier.
5. Export / transfert de propriété.
