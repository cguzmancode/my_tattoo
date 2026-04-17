#!/bin/bash
# Script para probar la interfaz de InkApp

echo "=========================================="
echo "🎨 InkApp - Test de Interfaz"
echo "=========================================="
echo ""

# URLs a probar
BASE_URL="http://localhost:3000"
URLS=(
  "/"
  "/sign-in"
  "/sign-up"
  "/dashboard"
  "/dashboard/bookings"
  "/dashboard/calendar"
  "/dashboard/settings"
  "/t/demo-artist"
)

echo "📡 Probando URLs..."
echo ""

for url in "${URLS[@]}"; do
  full_url="${BASE_URL}${url}"
  response=$(curl -s -o /dev/null -w "%{http_code}" "$full_url")

  if [ "$response" = "200" ]; then
    echo "✅ $url - OK (200)"
  elif [ "$response" = "307" ] || [ "$response" = "302" ]; then
    echo "🔄 $url - Redirect ($response) - Probablemente requiere auth"
  elif [ "$response" = "404" ]; then
    echo "⚠️  $url - Not Found (404)"
  else
    echo "❌ $url - Error ($response)"
  fi
done

echo ""
echo "=========================================="
echo "🧪 Para ver las páginas en tu navegador:"
echo ""
echo "  1. Página pública:     $BASE_URL/"
echo "  2. Login:             $BASE_URL/sign-in"
echo "  3. Dashboard:          $BASE_URL/dashboard"
echo "  4. Perfil público:     $BASE_URL/t/demo-artist"
echo ""
echo "📋 Si el servidor no está corriendo, ejecuta:"
echo "    pnpm dev"
echo "=========================================="
