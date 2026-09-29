# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Vide = l'API est servie sur le même domaine (nginx redirige /api et /uploads).
ARG VITE_API_URL=""
ARG VITE_DEMO="false"
ENV VITE_API_URL=$VITE_API_URL VITE_DEMO=$VITE_DEMO
RUN npm run build

# ---- Exécution ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /src/dist /usr/share/nginx/html
# Adresse interne de l'API (service docker-compose « api »)
ENV API_UPSTREAM=http://api:8080
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost/ >/dev/null || exit 1
