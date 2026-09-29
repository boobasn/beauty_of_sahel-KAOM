import type { Session } from '../../api/types'

const KEY = 'kaom.session'

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Session
    return new Date(s.expiresAt).getTime() > Date.now() ? s : null
  } catch {
    return null
  }
}

export function saveSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s))
    else localStorage.removeItem(KEY)
  } catch {
    // stockage indisponible : la session dure le temps de l'onglet
  }
}
