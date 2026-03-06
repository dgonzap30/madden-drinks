import { useState, useMemo } from 'react'
import type { LeagueState } from '../../types/league.ts'
import type { LeagueAction } from '../../state/leagueReducer.ts'
import GameCard from './GameCard.tsx'
import Toast from '../shared/Toast.tsx'

type DateRange = 'all' | 'month' | 'week'
type SortOrder = 'newest' | 'oldest'

interface Props {
  state: LeagueState
  dispatch: (action: LeagueAction) => void
}

export default function HistoryTab({ state, dispatch }: Props) {
  const [filterPlayerId, setFilterPlayerId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let games = state.games

    // Player filter
    if (filterPlayerId) {
      games = games.filter(
        (g) => g.player1Id === filterPlayerId || g.player2Id === filterPlayerId
      )
    }

    // Search by player name
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      games = games.filter((g) => {
        const p1 = state.players.find((p) => p.id === g.player1Id)?.name?.toLowerCase() ?? ''
        const p2 = state.players.find((p) => p.id === g.player2Id)?.name?.toLowerCase() ?? ''
        return p1.includes(q) || p2.includes(q)
      })
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = Date.now()
      const cutoff = dateRange === 'week'
        ? now - 7 * 24 * 60 * 60 * 1000
        : now - 30 * 24 * 60 * 60 * 1000
      games = games.filter((g) => g.timestamp >= cutoff)
    }

    // Sort
    const sorted = [...games]
    if (sortOrder === 'newest') {
      sorted.reverse()
    }

    return sorted
  }, [state.games, state.players, filterPlayerId, searchQuery, dateRange, sortOrder])

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded text-xs font-semibold font-display transition-all ${
      active
        ? 'bg-amber/20 border border-amber/40 text-amber'
        : 'bg-bg-input border border-border text-text-secondary'
    }`

  return (
    <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 pt-4 pb-28">
      <h2 className="text-xl font-bold mb-4 text-text-primary font-display tracking-wide">
        Game History
      </h2>

      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by player..."
        className="bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted w-full focus:outline-none focus:ring-1 focus:ring-amber/50 input-premium mb-3"
      />

      {/* Player filter */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setFilterPlayerId(null)}
          className={chipClass(!filterPlayerId)}
        >
          All
        </button>
        {state.players.map((p) => (
          <button
            key={p.id}
            onClick={() => setFilterPlayerId(filterPlayerId === p.id ? null : p.id)}
            className={chipClass(filterPlayerId === p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Date range + Sort */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setDateRange('all')}
          className={chipClass(dateRange === 'all')}
        >
          All Time
        </button>
        <button
          onClick={() => setDateRange('month')}
          className={chipClass(dateRange === 'month')}
        >
          This Month
        </button>
        <button
          onClick={() => setDateRange('week')}
          className={chipClass(dateRange === 'week')}
        >
          This Week
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          className="px-2 py-1.5 rounded text-xs font-semibold font-display transition-all bg-bg-input border border-border text-text-secondary hover:text-text-primary"
          title={sortOrder === 'newest' ? 'Showing newest first' : 'Showing oldest first'}
        >
          {sortOrder === 'newest' ? '↓ New' : '↑ Old'}
        </button>
      </div>

      {/* Games */}
      {filtered.length > 0 ? (
        <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          {filtered.map((game, i) => (
            <div key={game.id} className="animate-stagger-in" style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}>
              <GameCard
                game={game}
                players={state.players}
                dispatch={dispatch}
                onToast={setToast}
                onDelete={(id) => dispatch({ type: 'DELETE_GAME', gameId: id })}
              />
            </div>
          ))}
        </div>
      ) : (
        state.games.length === 0 ? (
          <div className="card-featured p-8 text-center mt-4">
            <div className="score-jumbo text-5xl text-text-muted/30 mb-4">0-0</div>
            <p className="text-text-secondary text-sm font-semibold mb-1">No games in the books</p>
            <p className="text-text-tertiary text-xs">Results will appear here after you log them</p>
          </div>
        ) : (
          <div className="text-center text-text-tertiary text-sm pt-12">
            No games found for this filter.
          </div>
        )
      )}

      <div className="text-center section-label mt-4">
        {filtered.length} game{filtered.length !== 1 ? 's' : ''}
      </div>

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  )
}
