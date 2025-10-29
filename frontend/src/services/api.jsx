// @ts-check

/** @typedef {import('../types/SummaryPromptType').SummaryPromptRequest} SummaryPromptRequest */
/** @typedef {import('../types/SummaryPromptType').SummaryResponse} SummaryResponse */

/**
 * Build FormData for summarize endpoint.
 * @param {SummaryPromptRequest} payload
 */
function buildSummaryFormData(payload) {
  const form = new FormData();

  const files = Array.from(payload.files);
  if (!files.length) {
    throw new Error('Se requiere al menos un archivo PDF en "files".');
  }
  for (const f of files) {
    form.append('files', f, f.name);
  }

  if (payload.character) form.append('character', payload.character);
  if (payload.languaje_register) form.append('languaje_register', payload.languaje_register);
  if (payload.language) {
    form.append('language', payload.language);
  }
  if (payload.extension) form.append('extension', payload.extension);

  if (payload.include_references !== undefined) {
    form.append('include_references', payload.include_references ? 'true' : 'false');
  }
  if (payload.include_examples !== undefined) {
    form.append('include_examples', payload.include_examples ? 'true' : 'false');
  }
  if (payload.include_conclusions !== undefined) {
    form.append('include_conclusions', payload.include_conclusions ? 'true' : 'false');
  }

  return form;
}

/**
 * Build FormData for flashcards endpoint /api/flashcard/
 * @param {{ files: File[]; flashcards_count: number; difficulty_level: string; focus_area: string }} payload
 */
function buildFlashcardsFormData(payload) {
  const form = new FormData();
  const files = Array.from(payload.files ?? []);
  for (const f of files) {
    form.append('files', f, f.name);
  }
  form.append('flashcards_count', String(payload.flashcards_count));
  form.append('difficulty_level', payload.difficulty_level);
  form.append('focus_area', payload.focus_area);
  return form;
}

/**
 * POST /api/summarize/
 * @param {SummaryPromptRequest} payload
 * @param {{ baseUrl?: string, signal?: AbortSignal }=} options
 * @returns {Promise<SummaryResponse>}
 */
