# -----------------------------
# Étape 1 : Build du frontend React
# -----------------------------
FROM node:18 AS frontend-build
WORKDIR /app/frontend

# Copier et installer les dépendances frontend
COPY frontReact/package*.json ./
RUN npm install --legacy-peer-deps

# Copier le reste du frontend et build
COPY frontReact/ .
RUN npm run build

# -----------------------------
# Étape 2 : Build du backend Node.js
# -----------------------------
FROM node:18 AS backend-build
WORKDIR /app/backend

# Copier et installer les dépendances backend
COPY cloud-security-backend/package*.json ./
RUN npm install --only=production

# Copier le code source backend
COPY cloud-security-backend/ .

# -----------------------------
# Étape 3 : Image finale Node.js pour fullstack
# -----------------------------
FROM node:18

WORKDIR /app

# Installer 'serve' pour servir le frontend
RUN npm install -g serve

# Copier le backend depuis l'étape précédente
COPY --from=backend-build /app/backend /app/backend

# Copier le frontend build
COPY --from=frontend-build /app/frontend/build /app/frontend/build

# Exposer les ports backend et frontend
EXPOSE 5000 3000

# Lancer backend et frontend
CMD sh -c "node /app/backend/server.js & serve -s /app/frontend/build -l 3000"
