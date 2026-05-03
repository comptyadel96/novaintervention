# NovaIntervention — Brief Développeur

## Présentation

NovaIntervention est une plateforme web qui connecte instantanément des particuliers à des artisans certifiés via une photo analysée par intelligence artificielle.

Objectif : proposer une intervention en moins de 30 minutes, avec un prix fixe affiché avant l'intervention, puis documenter chaque intervention dans un Carnet d'Entretien numérique.

> Le développement se concentre sur la partie web (Next.js) du projet. La partie mobile React Native / Expo est ignorée dans ce dépôt.

## Concept & problème résolu

- Problème : trouver un artisan fiable en urgence en France est trop complexe.
- Douleurs : prix opaques, délais imprévisibles, absence de traçabilité, artisans isolés et sous-digitalisés.
- Solution : digitaliser ce marché de 12 milliards d'euros avec une expérience rapide, transparente et documentée.

## Couches produit

1. Marketplace IA
   - Photo du problème → analyse GPT-4o Vision
   - Artisan certifié envoyé en < 30 minutes
   - Commission 18-20% par intervention
2. SaaS récurrent
   - Abonnement artisan 49-89 €/mois
   - Nova Premium particulier 9,90 €/mois
   - Carnet d'Entretien automatique
3. Data B2B (confidentiel)
   - Nova Score logement vendu aux assureurs, banques, gestionnaires
   - Marge 90%

> Seules les couches 1 et 2 sont développées dans ce projet.

## Flux utilisateur web

### Client

1. Ouvre le site et clique sur `Demander une intervention`
2. Prend une photo du problème
3. L'IA analyse la photo en < 4 secondes et renvoie le type d'intervention, description, estimation, urgence, durée estimée
4. Le client valide, saisit prénom, téléphone et position GPS
5. La demande est envoyée
6. Il reçoit le nom, la photo, l'ETA et un lien de suivi GPS de l'artisan
7. L'artisan arrive, le client signe le PV électronique
8. Paiement par carte, facture envoyée par email

### Artisan

1. Notification push avec détails, photo, adresse et pièces recommandées
2. 4 minutes pour accepter ou refuser
3. En cas d'acceptation, récapitulatif + navigation Google Maps
4. Appuie sur `Je suis arrivé`, le client est notifié
5. Après intervention, prend au moins 2 photos travaux réalisés
6. Génère le PV électronique et fait signer le client
7. Virement Stripe Connect déclenché T+1 jour ouvré

### Automatisation

- Qualification IA de la photo
- Matching artisan optimal
- Envoi push + SMS
- Suivi GPS en temps réel
- Génération facture PDF
- Paiement Stripe automatique
- Mise à jour du Carnet d'Entretien

## Stack technique obligatoire

- Frontend web : Next.js App Router 14.x
- Base de données : Supabase PostgreSQL
- Auth : Supabase Auth
- IA photo : OpenAI GPT-4o Vision (serveur uniquement)
- Paiement : Stripe Connect API 2024
- Notifications push : Expo Push + Firebase FCM
- SMS : Twilio
- Signature PV : Yousign API v3
- Cartes / GPS : Google Maps Platform
- Stockage fichiers : Supabase Storage
- Hébergement web : Vercel
- Hébergement DB : Supabase Cloud Pro

## Charte graphique

Palette CSS obligatoire :

```css
:root {
  --navy: #0b1d3a;
  --navy-mid: #112952;
  --navy-lt: #1a3a6b;
  --orange: #ff6b2b;
  --orange-lt: #ff8c55;
  --orange-xs: #fff0e8;
  --dark: #060f1e;
  --off: #f4f6fa;
  --muted: #8ba3c7;
  --text: #e8eef8;
  --green: #22c55e;
  --teal: #0ea5c9;
}
```

- Fond global : `var(--dark)` ou `var(--navy)`
- Texte sur fond sombre : `var(--text)` ou `var(--muted)`
- CTA primaire orange : un seul par section visible
- Bouton téléphone : vert clair avec bordure verte
- Ne pas utiliser de bleu corporate classique

### Typographie

Importer dans `<head>` :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap"
  rel="stylesheet"
/>
```

- H1 / H2 / H3 : Syne
- Texte courant : DM Sans

## Pages web prioritaires

- `/` : Homepage — hero, étapes, services, Nova Score, témoignages, CTA
- `/demander` : formulaire 3 étapes photo + IA + coordonnées + confirmation
- `/devenir-partenaire` : page recrutement artisans + simulateur revenus
- `/login`, `/register` : authentification Supabase client / artisan

> Pages secondaires à prévoir : `/espace-client`, `/artisan/dashboard`, `/admin`

## Formulaire de demande

Structure en 3 étapes obligatoires :

1. Photo
2. Résultat IA
3. Coordonnées

### Endpoint serveur requis

`POST /api/analyze-photo`
Body : `{ image: base64_string }`
Réponse :

```json
{
  "type_intervention": "plomberie|electricite|chauffage|clim|serrurerie|vitrerie",
  "description_probleme": "string",
  "niveau_urgence": "urgent|standard|planifiable",
  "estimation_prix_min": 100,
  "estimation_prix_max": 250,
  "pieces_recommandees": ["robinet", "joint"],
  "duree_estimee_minutes": 45,
  "confidence": 0.85
}
```

- Si `confidence < 0.6`, afficher un champ de description complémentaire.

## Schéma de données principal

Tables Supabase principales :

- `users` (Supabase Auth)
- `artisans`
- `clients`
- `interventions`
- `carnets`
- `fiches_intervention`
- `notifications`

Toutes les tables doivent avoir RLS activé.

## Matching artisan

Logique de sélection :

1. Filtrer artisans `disponible` + spécialité requise
2. Filtrer dans un rayon de 15 km, puis 30 km si nécessaire
3. Score :
   - note_moyenne / 5 \* 0.4
   - taux_acceptation_30j \* 0.3
   - (1 - distance_km / 30) \* 0.3
4. Trier par score et notifier les 3 meilleurs
5. Timer 4 min, puis étendre si nécessaire
6. Timeout total 20 min, proposer autre créneau si aucun artisan

Payload notification artisan :

- Titre : `[emoji métier] Nouvelle mission — [ville]`
- Corps : `[description] — Estime [duree]min — [prix_min]-[prix_max] EUR`
- Actions : ACCEPTER / REFUSER
- Deep link vers détail mission

## Standards de code

- TypeScript strict, sans `any`
- Interfaces définies pour toutes les données
- Secrets uniquement dans `.env.local`
- RLS Supabase explicite pour chaque table
- Mobile-first responsive
- Lighthouse mobile >= 90 avant prod
- Orthographe soignée

## Livraison

- Staging Vercel obligatoire pour validation
- Aucun déploiement prod en vendredi soir / weekend sans accord
- Récap hebdomadaire des livrables, bugs et blockers

## Ressources utiles

- Site actuel : `https://novaservicess.netlify.app/`
- Polices : Syne + DM Sans
- Contact : `contact@novaintervention.com`
- Téléphone : `07 88 20 97 73`
