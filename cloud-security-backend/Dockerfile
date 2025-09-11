# Utilise l'image officielle Node.js
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install --only=production

# Copie le reste du code source
COPY . .

# Expose le port utilisé par l'app (ex: 5000)
EXPOSE 5000

# Commande pour lancer le serveur
CMD ["node", "server.js"]
