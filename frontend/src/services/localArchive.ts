// Centralized localStorage archive service
// Stores summaries, flashcards, practices, and games in a single array key

export type ArchiveKind = 'summary' | 'flashcards' | 'practice' | 'game';
export type GameType = 'crossword' | 'wordsearch' | 'wordconnect' | 'explainit';

export interface ArchiveBase {
  id: number; // numeric id for easy Sidebar handling
  kind: ArchiveKind;
  title: string;
  category: string; // user-defined category/label
  dateISO: string; // ISO string for ordering
}

export interface SummaryRecordArchive extends ArchiveBase {
  kind: 'summary';
  payload: { content: string; options?: any };
}

export interface FlashcardsRecordArchive extends ArchiveBase {
  kind: 'flashcards';
  payload: { cards: any[]; options?: any };
}

export interface PracticeRecordArchive extends ArchiveBase {
  kind: 'practice';
  payload: { questions: any[]; metas?: any[]; options?: any };
}

export interface GameRecordArchive extends ArchiveBase {
  kind: 'game';
  gameType: GameType;
  payload: any; // { words: [], title?: string, difficulty?: string, extras?: any }
}

export type AnyArchive = SummaryRecordArchive | FlashcardsRecordArchive | PracticeRecordArchive | GameRecordArchive;

const STORAGE_KEY = 'app:archive:v1';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function loadAll(): AnyArchive[] {
  const arr = safeParse<AnyArchive[]>(typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null, []);
  return Array.isArray(arr) ? arr : [];
}

function saveAll(list: AnyArchive[]) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

function nextId(): number { return Date.now(); }

export const LocalArchive = {
  listAll(): AnyArchive[] {
    return loadAll().sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
  },
  listByKind<T extends AnyArchive["kind"]>(kind: T): Extract<AnyArchive, { kind: T }>[] {
    return this.listAll().filter((it) => it.kind === kind) as any;
  },
  listGames(): GameRecordArchive[] {
    return this.listByKind('game') as GameRecordArchive[];
  },
  getById(kind: ArchiveKind, id: number): AnyArchive | undefined {
    return loadAll().find((it) => it.kind === kind && it.id === id);
  },
  getGameById(id: number): GameRecordArchive | undefined {
    return (loadAll().find((it) => it.kind === 'game' && it.id === id) as GameRecordArchive | undefined);
  },
  addSummary(params: { title: string; category: string; content: string; options?: any }): SummaryRecordArchive {
    const item: SummaryRecordArchive = {
      id: nextId(),
      kind: 'summary',
      title: params.title.trim() || 'Resumen sin título',
      category: params.category.trim() || 'General',
      dateISO: new Date().toISOString(),
      payload: { content: params.content, options: params.options },
    };
    const list = loadAll(); list.push(item); saveAll(list); return item;
  },
  addFlashcards(params: { title: string; category: string; cards: any[]; options?: any }): FlashcardsRecordArchive {
    const item: FlashcardsRecordArchive = {
      id: nextId(),
      kind: 'flashcards',
      title: params.title.trim() || 'Flashcards',
      category: params.category.trim() || 'General',
      dateISO: new Date().toISOString(),
      payload: { cards: params.cards, options: params.options },
    };
    const list = loadAll(); list.push(item); saveAll(list); return item;
  },
  addPractice(params: { title: string; category: string; questions: any[]; metas?: any[]; options?: any }): PracticeRecordArchive {
    const item: PracticeRecordArchive = {
      id: nextId(),
      kind: 'practice',
      title: params.title.trim() || 'Práctica',
      category: params.category.trim() || 'General',
      dateISO: new Date().toISOString(),
      payload: { questions: params.questions, metas: params.metas, options: params.options },
    };
    const list = loadAll(); list.push(item); saveAll(list); return item;
  },
  addGame(params: { gameType: GameType; title: string; category: string; payload: any }): GameRecordArchive {
    const item: GameRecordArchive = {
      id: nextId(),
      kind: 'game',
      gameType: params.gameType,
      title: params.title.trim() || 'Juego',
      category: params.category.trim() || 'General',
      dateISO: new Date().toISOString(),
      payload: params.payload,
    };
    const list = loadAll(); list.push(item); saveAll(list); return item;
  },
  remove(kind: ArchiveKind, id: number): boolean {
    const list = loadAll();
    const idx = list.findIndex((it) => it.kind === kind && it.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    saveAll(list);
    try { window.dispatchEvent(new CustomEvent('archive:update')); } catch {}
    return true;
  },
};

export default LocalArchive;