async function summarize(payload, options = {}) {
  const base = options.baseUrl ?? BASE_URL;
  const url = `${base}/api/summarize/`;

  const body = buildSummaryFormData(payload);

  const res = await fetch(url, {
    method: 'POST',
    body,
    // Do not set Content-Type; browser sets proper multipart boundary
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const msg = text || `Error ${res.status} al llamar ${url}`;
    throw new Error(msg);
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return /** @type {any} */ (await res.json());
  }
  // Fallback: return raw text or blob if server doesn't send JSON
  try {
    return /** @type {any} */ (await res.json());
  } catch {
    return /** @type {any} */ (await res.text());
  }
}

/**
 * POST /api/flashcard/ with FormData
 * @param {{ files: File[]; flashcards_count: number; difficulty_level: string; focus_area: string }} payload
 * @param {{ baseUrl?: string, signal?: AbortSignal }=} options
 */
async function flashcardsFromFiles(payload, options = {}) {
  const base = options.baseUrl ?? BASE_URL;
  const url = `${base}/api/flashcard/`;
  const form = buildFlashcardsFormData(payload);

  console.log('FC - POST URL:', url);
  console.log('FC - FormData entries:');
  form.forEach((v, k) => {
    if (v instanceof File) {
      console.log('  -', k, { name: v.name, size: v.size, type: v.type });
    } else {
      console.log('  -', k, v);
    }
  });

  const res = await fetch(url, { method: 'POST', body: form, signal: options.signal });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Error ${res.status} al llamar ${url}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

/**
 * POST /api/flashcard/by_topic with JSON
 * @param {{ topic: string; flashcards_count: number; difficulty_level: string; focus_area: string }} payload
 * @param {{ baseUrl?: string, signal?: AbortSignal }=} options
 */
async function flashcardsByTopic(payload, options = {}) {
  const base = options.baseUrl ?? BASE_URL;
  const url = `${base}/api/flashcard/by_topic`;

  console.log('FC - POST URL:', url);
  console.log('FC - JSON payload:', payload);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: options.signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Error ${res.status} al llamar ${url}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

/**
 * POST /api/games/ (word_search)
 * @param {{ topic: string; language: string }} payload
 * @param {{ baseUrl?: string, signal?: AbortSignal }=} options
 * @returns {Promise<any>}
 */
async function createWordSearchGame(payload, options = {}) {
  const base = options.baseUrl ?? BASE_URL;
  const url = `${base}/api/games/`;
  const body = {
    topic: payload.topic,
    game_type: 'word_search',
    language: payload.language,
  };

  console.log('WS - POST URL:', url);
  console.log('WS - JSON payload:', body);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('WS - Error response:', text || res.status);
    throw new Error(text || `Error ${res.status} al llamar ${url}`);
  }

  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await res.json() : await res.text();

  console.log('WS - Response:', data);
  return data;
}

export const BASE_URL = 'https://learngo-plum.vercel.app'; // e.g.

export const Api = {
  summarize,
  buildSummaryFormData,
  flashcardsFromFiles,
  flashcardsByTopic,
  buildFlashcardsFormData,
  createWordSearchGame,
  createCrosswordGame,
  // Exercises
  generateExercisesFromFiles,
  generateExercisesByTopic,
  buildExercisesFormData,
};

// Export nombrado adicional para evitar shape-mismatch al importar
export { createWordSearchGame, createCrosswordGame };

/**
 * Build FormData for exercises endpoint /api/generate-exercises/
 * @param {{ files: File[]; exercises_count: number; exercises_difficulty: string; exercises_types: string }} payload
 */
function buildExercisesFormData(payload) {
  const form = new FormData();
  const files = Array.from(payload.files ?? []);
  for (const f of files) {
    form.append('files', f, f.name);
  }
  if (payload.exercises_count != null) form.append('exercises_count', String(payload.exercises_count));
  if (payload.exercises_difficulty) form.append('exercises_difficulty', payload.exercises_difficulty);
  if (payload.exercises_types) form.append('exercises_types', payload.exercises_types);
  return form;
}

/**
 * POST /api/generate-exercises/ with FormData (used when files are provided)
 * @param {{ files: File[]; exercises_count: number; exercises_difficulty: string; exercises_types: string }} payload
 * @param {{ baseUrl?: string, signal?: AbortSignal }=} options
 */
async function generateExercisesFromFiles(payload, options = {}) {
  const base = options.baseUrl ?? BASE_URL;
  const url = `${base}/api/generate-exercises/`;
  const form = buildExercisesFormData(payload);

  console.log('EX - POST URL:', url);
  console.log('EX - FormData entries:');
  form.forEach((v, k) => {
    if (v instanceof File) {
      console.log('  -', k, { name: v.name, size: v.size, type: v.type });
    } else {
      console.log('  -', k, v);
    }
  });

  const res = await fetch(url, { method: 'POST', body: form, signal: options.signal });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Error ${res.status} al llamar ${url}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

/**
 * POST /api/generate-exercises/by_topic with JSON (used when no files)
 * @param {{ topic: string; exercises_count: number; exercises_difficulty: string; exercises_types: string }} payload
 * @param {{ baseUrl?: string, signal?: AbortSignal }=} options
 */
async function generateExercisesByTopic(payload, options = {}) {
  const base = options.baseUrl ?? BASE_URL;
  const url = `${base}/api/generate-exercises/by_topic`;

  console.log('EX - POST URL:', url);
  console.log('EX - JSON payload:', payload);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: options.signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Error ${res.status} al llamar ${url}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

/**
 * POST /api/games/ (crossword)
 * @param {{ topic: string; language: string }} payload
 * @param {{ baseUrl?: string, signal?: AbortSignal }=} options
 * @returns {Promise<any>}
 */
async function createCrosswordGame(payload, options = {}) {
  const base = options.baseUrl ?? BASE_URL;
  const url = `${base}/api/games/`;
  const body = {
    topic: payload.topic,
    game_type: 'crossword',
    language: payload.language,
  };

  console.log('CW - POST URL:', url);
  console.log('CW - JSON payload:', body);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('CW - Error response:', text || res.status);
    throw new Error(text || `Error ${res.status} al llamar ${url}`);
  }

  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await res.json() : await res.text();

  console.log('CW - Response:', data);
  return data;
}
