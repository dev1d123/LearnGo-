# Despliegue

Este documento resume formas comunes de desplegar backend y frontend.

Deploy rápido con Docker Compose (backend)

1. Desde `backend/` crear `.env` con las variables necesarias.
2. Construir y levantar:

```bash
cd backend
docker-compose up --build -d
```

Esto levantará el servicio `chrome-ai-backend` según `backend/docker-compose.yml` y expondrá el puerto `8000`.

Desplegar frontend

- Opción recomendada: Vercel (Next.js)
  - Conecta el repo a Vercel y configura `NEXT_PUBLIC_API_BASE_URL` en las variables de entorno de Vercel.
- Opción Docker: construir imagen y servir `next start`.

CI/CD — recomendaciones

- Acciones mínimas en pipeline:
  1. Lint & tests
  2. Build (frontend `npm run build`) y backend (opcional: build image Docker)
  3. Publicar artefactos/images a registry
  4. Desplegar (k8s/AKS/AppService/Container Apps / Docker Compose)

Seguridad y secretos

- No almacenar claves en el repo.
- Usar variables en el proveedor (Vercel env vars, GitHub Secrets, Azure KeyVault).

Hitos de despliegue

- Staging: desplegar imagen del backend y configurar API endpoint en Vercel Preview o entorno staging.
- Production: habilitar monitorización (Application Insights / Prometheus) y alertas de errores y latencia.
