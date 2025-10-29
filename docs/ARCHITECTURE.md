# Arquitectura

Resumen rápido
- Aplicación full‑stack dividida en dos componentes: `backend/` (FastAPI) y `frontend/` (Next.js).
- Comunicación por HTTP/JSON; frontend usa endpoints con prefijo `/api` en el backend.

Diagrama (alto nivel)

Frontend (Next.js)
  ──> HTTP (JSON multipart/form-data / application/json)
Backend (FastAPI)
  ├─ Integraciones IA: `app/integrations/*` (clientes específicos que usan `langchain_google_genai`)
  └─ Infraestructura de archivos: `app/infrastructure/files/file_manager.py` (pdf/docx extraction)

Componentes clave

- `app/main.py` — Inicializa la app FastAPI y configura CORS. Incluye router principal `app/api/routes.py`.
- `app/api/*.py` — Routers por dominio: `summarize`, `generate-exercises`, `flashcard`, `roadmap`, `games`, `learning-path`.
- `app/services/*` — Orquestadores de lógica (llaman a los clientes de IA y/o procesan resultados).
- `app/integrations/*` — Implementaciones concretas que usan `AIClient` (por ejemplo `ExercisesAIClient`, `FlashcardsAIClient`, `LearningPathAIClient`).
- `app/infrastructure/files/file_manager.py` — Extracción de texto desde PDF y DOCX (usa `pdfplumber` y `python-docx`).
- `app/core/settings.py` — Configuración central basada en `pydantic-settings`, carga `.env`.

Decisiones arquitecturales

- Se crea una instancia de modelo por petición (`AIClient.new_model()`), esto evita problemas de concurrencia / timeouts con proveedores serverless.
- Salidas de IA: se usan estructuras Pydantic (structured output) cuando es posible; para contenido muy complejo (learning path con full content) se fuerza `response_mime_type='application/json'` y se parsea manualmente.
- Extracción de archivos se ejecuta en hilos (via `anyio.to_thread.run_sync`) para evitar bloquear el event loop.

Escenarios de fallo y mitigaciones

- Respuestas IA no válidas JSON: los clientes aplican limpieza/normalización antes del parseo.
- Archivos corruptos o tipos no soportados: `file_manager` devuelve mensajes de error por archivo para que la UI pueda mostrarlos.
