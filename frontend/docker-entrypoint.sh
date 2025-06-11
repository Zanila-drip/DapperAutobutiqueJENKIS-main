#!/bin/sh
# Genera el archivo env.js con la variable de entorno VITE_API_URL
# Si la variable no está definida, usa http://backend:8000 por defecto
API_URL=${VITE_API_URL:-http://backend:8000}
echo "window.env = { VITE_API_URL: '$API_URL' };" > /usr/share/nginx/html/env.js
exec "$@"
