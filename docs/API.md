# Documentación de la API

Base URL local: `http://localhost:8000`

Prefijo de API: `/api` (los routers del backend ya están incluidos con este prefijo desde `app.main`).

Rutas principales (resumen)

| Método | Ruta | Descripción |
|---:|---|---|
| POST | `/api/summarize/` | Recibe archivos (PDF/DOCX) y parámetros para generar un resumen. Form data multipart.
| POST | `/api/generate-exercises/` | Genera ejercicios a partir de archivos (multipart) o `/by_topic` con JSON.
| POST | `/api/flashcard/` | Genera flashcards desde archivos (multipart) o `/by_topic` con JSON.
| POST | `/api/roadmap/` | Genera roadmap a partir de opciones JSON.
| POST | `/api/games/` | Genera juegos (word_search, crossword). JSON body con `topic`, `game_type`, `language`.
| POST | `/api/learning-path/generate` | Genera rutas de aprendizaje desde archivos (multipart) con múltiples parámetros de formulario.

Detalles selectos

- POST `/api/summarize/`
  - Content-Type: `multipart/form-data`
  - Campos de formulario aceptados (además de `files`):
    - `character` (string, ejemplo: `review`)
    # Documentación de la API

    Base URL local: `http://localhost:8000`

    Prefijo de API: `/api` (los routers del backend ya están incluidos con este prefijo desde `app.main`).

    Rutas principales (resumen)

    | Método | Ruta | Descripción |
    |---:|---|---|
    | POST | `/api/summarize/` | Recibe archivos (PDF/DOCX) y parámetros para generar un resumen. Form data multipart.
    | POST | `/api/generate-exercises/` | Genera ejercicios a partir de archivos (multipart) o `/by_topic` con JSON.
    | POST | `/api/flashcard/` | Genera flashcards desde archivos (multipart) o `/by_topic` con JSON.
    | POST | `/api/roadmap/` | Genera roadmap a partir de opciones JSON.
    | POST | `/api/games/` | Genera juegos (word_search, crossword). JSON body con `topic`, `game_type`, `language`.
    | POST | `/api/learning-path/generate` | Genera rutas de aprendizaje desde archivos (multipart) con múltiples parámetros de formulario.

    Detalles selectos

    - POST `/api/summarize/`
      - Content-Type: `multipart/form-data`
      - Campos de formulario aceptados (además de `files`):
        - `character` (string, ejemplo: `review`)
        - `language_register` (string)
        - `language` (string, ej. `English`)
        - `extension` (string: `short`/`medium`/`long`)
        - `include_references` (bool)
        - `include_examples` (bool)
        - `include_conclusions` (bool)
      - Respuesta esperada: JSON `{ "summary": "..." }`.

    - POST `/api/generate-exercises/` (files)
      - multipart/form-data con `files` (opcional), y campos:
        - `exercises_count` (int)
        - `exercises_difficulty` (string)
        - `exercises_types` (enum: multiple_choice, fill_in_the_blank, true_false, short_answer, matching)
      - `/api/generate-exercises/by_topic` espera JSON con `{ topic, exercises_count, exercises_difficulty, exercises_types }`.

    - POST `/api/flashcard/`
      - multipart/form-data con `files` (opcional), y campos:
        - `flashcards_count` (int)
        - `difficulty_level` (string)
        - `focus_area` (string)
      - `/api/flashcard/by_topic` acepta JSON `{ topic, flashcards_count, difficulty_level, focus_area }`.

    - POST `/api/games/`
      - JSON `{ "topic": "...", "game_type": "word_search"|"crossword", "language": "English" }`.

    - POST `/api/learning-path/generate`
      - multipart/form-data con `files` y numerosos campos de configuración (ver `app/api/learning_path_routes.py`). Resumen de campos:
        - `difficulty`, `total_duration`, `modules_count`, `sessions_per_module`, `topics_per_session`, `flashcards_per_topic`, `questions_per_topic`, `include_theory`, `language`, `auto_structure`, `learning_approach`, `language_register`, `detail_level`, `generate_full_content`.

    Errores y códigos de estado
    - 200 OK: petición procesada correctamente.
    - 4xx: input inválido o falta de archivos/parametros.
    - 5xx: error en la integración con IA o parsing de la respuesta.

    Ejemplos (PowerShell / curl)

    Resumen (multipart/form-data):

    ```powershell
    curl -X POST "http://localhost:8000/api/summarize/" -H "accept: application/json" -F "files=@C:\ruta\a\doc.pdf" -F "character=review" -F "language=English"
    ```

    Generar ejercicio por tópico (JSON):

    ```bash
    curl -X POST http://localhost:8000/api/generate-exercises/by_topic \
      -H "Content-Type: application/json" \
      -d '{"topic":"Programación funcional","exercises_count":5,"exercises_difficulty":"medium","exercises_types":"multiple_choice"}'
    ```

    Notas para desarrolladores
    - Revisar `frontend/src/services/api.jsx` para ver cómo el frontend construye FormData y cómo maneja respuestas y errores.

    ---

    ## Ejemplos JSON completos (request / response)

    Los siguientes ejemplos muestran requests (JSON o representaciones de form-data) y responses simuladas para facilitar pruebas y entender los formatos.

    ### 1) POST /api/summarize/

    Petición (multipart/form-data — representada como pares clave/valor):

    ```
    files: [document.pdf]
    character: "review"
    language_register: "formal"
    language: "English"
    extension: "medium"
    include_references: false
    include_examples: false
    include_conclusions: false
    ```

    Respuesta (application/json):

    ```json
    {
      "summary": "Este documento presenta los conceptos clave de programación funcional: funciones puras, inmutabilidad y composición. Se recomiendan ejercicios prácticos y ejemplos en JavaScript y Python."
    }
    ```

    ---

    ### 2) POST /api/generate-exercises/ (multipart con archivos)

    Petición (form-data — ejemplo):

    ```
    files: [chapter1.pdf]
    exercises_count: 3
    exercises_difficulty: "medium"
    exercises_types: "multiple_choice"
    ```

    Respuesta (application/json) — ejemplo con multiple choice:

    ```json
    {
      "exercises": [
        {
          "topic": "Programación funcional",
          "difficulty": "medium",
          "question": "¿Cuál es una característica de una función pura?",
          "choices": [
            { "text": "No tiene efectos secundarios", "is_correct": true },
            { "text": "Depende del estado externo", "is_correct": false },
            { "text": "Modifica sus argumentos", "is_correct": false },
            { "text": "Retorna valores aleatorios", "is_correct": false }
          ],
          "explanation": "Una función pura no tiene efectos secundarios y siempre devuelve el mismo resultado para los mismos argumentos.",
          "learning_objective": "Entender propiedades de funciones puras"
        }
      ]
    }
    ```

    ---

    ### 3) POST /api/generate-exercises/by_topic (JSON)

    Petición (application/json):

    ```json
    {
      "topic": "Estructuras de datos básicas",
      "exercises_count": 5,
      "exercises_difficulty": "easy",
      "exercises_types": "fill_in_the_blank"
    }
    ```

    Respuesta (application/json) — ejemplo fill-in-the-blank:

    ```json
    {
      "exercises": [
        {
          "topic": "Listas enlazadas",
          "difficulty": "easy",
          "question": "Una lista enlazada almacena elementos y un __ que apunta al siguiente nodo.",
          "answer": "puntero",
          "explanation": "Cada nodo contiene datos y un puntero/referencia al siguiente nodo."
        }
      ]
    }
    ```

    ---

    ### 4) POST /api/flashcard/ (multipart con archivos)

    Petición (form-data):

    ```
    files: [chapter1.pdf]
    flashcards_count: 4
    difficulty_level: "medium"
    focus_area: "key concepts"
    ```

    Respuesta (application/json):

    ```json
    {
      "flashcards": [
        { "question": "¿Qué es una función pura?", "answer": "Función sin efectos secundarios que siempre devuelve el mismo resultado para los mismos inputs." },
        { "question": "Define inmutabilidad.", "answer": "Estado que no puede cambiar después de su creación." }
      ]
    }
    ```

    ---

    ### 5) POST /api/flashcard/by_topic (JSON)

    Petición (application/json):

    ```json
    {
      "topic": "Redes neuronales",
      "flashcards_count": 3,
      "difficulty_level": "intermediate",
      "focus_area": "concepts"
    }
    ```

    Respuesta (application/json):

    ```json
    {
      "flashcards": [
        { "question": "¿Qué es una neurona artificial?", "answer": "Unidad básica que recibe entradas, aplica pesos y una función de activación." },
        { "question": "Función de activación común.", "answer": "ReLU, sigmoid, tanh." }
      ]
    }
    ```

    ---

    ### 6) POST /api/games/ (JSON)

    Petición (application/json) (word_search):

    ```json
    {
      "topic": "Partes de la célula",
      "game_type": "word_search",
      "language": "Spanish"
    }
    ```

    Respuesta (application/json) — ejemplo word_search:

    ```json
    {
      "type": "word_search",
      "grid": [
        "C E L U L A",
        "M I T O C O N D R I A",
        "N U C L E O"
      ],
      "words": ["mitochondria","nucleus","membrane"]
    }
    ```

    Petición (application/json) (crossword):

    ```json
    {
      "topic": "Animales",
      "game_type": "crossword",
      "language": "English"
    }
    ```

    Respuesta (application/json) — ejemplo crossword:

    ```json
    {
      "type": "crossword",
      "width": 10,
      "height": 10,
      "entries": [
        { "word": "cat", "clue": "Small domesticated feline", "row": 1, "col": 2, "dir": "across" }
      ]
    }
    ```

    ---

    ### 7) POST /api/roadmap/ (JSON)

    Petición (application/json):

    ```json
    {
      "topic": "Aprender Python",
      "complexity_level": "beginner",
      "duration": "6 weeks",
      "include_resources": true
    }
    ```

    Respuesta (application/json):

    ```json
    {
      "roadmap": {
        "title": "Roadmap para aprender Python",
        "steps": [
          { "week": 1, "focus": "Sintaxis básica, variables, tipos" },
          { "week": 2, "focus": "Estructuras de control y funciones" }
        ]
      }
    }
    ```

    ---

    ### 8) POST /api/learning-path/generate (multipart/form-data)

    Petición (form-data) (resumen de campos):

    ```
    files: [course_material.pdf]
    difficulty: "intermediate"
    total_duration: "4 weeks"
    modules_count: 3
    sessions_per_module: 2
    topics_per_session: 2
    flashcards_per_topic: 3
    questions_per_topic: 3
    include_theory: true
    language: "Spanish"
    auto_structure: false
    learning_approach: "balanced"
    language_register: "neutral"
    detail_level: "intermediate"
    generate_full_content: false
    ```

    Respuesta (application/json) — estructura producida por `LearningPathAIClient._format_output`:

    ```json
    {
      "id": "a1b2c3d4-...",
      "title": "Ruta de Aprendizaje: Introducción a X",
      "description": "Descripción breve de la ruta",
      "totalDuration": "4 weeks",
      "difficulty": "intermediate",
      "createdAt": "2025-10-29T12:34:56Z",
      "modules": [
        {
          "id": "module_1",
          "title": "Módulo 1: Fundamentos",
          "sessions": [
            {
              "id": "module_1_session_1",
              "title": "Sesión 1",
              "topics": [ { "id": "module_1_session_1_topic_1", "title": "Tema A", "content": "..." } ],
              "flashcards": [ { "id": "module_1_session_1_flashcard_1", "question": "...", "answer": "..." } ],
              "practice": [ { "id": "module_1_session_1_question_1", "question": "...", "answer": "..." } ]
            }
          ]
        }
      ]
    }
    ```

    ---

    Notas finales
    - Estos ejemplos son plantillas demostrativas basadas en la implementación actual. Ajusta los payloads según tus necesidades y el frontend del proyecto.
