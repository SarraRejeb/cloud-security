#!/bin/bash
set -e

echo "🚀 Initialisation de PostgreSQL..."
service postgresql start

# Créer la base et l’utilisateur
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname = '${POSTGRES_DB}'\" | grep -q 1 || createdb ${POSTGRES_DB}"
su - postgres -c "psql -c \"ALTER USER ${POSTGRES_USER} WITH PASSWORD '${POSTGRES_PASSWORD}';\""

echo "✅ PostgreSQL prêt."

# Lancer le backend
echo "🚀 Lancement du backend..."
cd /app/backend
node server.js &

# Servir le frontend (par ex. avec 'serve')
echo "🚀 Lancement du frontend..."
npx serve -s /app/frontend/build -l 80
