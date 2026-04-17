#!/bin/bash
# Inicia el servidor y prueba las URLs

echo "🚀 Iniciando servidor de desarrollo..."

# Limpiar procesos previos
pkill -f "next dev" 2>/dev/null
sleep 2

# Iniciar el servidor
pnpm dev &
SERVER_PID=$!

echo "⏳ Esperando a que el servidor esté listo..."

# Esperar a que el servidor esté listo (máximo 60 segundos)
for i in {1..60}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Servidor listo en http://localhost:3000"
    break
  fi
  sleep 1
  echo -n "."
done

echo ""
echo ""
echo "=========================================="
echo "🌐 URLs disponibles:"
echo "=========================================="
echo ""
echo "🏠 Página principal:   http://localhost:3000"
echo "🔐 Login:             http://localhost:3000/sign-in"
echo "👤 Registro:          http://localhost:3000/sign-up"
echo "📊 Dashboard:         http://localhost:3000/dashboard"
echo "📅 Calendario:        http://localhost:3000/dashboard/calendar"
echo "⚙️  Settings:         http://localhost:3000/dashboard/settings"
echo "👨‍🎨 Perfil público:   http://localhost:3000/t/[tu-slug]"
echo ""
echo "=========================================="
echo "📊 Para probar las URLs:"
echo "   ./test-interface.sh"
echo ""
echo "🛑 Para detener el servidor:"
echo "   kill $SERVER_PID"
echo "   o: pkill -f 'next dev'"
echo "=========================================="
echo ""

# Mantener el script corriendo
wait $SERVER_PID
