const KEY = 'alfa_session';

export interface StoredSession {
  assessmentId: string;
  token: string;
}

/**
 * The session token lives on the device so he can resume later. Storage can be blocked
 * (private windows, site settings), so every access is guarded and falls back to memory.
 */
let memory: StoredSession | null = null;

export function readSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StoredSession;
  } catch {
    /* storage unavailable: use the in-memory copy */
  }
  return memory;
}

export function saveSession(session: StoredSession): void {
  memory = session;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* kept in memory only */
  }
}

export function clearSession(): void {
  memory = null;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}
