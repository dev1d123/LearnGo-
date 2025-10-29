# Ejecutar y probar localmente

Instrucciones rápidas para desarrollo local (PowerShell / Windows).

Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Verificar salud básica:

```powershell
Invoke-RestMethod http://localhost:8000/
```

Frontend

```powershell
cd frontend
npm install
npm run dev
# abrir http://localhost:3000
```

Pruebas manuales rápidas

- Subir un PDF a `/api/summarize/` via Postman o usando `curl` (ver `docs/API.md`).
- Probar `/api/flashcard/` y `/api/generate-exercises/` con archivos o peticiones por tópico.

Recomendación para debugging

- Habilita logs de Uvicorn: `uvicorn app.main:app --reload --log-level debug`.
- Añade prints/logs en `app/integrations/*` para ver payloads enviados al proveedor de IA (no incluyas claves en logs).
