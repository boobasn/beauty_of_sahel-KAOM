# KAOM · Beauty of Sahel

Site vitrine et boutique de la marque KAOM · Beauty of Sahel (prêt-à-porter afro-moderne et sur mesure, Dakar),
avec un backoffice pour que la créatrice gère ses articles, ses collections et les demandes des clientes.

Instagram : [@beauty_of_sahel](https://www.instagram.com/beauty_of_sahel)

## Ce que fait le site

**Côté clientes**
- Accueil : ouverture, paysage du Sahel animé, collections, catégories, sélection (nouveautés, meilleures ventes, promotions), shop the look, sur mesure
- Boutique filtrable (catégorie, genre, taille, prix, disponibilité) et page par collection
- Fiche produit : photos, couleurs, tailles, stock, question WhatsApp
- Panier conservé dans le navigateur, commande envoyée à la créatrice (sans paiement en ligne) puis suivi sur WhatsApp
- Demande de rendez-vous sur mesure, inscription à la newsletter

**Côté créatrice** (`/#admin`)
- Tableau de bord : articles en ligne, demandes à traiter, stock faible, abonnés
- Articles : création, modification, photos (8 par article), tailles, couleurs, prix barré, brouillon ou en ligne
- Collections : textes, image de couverture, ordre, visibilité, collection à la une
- Demandes : commandes et rendez-vous, changement de statut, réponse WhatsApp en un clic
- Newsletter : liste des abonnés, copie des adresses

## Architecture

```
frontend/   React 19 + TypeScript + Vite, servi par nginx en production
backend/    Spring Boot 4 (Java 21), Spring Security (JWT), JPA, Flyway, PostgreSQL 16
deploy/     Caddyfile (HTTPS automatique)
.github/    CI, images Docker (GHCR), démo GitHub Pages, déploiement SSH
```

```
Navigateur ──► nginx (web) ──► /          fichiers du site
                           ├─► /api/**    API Spring Boot (api) ──► PostgreSQL (db)
                           └─► /uploads/** photos (volume « uploads »)
```

### API

| Méthode | Chemin | Accès | Rôle |
|---|---|---|---|
| GET | `/api/collections`, `/api/collections/{slug}` | public | Collections visibles |
| GET | `/api/products?collection=&category=&q=`, `/api/products/{slug}` | public | Articles en ligne |
| GET | `/api/settings` | public | WhatsApp, Instagram, seuil de livraison offerte |
| POST | `/api/requests` | public | Commande (`ORDER`, prix recalculés côté serveur) ou demande (`BESPOKE`, `CONTACT`) |
| POST | `/api/newsletter` | public | Inscription |
| POST | `/api/auth/login` | public | Connexion de la créatrice, renvoie un jeton JWT |
| GET/POST/PUT/DELETE | `/api/admin/products[/{id}]`, `/{id}/images` | JWT | Gestion des articles et des photos |
| GET/POST/PUT/DELETE | `/api/admin/collections[/{id}]`, `/{id}/cover` | JWT | Gestion des collections |
| GET/PATCH/DELETE | `/api/admin/requests[/{id}]` | JWT | Suivi des demandes |
| GET | `/api/admin/dashboard`, `/api/admin/newsletter` | JWT | Statistiques, abonnés |

Les erreurs suivent le format RFC 9457 (`application/problem+json`) avec un message en français.

## Lancer en local (développement)

Prérequis : Java 21, Maven, Node 22, PostgreSQL 16 (ou Docker).

```bash
# Base de données
docker run -d --name kaom-db -e POSTGRES_DB=kaom -e POSTGRES_USER=kaom -e POSTGRES_PASSWORD=kaom -p 5432:5432 postgres:16-alpine

# API (http://localhost:8080)
cd backend
KAOM_ADMIN_EMAIL=moi@example.com KAOM_ADMIN_PASSWORD=motdepasse-local mvn spring-boot:run

# Site (http://localhost:5173, /api et /uploads redirigés vers 8080)
cd frontend && npm install && npm run dev
```

Backoffice : http://localhost:5173/#admin avec l’e-mail et le mot de passe ci-dessus.

Mode démo sans API : `VITE_DEMO=true npm run dev`.

## Lancer avec Docker

```bash
cp .env.example .env      # puis remplacer les mots de passe et le secret JWT
docker compose up -d --build
```

Le site est sur http://localhost (port `WEB_PORT`). Données et photos sont conservées dans les volumes `db-data` et `uploads`.

## Tests

```bash
cd backend && mvn verify          # 13 tests d'intégration (H2 en mode PostgreSQL)
cd frontend && npm run lint && npm run build
```

## Déploiement

Voir **[DEPLOIEMENT.md](DEPLOIEMENT.md)** : démo GitHub Pages, images Docker sur GitHub, mise en ligne sur un serveur avec HTTPS.
