import { useState } from 'react'
import { getRecentLeagues, removeRecentLeague, type RecentLeague } from '../utils/recentLeagues'

interface LobbyProps {
  onJoin: (room: string) => void
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  return Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function Lobby({ onJoin }: LobbyProps) {
  const [joinCode, setJoinCode] = useState('')
  const [createdRoom, setCreatedRoom] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [recentLeagues, setRecentLeagues] = useState<RecentLeague[]>(getRecentLeagues)

  const createRoom = () => {
    const code = generateRoomCode()
    window.history.replaceState(null, '', `?room=${code}`)
    setCreatedRoom(code)
    onJoin(code)
  }

  const joinRoom = () => {
    const code = joinCode.trim().toUpperCase()
    if (code.length < 2) return
    window.history.replaceState(null, '', `?room=${code}`)
    onJoin(code)
  }

  const rejoin = (room: string) => {
    window.history.replaceState(null, '', `?room=${room}`)
    onJoin(room)
  }

  const dismiss = (e: React.MouseEvent, room: string) => {
    e.stopPropagation()
    removeRecentLeague(room)
    setRecentLeagues(getRecentLeagues())
  }

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${createdRoom}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 relative">
      {/* Ambient spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-sm md:max-w-md lg:max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0ms' }}>
          <h1 className="text-5xl font-display font-black uppercase tracking-wide text-gradient-gold">
            Madden Drinks
          </h1>
          <p className="section-label text-amber-muted mt-2">
            Lifetime Drinking Game Tracker
          </p>
          <p className="text-text-secondary text-xs italic mt-1">
            Lose the game. Take the drinks. Forever tracked.
          </p>
        </div>

        {/* Recent Leagues */}
        {recentLeagues.length > 0 && (
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
            <p className="section-label mb-2">
              Recent Leagues
            </p>
            <div className="space-y-2">
              {recentLeagues.map((league) => (
                <button
                  key={league.room}
                  onClick={() => rejoin(league.room)}
                  className="card-interactive w-full flex items-center gap-3 px-4 py-3 border-l-[3px] border-l-amber/50 hover:border-l-amber transition-all group text-left"
                >
                  <span className="font-display font-bold tracking-[0.2em] text-amber text-sm">
                    {league.room}
                  </span>
                  <span className="flex-1 text-text-primary text-sm font-semibold truncate">
                    {league.name || 'Unnamed League'}
                  </span>
                  <span className="text-text-tertiary text-[11px] shrink-0">
                    {timeAgo(league.lastVisited)}
                  </span>
                  <span
                    onClick={(e) => dismiss(e, league.room)}
                    className="text-text-muted hover:text-rose text-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    role="button"
                    aria-label="Remove"
                  >
                    &times;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Create League */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <button
            onClick={createRoom}
            className="w-full h-14 rounded-xl btn-shimmer text-bg-primary font-display text-lg font-bold transition-all active:scale-[0.98] shadow-[0_0_24px_-6px] shadow-amber-glow mb-4"
          >
            Create League
          </button>
        </div>

        {/* Room code display after creation */}
        {createdRoom && (
          <div className="mb-4 p-4 card-featured animate-slide-up">
            <p className="section-label mb-2">League Code</p>
            <p className="text-3xl tracking-[0.3em] text-gradient-gold mb-3 font-display font-bold">
              {createdRoom}
            </p>
            <button
              onClick={copyLink}
              className="text-xs text-text-secondary hover:text-amber transition-colors px-4 py-1.5 rounded-xl border border-border hover:border-amber/40"
            >
              {copied ? 'Copied!' : 'Copy invite link'}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="border-t divider-warm" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-primary section-label px-3">
            or join
          </span>
        </div>

        {/* Join Room */}
        <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
            placeholder="League code"
            className="flex-1 h-12 px-4 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 focus:ring-1 focus:ring-amber/30 input-premium transition-all text-center font-display tracking-[0.3em] uppercase"
            style={{ fontSize: '16px' }}
            maxLength={6}
          />
          <button
            onClick={joinRoom}
            disabled={joinCode.trim().length < 2}
            className="h-12 px-6 rounded-xl bg-amber text-bg-primary font-bold disabled:opacity-20 transition-all active:scale-95"
          >
            Join
          </button>
        </div>

        <p className="mt-10 text-text-tertiary text-[11px] animate-slide-up" style={{ animationDelay: '400ms' }}>
          1-score game = 1 drink &middot; 2-score game = 2 drinks
        </p>
      </div>
    </div>
  )
}
