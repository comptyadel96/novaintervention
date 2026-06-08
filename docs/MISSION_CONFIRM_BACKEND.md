# Confirmation client / artisan (backend)

Le front appelle **`POST /api/v1/missions/:id/confirm-client`** (client) et **`confirm-artisan`** (artisan).

Si le client voit « Erreur lors de la validation des travaux », c'est presque toujours un **endpoint backend manquant ou une règle métier non respectée**.

---

## Flux attendu

```
in_progress
  → artisan POST /complete-work (photo après)
  → waiting_confirmation
  → client POST /confirm-client   → client_confirmed_at = now()
  → artisan POST /confirm-artisan → artisan_confirmed_at = now()
  → completed (les deux timestamps renseignés)
```

---

## POST `/missions/:id/confirm-client`

**Auth :** JWT client, doit être le `customerId` de la mission.

**Préconditions :**

- `status === "waiting_confirmation"`
- `client_confirmed_at` est null

**Effet :**

```sql
UPDATE missions SET client_confirmed_at = NOW() WHERE id = :id;
-- Si artisan_confirmed_at déjà renseigné → status = 'completed', completed_at = NOW()
```

**Réponse 200 :** mission mise à jour (camelCase ou snake_case, le front mappe les deux).

**Erreurs :**

| HTTP | code | Cas |
|------|------|-----|
| 401 | UNAUTHORIZED | Non connecté |
| 403 | FORBIDDEN | Pas le client de la mission |
| 404 | NOT_FOUND | Mission ou route inexistante |
| 409 | MISSION_INVALID_STATE | Statut ≠ waiting_confirmation |
| 409 | MISSION_ALREADY_CONFIRMED | Déjà validé par le client |

---

## POST `/missions/:id/confirm-artisan`

Même logique pour l'artisan assigné (`artisan_id`).

---

## Test curl (backend direct)

```bash
# Remplacer TOKEN et MISSION_ID
curl -X POST "https://VOTRE-API/api/v1/missions/MISSION_ID/confirm-client" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

Si **404** → la route n'est pas implémentée sur Hetzner.

---

## Fichiers front

| Fichier | Rôle |
|---------|------|
| `app/api/missions/[id]/confirm-client/route.ts` | BFF proxy |
| `components/dashboard/ClientView.tsx` | Bouton « Confirmer & Clôturer » |
| `lib/api/mission-action-route.ts` | Proxy générique |

Après déploiement front, le message d'erreur affiché au client reprend le **message exact du backend** (plus seulement une alerte générique).
