<!-- README generado automáticamente en español para el proyecto LearnGo- -->
# LearnGo - Plataforma de generación educativa con IA

Una plataforma full‑stack (backend + frontend) para generar resúmenes, ejercicios, tarjetas didácticas, rutas de aprendizaje y minijuegos a partir de documentos y texto utilizando modelos de IA.

## Tabla de contenidos

- [Características](#características)
- [Visión general de la arquitectura](#visión-general-de-la-arquitectura)
- [Stack tecnológico y dependencias](#stack-tecnológico--dependencias)
- [Requisitos previos](#requisitos-previos)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Uso](#uso)
  - [Ejecutar localmente](#ejecutar-localmente)
  - [Endpoints de ejemplo (API)](#endpoints-de-ejemplo-api)
- [Despliegue](#despliegue)
- [Variables de entorno](#variables-de-entorno)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Contacto / Autores](#contacto--autores)

## Características

- Generación de resúmenes a partir de PDF/DOCX.
- Generación automática de ejercicios (multiple choice, completar, verdadero/falso, respuesta corta, emparejamiento).
- Generación de tarjetas (flashcards) a partir de contenido o por tópico.
- Generación de rutas de aprendizaje (learning paths) personalizables.
- Creación de minijuegos educativos (buscador de palabras, crucigrama, etc.).
- Integración con modelos de IA (configurable via variables de entorno) y extracción de texto desde archivos.

## Visión general de la arquitectura

El repositorio está dividido en dos partes principales:

- `backend/` — API construida con FastAPI que expone los endpoints para generar resúmenes, ejercicios, flashcards, juegos y rutas de aprendizaje. Aquí se encuentran los servicios que integran el cliente de IA, manejan la extracción de archivos y orquestan la generación de contenido.
- `frontend/` — Aplicación Next.js que consume la API y proporciona interfaces para subir archivos, configurar parámetros y visualizar resultados (resúmenes, ejercicios y juegos).

Comunicación:

- El frontend realiza peticiones HTTP a la API REST del backend (prefijo `/api`) para solicitar generación de contenido. Por ejemplo: `POST /api/summarize` o `POST /api/generate-exercises`.

Estructura clave (resumen):

- backend/
  - `app/main.py` — Inicialización de la app FastAPI.
  - `app/api/*` — Rutas/routers de la API (summaries, exercises, flashcards, games, learning-path).
  - `app/services/*` — Lógica que orquesta llamadas a los integraciones/IA.
  - `app/integrations/*` — Clientes para servicios de IA (p. ej. Gemini) y templates/prompts.
  - `app/infrastructure/files/file_manager.py` — Utilidad para extraer texto de PDFs/DOCX.
  - `core/settings.py` — Carga de variables de entorno.

- frontend/
  - Next.js app en `frontend/` con páginas y componentes para interactuar con la API.
  - `src/services/api.jsx` — Cliente frontend para llamadas a la API.

Diagrama simple (ASCII):

Frontend (Next.js)
    |
    | HTTP (JSON)
    v
Backend (FastAPI) ---> Integraciones IA (Gemini / proveedores) / Extractor de archivos

## Stack tecnológico & dependencias

- Backend:
  - Python 3.11+ (recomendado)
  - FastAPI
  - Uvicorn
  - pydantic-settings
  - pdfplumber, python-docx (para extracción de contenido)
  - langchain-core, langchain-google-genai (integraciones relacionadas con IA)

- Frontend:
  - Next.js (React)
  - React 19
  - TailwindCSS
  - Three.js y librerías de juego/visualización (three, @react-three/*)
  - Otras dependencias listadas en `frontend/package.json`.

## Requisitos previos

- Git
- Node.js (>= 18) y npm o pnpm para el frontend
- Python 3.11+ para el backend
- Opcional: Docker & Docker Compose (para ejecución en contenedores)

Variables de entorno (ver sección dedicada más abajo). Crear un archivo `.env` en `backend/` con las claves mínimas.

## Instalación & Setup

Los pasos siguientes asumen que clonas el repositorio en tu máquina y usas PowerShell (el shell por defecto en este entorno).

Clonar el repositorio:

```powershell
git clone https://github.com/dev1d123/LearnGo-.git
cd LearnGo-
```

### Backend

1. Entrar en la carpeta del backend:

```powershell
cd backend
```

2. Crear y activar un entorno virtual (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Instalar dependencias:

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

4. Archivo de variables de entorno

Crear un archivo `.env` en `backend/` (ver sección Variables de entorno abajo). Un ejemplo mínimo:

```text
GEMINI_API_KEY=tu_api_key_aqui
GEMINI_MODEL=gemini-standard
GEMINI_MODEL_PRO=gemini-pro
APP_SETTING=valor_opcional
```

5. Ejecutar la API localmente (modo desarrollo):

```powershell
# Desde la carpeta backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Alternativa con Docker Compose (dentro de `backend/`):

```powershell
docker-compose up --build
```

### Frontend

1. Abrir otra terminal y entrar en la carpeta `frontend`:

```powershell
cd frontend
```

2. Instalar dependencias (npm):

```powershell
npm install
```

3. Arrancar en modo desarrollo:

```powershell
npm run dev
```

4. Abrir el navegador en `http://localhost:3000` para ver la interfaz.

## Uso

### Ejecutar localmente

- Backend: `http://localhost:8000` (root)
- Endpoints de la API con prefijo `/api` (p. ej. `http://localhost:8000/api/summarize`)
- Frontend: `http://localhost:3000`

### Endpoints de ejemplo (API)

- GET / — raíz (saludo)
- POST /api/summarize — Subir archivos (PDF/DOCX) para generar un resumen.
  - Parámetros: `files` (UploadFile[]), `character`, `language_register`, `language`, `extension`, `include_references`, `include_examples`, `include_conclusions`.

- POST /api/generate-exercises — Generar ejercicios desde archivos o texto.
  - Parámetros: `files`, `exercises_count`, `exercises_difficulty`, `exercises_types`.

- POST /api/flashcard — Generar flashcards desde archivos o por tópico.

- POST /api/games — Generar juegos (word_search, crossword, ...).

- POST /api/learning-path/generate — Generar rutas de aprendizaje a partir de archivos con múltiples parámetros de personalización.

Ejemplo de llamada con curl (resumen):

```powershell
curl -X POST "http://localhost:8000/api/summarize" -H "accept: application/json" -F "files=@C:\ruta\a\documento.pdf" -F "character=review" -F "language=English"
```

> Nota: muchas rutas esperan `multipart/form-data` (archivos + campos de formulario).

## Despliegue

Opciones habituales:

- Deploy con Docker Compose (mismo `backend/docker-compose.yml`):
  - Construir y desplegar el servicio backend:

```powershell
cd backend
docker-compose up --build -d
```

- Deploy Frontend: puedes usar Vercel (config preferida para Next.js) o construir y alojar con Docker/static host:

```powershell
cd frontend
npm run build
npm run start
```

- CI/CD: configurar pipeline que construya imagen del backend (Python), suba a registry y despliegue; y que ejecute `npm build` para el frontend (o use Vercel/GitHub Actions según preferencia).

## Variables de entorno

Lista de variables detectadas en el backend (archivo `app/core/settings.py`):

- `GEMINI_API_KEY` — API key para el proveedor de IA (obligatorio para llamadas a modelo).
- `GEMINI_MODEL` — Nombre del modelo por defecto a usar (p. ej. `gemini-standard`).
- `GEMINI_MODEL_PRO` — Nombre del modelo pro (p. ej. `gemini-pro`).
- `APP_SETTING` — Ajuste de aplicación (opcional, valor por defecto: `default_value`).

Dónde ubicarlas:

- Crear un archivo `.env` en la carpeta `backend/` con las claves anteriores. Ejemplo:

```text
GEMINI_API_KEY=sk_...
GEMINI_MODEL=gemini-1.0
GEMINI_MODEL_PRO=gemini-pro-1.0
APP_SETTING=production
```

Nota: el backend ya carga el `.env` (pydantic-settings con `env_file='.env'`).

## Contribuir

Si quieres contribuir al proyecto:

1. Abre un issue describiendo el bug o la mejora.
2. Crea una rama de trabajo desde `main` (ej.: `feat/mi-nueva-funcionalidad`).
3. Sigue las convenciones de código del proyecto y agrega pruebas cuando corresponda.
4. Abre un Pull Request contra `main`. Describe los cambios y añade capturas o ejemplos si procede.

Buenas prácticas:

- Mantén commits pequeños y con mensajes claros.
- Sigue formato de Python (PEP8) y linting en frontend (ESLint + config del proyecto).
- Ejecuta tests/linters antes de abrir PR.

## Licencia

MIT License

Copyright (c) 2025 David Alfredo Huamani Ollachica

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contacto / Autores

- Autor(es): Huamani Ollachica David Alfredo, Fernandez Huarca Rodrigo Alexander, Nina Calizaya Rafael Diego
- Si encuentras bugs o tienes sugerencias, abre un issue en el repositorio o contacta al mantenedor principal.

Puedes contactar a los autores en LinkedIn:

- Huamani Ollachica, David Alfredo — [LinkedIn](https://www.linkedin.com/in/david-alfredo-huamani-ollachica-657b8929b/)
- Fernandez Huarca, Rodrigo Alexander — [LinkedIn](https://www.linkedin.com/in/rodrigo-fernandez-h/)
- Nina Calizaya, Rafael Diego — [LinkedIn](http://www.linkedin.com/in/rafael-nina-calizaya)

---