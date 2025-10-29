# Variables de entorno y configuración

El backend utiliza `pydantic-settings` y carga variables desde un fichero `.env` en `backend/`.

Variables detectadas (mínimo requerido)

| Variable | Obligatorio | Descripción |
|---|:---:|---|
| `GEMINI_API_KEY` | Sí | API key para el proveedor de IA (langchain_google_genai / Google generative). |
| `GEMINI_MODEL` | Sí | Nombre del modelo a usar (ej.: `gemini-1.0`). |
| `GEMINI_MODEL_PRO` | No | Modelo pro alternativo (ej.: `gemini-pro-1.0`). |
| `APP_SETTING` | No | Ajuste de configuración general (valor por defecto: `default_value`). |

Ejemplo de `.env` (colocar en `backend/.env`)

```text
GEMINI_API_KEY=sk_...your_key_here...
GEMINI_MODEL=gemini-1.0
GEMINI_MODEL_PRO=gemini-pro-1.0
APP_SETTING=development
```

Buenas prácticas

- No commitees el `.env` al control de versiones. Añade `backend/.env` a `.gitignore` si no está ya.
- Para entornos de producción utiliza un gestor de secretos (Azure Key Vault, AWS Secrets Manager, GitHub Actions Secrets, etc.).
- En CI, exporta variables via pipeline y evita incrustar claves en los workflows.

Variables de entorno del frontend

- El frontend actualmente tiene `BASE_URL` hardcodeado en `src/services/api.jsx` a `https://learngo-plum.vercel.app`. Para entornos locales recomienda reemplazarlo por una variable como `NEXT_PUBLIC_API_BASE_URL` y usar `process.env.NEXT_PUBLIC_API_BASE_URL`.

Ejemplo (local):

```
# .env.local (frontend)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Auditoría y rotación de claves

- Regenera las API keys periódicamente.
- Mantén acceso restringido y registra el consumo (costes y usos de IA).
