# Google Maps — intégration front & besoins backend

## Variables d'environnement (front)

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
# Optionnel : Map ID (Cloud Console → Maps → Map Management)
NEXT_PUBLIC_GOOGLE_MAP_ID=
```

APIs à activer dans Google Cloud (même clé, restriction par referrer) :

- Maps JavaScript API
- Places API
- Geocoding API
- Directions API

Referrers autorisés : `http://localhost:3000/*`, `https://novaintervention.vercel.app/*`

---

## Ce que le front fait aujourd'hui

| Zone | Fonctionnalité |
|------|----------------|
| **Radar artisan** (`ArtisanRadarMap`) | Google Maps, clustering (`@googlemaps/markerclusterer`), marqueur artisan (bleu), missions client (orange), InfoWindow détaillée, acceptation `POST /missions/:id/accept`, itinéraire Directions (missions en cours), filtres Offres / En cours / Tout, WebSocket `mission.offer`, sync position `PATCH /profiles/me` toutes les 5 min |
| **Demande client** (`/demander`) | Autocomplete Places (France), géocodage adresse, géoloc GPS, envoi `latitude` / `longitude` / `city` à la création |
| **Mes interventions** | Carte des missions actives (même composant, mode « En cours ») |

---

## Données backend **obligatoires** pour que la carte fonctionne

### Missions

Chaque mission exposée au front **doit** inclure :

```json
{
  "id": "...",
  "title": "...",
  "status": "pending",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "city": "Paris",
  "description": "...",
  "photoBeforeUrl": "https://...",
  "priceFinal": 120,
  "urgency": "urgent",
  "customerName": "...",
  "customerPhone": "..."
}
```

| Champ | Usage carte |
|-------|-------------|
| `latitude`, `longitude` | Marqueur + cluster — **sans eux la mission n'apparaît pas** |
| `city` | Adresse / filtre dispatch |
| `description`, `photoBeforeUrl` | Panneau détail |
| `urgency` ou `niveau_urgence` | Badge urgence (sinon pas de badge) |
| `status`, `artisanId` | Offre vs mission assignée |

**Création** `POST /missions` : le front envoie déjà `latitude`, `longitude`, `city`, `photoBeforeUrl`, `category`, etc. (voir `mapMissionToCreate`).

### Profil artisan

`PATCH /profiles/me` avec `{ "latitude", "longitude" }` — utilisé pour le dispatch géo backend et la position sur la carte.

`GET /profiles/me` devrait renvoyer `latitude` / `longitude` si vous voulez pré-positionner l'artisan sans GPS navigateur.

### WebSocket

Événement `mission.offer` : payload mission **avec** `latitude` / `longitude` (même forme que REST).

Événements utiles : `mission.accepted`, `mission.status_changed` (déjà écoutés côté front pour rafraîchir).

---

## Endpoints / logique backend **recommandés** (pas encore obligatoires côté front)

### 1. Liste missions « radar » géo-filtrée

```
GET /missions?status=pending&unassigned=true&nearLat=48.86&nearLng=2.35&radiusKm=25
```

Le backend applique `MISSION_OFFER_RADIUS_KM` et ne renvoie que les missions dans le rayon.  
Aujourd'hui le front filtre côté liste globale ; un filtre serveur réduit le trafic.

### 2. Distance / ETA (optionnel)

```
GET /missions/:id/distance?fromLat=&fromLng=
→ { "distanceKm": 3.2, "durationMinutes": 12 }
```

Le front calcule déjà une distance à vol d'oiseau (Haversine). Directions API Google donne l'itinéraire routier côté client.

### 3. Reverse geocoding serveur (optionnel)

Si vous ne voulez pas exposer Geocoding au navigateur :

```
POST /geo/reverse   { "lat", "lng" } → { "formattedAddress", "city" }
POST /geo/geocode   { "address" } → { "lat", "lng", "city" }
```

### 4. Champ `address` structuré

```json
{
  "addressLine": "12 rue de Rivoli",
  "postalCode": "75001",
  "city": "Paris",
  "country": "FR"
}
```

Améliore Places + affichage ; aujourd'hui le front envoie `city` + `location` (texte libre).

### 5. Confidentialité téléphone client

Le front **n'affiche pas** le téléphone sur les offres `pending` (seulement après acceptation dans la liste).  
Si le backend renvoie le téléphone sur les offres publiques, c'est un choix métier à valider.

### 6. Index base de données

Index géospatial (PostGIS / geohash) sur `(latitude, longitude)` pour le dispatch et les requêtes `nearLat` / `nearLng`.

---

## Checklist démo

1. Clé Google + 4 APIs activées + referrer Vercel / localhost  
2. Missions de test avec **vraies** coordonnées  
3. Artisan avec GPS autorisé dans le navigateur  
4. Compte artisan vérifié + email vérifié (sinon 403 sur accept)  
5. WebSocket backend en marche pour les nouvelles offres live  

---

## Fichiers front principaux

- `components/maps/ArtisanRadarMap.tsx`
- `components/maps/MissionClusterLayer.tsx`
- `components/maps/AddressAutocomplete.tsx`
- `components/demander/DemanderCoordinatesStep.tsx`
- `hooks/useArtisanLocation.ts`
- `docs/GOOGLE_MAPS_BACKEND.md` (ce fichier)
