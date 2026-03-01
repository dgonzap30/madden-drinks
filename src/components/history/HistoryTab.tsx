import { useState } from 'react'
import type { LeagueState } from '../../types/league.ts'
import type { LeagueAction } from '../../state/leagueReducer.ts'
import GameCard from './GameCard.tsx'
import Toast from '../shared/Toast.tsx'

interface Props {
  state: LeagueState
  dispatch: (action: LeagueAction) => void
}

export default function HistoryTab({ state, dispatch }: Props) {
  const [filterPlayerId, setFilterPlayerId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const filtered = filterPlayerId
    ? state.games.filter(
        (g) => g.player1Id === filterPlayerId || g.player2Id === filterPlayerId
      )
    : state.games

  const reversed = [...filtered].reverse()

  return (
    <div className="max-w-md md:max-w-2xl mx-auto px-4 pt-4 pb-24">
      <h2 className="text-xl font-bold mb-3 text-text-primary font-display tracking-wide">
        Game History
      </h2>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterPlayerId(null)}
          className={`px-3 py-1.5 rounded text-xs font-semibold font-display transition-all ${
            !filterPlayerId
              ? 'bg-amber/15 border border-amber/40 text-amber'
              : 'bg-bg-input border border-border text-text-secondary'
          }`}
        >
          All
        </button>
        {state.players.map((p) => (
          <button
            key={p.id}
            onClick={() => setFilterPlayerId(filterPlayerId === p.id ? null : p.id)}
            className={`px-3 py-1.5 rounded text-xs font-semibold font-display transition-all ${
              filterPlayerId === p.id
                ? 'bg-amber/15 border border-amber/40 text-amber'
                : 'bg-bg-input border border-border text-text-secondary'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Games */}
      {reversed.length > 0 ? (
        <div className="space-y-2">
          {reversed.map((game, i) => (
            <div key={game.id} className="animate-stagger-in" style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}>
              <GameCard game={game} players={state.players} dispatch={dispatch} onToast={setToast} />
            </div>
          ))}
        </div>
      ) : (
        state.games.length === 0 ? (
          <div className="text-center pt-16">
            <div className="score-jumbo text-5xl text-text-muted/20 mb-4">0-0</div>
            <p className="text-text-secondary text-sm font-semibold mb-1">No games in the books</p>
            <p className="text-text-muted text-xs">Results will appear here after you log them</p>
          </div>
        ) : (
          <div className="text-center text-text-muted text-sm pt-12">
            No games found for this player.
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
