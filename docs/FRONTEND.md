# Frontend — Next.js

Resumen
- Ubicación: `frontend/`
- Framework: Next.js (app directory), React 19

Estructura principal (resumen)

```
frontend/
├─ src/
│  ├─ app/          # páginas y layouts (app router)
│  ├─ components/   # componentes UI y juegos
│  ├─ services/     # cliente API (src/services/api.jsx)
│  └─ types/        # tipos y definiciones TS/JS
├─ public/
├─ package.json
```

Dependencias clave (desde `frontend/package.json`)
- `next@15.x`, `react@19.x`, `react-dom@19.x`
- `three`, `@react-three/fiber`, `@react-three/drei` (visualizaciones/juegos)
- `tailwindcss`, `postcss`, `autoprefixer` (estilos)

Cliente API
- `src/services/api.jsx` contiene funciones para llamar al backend. Observaciones:
  - `BASE_URL` por defecto apunta a `https://learngo-plum.vercel.app`.
  - Endpoints usan `multipart/form-data` para upload de archivos y JSON para peticiones simples.

Desarrollo

```bash
cd frontend
npm install
npm run dev
# abrir http://localhost:3000
```

Build para producción

```bash
cd frontend
npm run build
npm run start
```

Buenas prácticas
- Mantener `src/services/api.jsx` como la única capa de comunicación con backend.
- Validar responses del servidor y mostrar errores al usuario de forma clara.
- Añadir tests unitarios para componentes y mocks para llamadas fetch (jest/rtl).
