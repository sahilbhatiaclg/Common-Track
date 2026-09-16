export const STORAGE_KEY = 'common-track:v1'

export function emptyState() {
  return {
    version: 1,
    preferences: { displayName: '', theme: 'light' },
    subjects: [],
    units: [],
    topics: [],
    tasks: [],
    goals: [],
    events: [],
  }
}

export function newId() {
  return crypto.randomUUID()
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    return {
      ...emptyState(),
      ...parsed,
      preferences: { ...emptyState().preferences, ...parsed.preferences },
    }
  } catch {
    return emptyState()
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
