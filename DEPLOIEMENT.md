# Déploiement

Trois niveaux, du plus simple au plus complet :

1. **Démo sur GitHub Pages** : le site en mode démonstration, sans serveur, pour montrer et tester le design.
2. **Images Docker sur GitHub (GHCR)** : chaque push sur `develop` ou `main` construit et publie les images de l’API et du site.
3. **Mise en ligne sur un serveur** : un VPS avec Docker, HTTPS automatique, mise à jour en un clic depuis GitHub.

## Ce que fait GitHub à chaque push

| Workflow | Déclencheur | Résultat |
|---|---|---|
| `CI` | tout push, toute pull request | Tests de l’API (Maven) et lint + build du site |
| `Images Docker` | push sur `main`/`develop`, tag `v*` | `ghcr.io/<compte>/beauty_of_sahel-kaom-api` et `-web`, étiquetées `develop`, `main`, `latest` (main), `1.2.3` (tag), sha |
| `Démo GitHub Pages` | push sur `main`/`develop` | Site en mode démo sur `https://<compte>.github.io/beauty_of_sahel-KAOM/` |
| `Déploiement serveur` | manuel, ou après les images de `main` | `docker compose pull` + `up -d` sur le serveur via SSH |

## 1. Démo GitHub Pages

Une seule fois : **Settings → Pages → Build and deployment → Source : GitHub Actions**.

Ensuite chaque push sur `develop` publie la démo. En mode démo :
- le catalogue d’exemple s’affiche, le panier et les formulaires fonctionnent sans rien envoyer ;
- le backoffice (`/#admin`) accepte n’importe quel e-mail et un mot de passe de 4 caractères, et les modifications restent dans l’onglet du navigateur.

> GitHub Pages sur un dépôt **privé** nécessite un abonnement GitHub Pro, Team ou Enterprise.
> Sinon, rendez le dépôt public ou utilisez les options 2 et 3.

## 2. Images Docker (GHCR)

Rien à configurer : le workflow utilise le jeton `GITHUB_TOKEN`. Les images apparaissent dans l’onglet **Packages** du compte.
Comme le dépôt est privé, les images le sont aussi : le serveur devra se connecter à `ghcr.io` (étape 3).

Publier une version : `git tag v1.0.0 && git push origin v1.0.0`.

## 3. Mise en ligne sur un serveur

### Serveur

Un VPS Linux (2 Go de RAM suffisent) avec Docker : Hetzner, OVH, DigitalOcean, Contabo… Pointez le domaine
(enregistrements `A` de `beautyofsahel.com` et `www`) vers l’adresse IP du serveur.

```bash
# Sur le serveur
curl -fsSL https://get.docker.com | sh
mkdir -p ~/kaom/deploy && cd ~/kaom
```

Copiez depuis le dépôt : `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/Caddyfile`, `.env.example`.

```bash
cp .env.example .env
nano .env
```

Dans `.env`, au minimum :
- `POSTGRES_PASSWORD`, `KAOM_JWT_SECRET` (générer avec `openssl rand -base64 48`), `KAOM_ADMIN_EMAIL`, `KAOM_ADMIN_PASSWORD` ;
- `DOMAIN=beautyofsahel.com` et `KAOM_CORS_ORIGINS=https://beautyofsahel.com` ;
- `KAOM_WHATSAPP` (format international sans +, ex. `221771234567`) ;
- `COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml` (active HTTPS) ;
- `KAOM_DEMO_LOCATION=` (vide) pour démarrer **sans** le catalogue d’exemple.

Connexion au registre GitHub (jeton « classic » avec la permission `read:packages`) :

```bash
echo <JETON> | docker login ghcr.io -u <compte-github> --password-stdin
docker compose pull
docker compose up -d
```

Le site est en ligne en HTTPS ; le compte de la créatrice est créé au premier démarrage.

### Mises à jour automatiques depuis GitHub

Dans **Settings → Secrets and variables → Actions**, ajoutez :

| Secret | Valeur |
|---|---|
| `DEPLOY_HOST` | IP ou nom du serveur |
| `DEPLOY_USER` | utilisateur SSH |
| `DEPLOY_SSH_KEY` | clé privée SSH autorisée sur le serveur |
| `DEPLOY_PATH` | dossier (défaut `~/kaom`) |

Chaque fusion sur `main` publie les images puis met le serveur à jour. On peut aussi lancer
**Actions → Déploiement serveur → Run workflow** et choisir la version.

### Sauvegardes

```bash
# Base de données
docker compose exec -T db pg_dump -U kaom kaom | gzip > kaom-$(date +%F).sql.gz
# Photos
docker run --rm -v kaom_uploads:/data -v "$PWD":/backup alpine tar czf /backup/uploads-$(date +%F).tgz -C /data .
```

À programmer chaque nuit avec `crontab -e`, et à copier hors du serveur.

## Variables d’environnement

| Variable | Défaut | Rôle |
|---|---|---|
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | kaom / kaom / — | Base de données |
| `KAOM_JWT_SECRET` | — | Signature des sessions du backoffice (32 caractères minimum) |
| `KAOM_JWT_TTL` | `12h` | Durée d’une session |
| `KAOM_ADMIN_EMAIL` / `KAOM_ADMIN_PASSWORD` / `KAOM_ADMIN_NAME` | — | Compte créé au premier démarrage |
| `KAOM_CORS_ORIGINS` | `http://localhost` | Domaines autorisés à appeler l’API |
| `KAOM_WHATSAPP`, `KAOM_INSTAGRAM`, `KAOM_EMAIL`, `KAOM_ADDRESS` | — | Coordonnées affichées sur le site |
| `KAOM_FREE_SHIPPING` | `50000` | Seuil de livraison offerte (FCFA) |
| `KAOM_DEMO_LOCATION` | `,classpath:db/demo` | Vide = pas de catalogue d’exemple |
| `KAOM_TAG` | `latest` | Version des images |
| `WEB_PORT` | `80` | Port du site sans HTTPS |
| `DOMAIN` | — | Domaine pour HTTPS (prod) |
