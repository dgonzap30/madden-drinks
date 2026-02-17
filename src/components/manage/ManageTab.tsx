import { useState } from 'react'
import type { LeagueState } from '../../types/league.ts'
import type { LeagueAction } from '../../state/leagueReducer.ts'
import AddPlayerForm from './AddPlayerForm.tsx'

interface Props {
  state: LeagueState
  roomId: string
  dispatch: (action: LeagueAction) => void
}

export default function ManageTab({ state, roomId, dispatch }: Props) {
  const [copied, setCopied] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const undoLast = () => {
    dispatch({ type: 'UNDO_LAST_GAME' })
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-4 pb-24">
      <h2 className="text-xl font-display font-bold mb-4 text-text-primary">
        Manage
      </h2>

      {/* League Code */}
      <div className="card p-4 mb-4">
        <div className="section-label mb-2">League Code</div>
        <div className="flex items-center gap-3">
          <span
            className="score-jumbo text-3xl tracking-[0.3em] text-highlight"
            style={{ boxShadow: '0 0 12px -2px var(--color-highlight-glow)' }}
          >
            {roomId}
          </span>
          <button
            onClick={copyLink}
            className="text-xs font-display text-text-secondary hover:text-accent transition-colors px-3 py-1 rounded border border-border hover:border-accent/40"
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>

      {/* Player Roster */}
      <div className="mb-4">
        <h3 className="section-label mb-2">
          Players ({state.players.length})
        </h3>
        <div className="space-y-1.5 mb-3">
          {state.players.map((p) => {
            const hasGames = state.games.some(
              (g) => g.player1Id === p.id || g.player2Id === p.id
            )
            return (
              <div key={p.id} className="flex items-center justify-between px-4 py-2.5 card">
                <span className="font-semibold text-sm">{p.name}</span>
                {!hasGames && (
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_PLAYER', playerId: p.id })}
                    className="text-text-muted hover:text-negative transition-colors text-lg leading-none"
                  >
                    &times;
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <AddPlayerForm dispatch={dispatch} />
      </div>

      {/* Undo Last Game */}
      {state.games.length > 0 && (
        <div className="mb-4">
          <button
            onClick={undoLast}
            className="w-full h-11 rounded-md bg-bg-input border border-border text-text-secondary text-sm font-display font-semibold hover:border-highlight/40 hover:text-highlight transition-all active:scale-[0.98]"
          >
            Undo Last Game
          </button>
          <p className="text-text-muted text-[10px] text-center mt-1">
            Remove the most recently logged game
          </p>
        </div>
      )}

      {/* Danger Zone */}
      <div className="mt-8">
        <div className="relative mb-3">
          <div className="border-t border-border" />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-primary text-negative section-label px-2"
            style={{ textShadow: '0 0 8px var(--color-negative-glow)' }}
          >
            Danger Zone
          </span>
        </div>
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="w-full h-11 rounded-md border border-negative/30 text-negative text-sm font-semibold hover:bg-negative/10 transition-all"
          >
            Reset League
          </button>
        ) : (
          <div className="p-4 rounded-md border border-negative/30 bg-negative/5">
            <p className="text-sm text-text-secondary mb-3">
              This will delete all players, games, and stats. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 h-10 rounded-md bg-bg-input border border-border text-text-secondary font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => dispatch({ type: 'RESET_LEAGUE' })}
                className="flex-1 h-10 rounded-md bg-negative text-white font-display font-bold text-sm"
              >
                Delete Everything
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
