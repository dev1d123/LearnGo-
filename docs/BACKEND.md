# Backend — FastAPI

Resumen
- Ubicación: `backend/`
- Framework: FastAPI (ASGI)
- Servidor recomendado para desarrollo: Uvicorn

Estructura principal

```
backend/
└─ app/
   ├─ main.py                # app factory y CORS
   ├─ api/                   # routers: summarize, flashcard, generate-exercises, games, learning-path, roadmap
   ├─ services/              # lógica de negocio (orquestación)
   ├─ integrations/          # clientes IA (AIClient y específicos)
   ├─ infrastructure/
   │  └─ files/file_manager.py
   └─ core/settings.py       # carga de variables de entorno
```

Dependencias (relevantes)
- `fastapi==0.111.0`
- `uvicorn==0.29.0`
- `pydantic-settings==2.2.1` (config desde `.env`)
- `pdfplumber`, `python-docx` (extracción de archivos)
- `langchain-core`, `langchain-google-genai` (clientes IA)

Puntos importantes del código

- `app/core/settings.py` — utiliza `pydantic_settings.BaseSettings` y carga `.env`. Variables detectadas: `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_MODEL_PRO`, `APP_SETTING`.
- `app/integrations/ai_client.py` — clase `AIClient` que crea instancias de `ChatGoogleGenerativeAI` usando `langchain_google_genai`.
- Clientes concretos: `exercises/client.py`, `flashcards/client.py`, `learning_path/client.py` entre otros. Estos forman instrucciones (templates) y usan `with_structured_output(...)` o `response_mime_type='application/json'`.
- `app/infrastructure/files/file_manager.py` — funciones sin bloqueo para extraer texto de PDFs y DOCX; devuelve lista de páginas por archivo.

Buenas prácticas para cambios

- Crear modelos Pydantic para entradas y salidas en `app/domain`.
- Mantener clientes IA independientes y sin estado (crear modelo por petición).
- Loggear y devolver errores claros al frontend (HTTPException con detalle cuando sea necesario).

Comandos útiles

Activar entorno virtual (PowerShell):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Ejecutar en modo desarrollo:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Docker (desde `backend/`):

```bash
docker-compose up --build
```

Testing y calidad
- Añade tests en `backend/tests/` (pytest). Mockea llamadas a `langchain_google_genai` usando fixtures.
- Añade linters y formatters (black/isort, ruff/flake8) al pipeline de CI.
