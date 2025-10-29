# Contribuir

Guía rápida para nuevos contribuyentes.

Flujo recomendado

1. Abre un issue describiendo el bug o la propuesta de mejora.
2. Crea una rama desde `main`: `git checkout -b feat/mi-descripcion`.
3. Implementa los cambios en pequeñas commits con mensajes claros.
4. Ejecuta tests y linters localmente.
5. Abre un Pull Request hacia `main` describiendo el cambio y su justificación.

Estilo de código

- Python: seguir PEP8. Recomendado: `black` + `ruff`.
- JavaScript/React: seguir ESLint + configuración del proyecto (`eslint-config-next`).

Tests

- Añade tests unitarios en `backend/tests/` y `frontend/__tests__/`.
- Mockear llamadas a servicios de IA para tests (ej. con `pytest-mock` o `unittest.mock`).

Revisión de PR

- Incluye descripción, pasos para probar y screenshots si afectan UI.
- Referencia el issue correspondiente.

Comportamiento esperado

- Cambios en la lógica de IA deben documentarse en `docs/BACKEND.md` y pruebas con ejemplos reales (mocked) añadidas.
