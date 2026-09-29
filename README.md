# KAOM · Beauty of Sahel

Site vitrine et backoffice de la marque KAOM, prêt-à-porter afro-moderne conçu et cousu à Dakar.
Instagram : [@beauty_of_sahel](https://www.instagram.com/beauty_of_sahel)

## Structure

```
frontend/   React 19 + TypeScript + Vite : site vitrine et backoffice
backend/    Spring Boot 4 (Java 21) : API REST /api
```

## État actuel : maquette

Le frontend contient la maquette complète à valider, avec des données d'exemple
(`frontend/src/data/catalog.ts`) :

- `#` Accueil : hero, collection en vedette, nouveautés, lookbook, atelier, sur mesure, Instagram
- `#collections` et `#collection-harmattan` : boutique filtrable
- `#produit-grand-boubou-laterite` : fiche produit, commande WhatsApp
- `#backoffice` : espace créatrice (articles, stocks, demandes)

Les visuels sont des croquis de vêtements remplis du motif de leur tissu. Ils seront remplacés
par les photos envoyées depuis le backoffice.

## Lancer le projet

```bash
# API (port 8080)
cd backend && mvn spring-boot:run

# Site (port 5173, /api redirigé vers 8080)
cd frontend && npm install && npm run dev
```

Vérification : `GET http://localhost:8080/api/status`.

## Étapes suivantes (après validation du design)

1. API : entités `Collection`, `Product`, `ProductImage`, `Request` (demandes clients), PostgreSQL + Flyway
2. Authentification du backoffice (Spring Security, JWT)
3. Upload des photos (stockage local ou S3 compatible)
4. Frontend : react-router, branchement sur l'API, formulaires du backoffice
5. Déploiement
