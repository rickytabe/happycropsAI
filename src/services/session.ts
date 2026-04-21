/**
 * Session Service
 * Manages user authentication state in localStorage.
 * Designed to be swapped out for a real backend/BaaS (Supabase, Firebase, etc.)
 * with minimal changes — just replace the localStorage calls with API calls.
 * Product: HappyCrops AI (happycropsai.com)
 */

const SESSION_KEY = 'happycrops_session';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  lastLoginAt: number;
}

/**
 * Persists a user session to localStorage.
 * Replace this with a real auth token/JWT storage when integrating a backend.
 */
export function saveSession(user: Omit<UserSession, 'id' | 'createdAt' | 'lastLoginAt'>): UserSession {
  const existing = getSession();
  const session: UserSession = {
    id: existing?.id ?? crypto.randomUUID(),
    name: user.name,
    email: user.email,
    createdAt: existing?.createdAt ?? Date.now(),
    lastLoginAt: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * Retrieves the current session from localStorage.
 * Replace with a JWT decode / API call to /me when integrating a backend.
 */
export function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

/**
 * Clears the user session from localStorage.
 * Replace with a real logout API call when integrating a backend.
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Quick helper: returns true if a valid session exists.
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}
