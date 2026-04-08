const STORAGE_KEY = 'voco_boards';

/**
 * Serialize user-modified boards to localStorage.
 * @param {{ byId: object, allIds: string[] }} boards
 */
export function saveBoardsToStorage(boards) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch {
    // Silently ignore write errors (e.g. private browsing quota)
  }
}

/**
 * Read user-modified boards from localStorage.
 * @returns {{ byId: object, allIds: string[] } | null}
 */
export function readBoardsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
