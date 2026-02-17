const STORAGE_KEY = 'madden-drinks-recent-leagues'
const MAX_RECENT = 10

export interface RecentLeague {
  room: string
  name: string | null
  lastVisited: number
}

export function getRecentLeagues(): RecentLeague[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as RecentLeague[]
  } catch {
    return []
  }
}

export function saveRecentLeague(room: string, name: string | null) {
  const leagues = getRecentLeagues().filter((l) => l.room !== room)
  leagues.unshift({ room, name, lastVisited: Date.now() })
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(leagues.slice(0, MAX_RECENT))
  )
}

export function removeRecentLeague(room: string) {
  const leagues = getRecentLeagues().filter((l) => l.room !== room)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leagues))
}
