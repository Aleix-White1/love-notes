#!/bin/bash
set -e

echo "🎨 Love Notes — Deploy a Render"
echo ""
echo "Render no tiene CLI completo para free tier."
echo "Sigue estos pasos (5 minutos):"
echo ""
echo "1. Sube este proyecto a GitHub:"
echo "   git init && git add . && git commit -m 'Love Notes'"
echo "   gh repo create love-notes --public --push --source=."
echo "   (necesitas: npm install -g gh  y  gh auth login)"
echo ""
echo "2. Ve a https://render.com → New → Web Service"
echo "   - Conecta tu repo de GitHub"
echo "   - Render detecta render.yaml automáticamente"
echo "   - Click 'Apply'"
echo ""
echo "3. Espera ~3 minutos → tu URL aparece en el dashboard"
