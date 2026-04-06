#!/bin/bash
set -e

echo "🚂 Love Notes — Deploy a Railway"
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
  echo "Instalando Railway CLI..."
  npm install -g @railway/cli
fi

# Login
echo "Abriendo login en el navegador..."
railway login

# Init project
echo "Creando proyecto en Railway..."
railway init --name love-notes

# Add volume for persistent data
echo "Configurando volumen persistente..."
railway volume add --mount /data

# Set env vars
railway variables set NODE_ENV=production DATA_DIR=/data

# Deploy
echo "Desplegando..."
railway up --detach

echo ""
echo "✅ Desplegado. Obteniendo URL..."
railway domain
