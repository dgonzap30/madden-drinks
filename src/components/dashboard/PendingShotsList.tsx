import { useState } from 'react'
import type { LeagueState, GameRecord } from '../../types/league.ts'
import type { LeagueAction } from '../../state/leagueReducer.ts'
import { formatRelativeTime } from '../../utils/formatters.ts'

interface Props {
  state: LeagueState
  dispatch: (action: LeagueAction) => void
}

interface DebtorGroup {
  playerId: string
  playerName: string
  totalPending: number
  games: {
    game: GameRecord
    winnerName: string
    pending: number
  }[]
}

export default function PendingShotsList({ state, dispatch }: Props) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)

  const getName = (id: string) => state.players.find((p) => p.id === id)?.name ?? '???'

  // Group pending shots by debtor (loser)
  const pendingGames = state.games.filter(
    (g) => g.loserId && g.drinksOwed > 0 && g.drinksFulfilled < g.drinksOwed
  )

  if (pendingGames.length === 0) return null

  const grouped: Map<string, DebtorGroup> = new Map()

  for (const game of pendingGames) {
    const debtorId = game.loserId!
    const winnerId = game.winnerId!
    const pending = game.drinksOwed - game.drinksFulfilled

    if (!grouped.has(debtorId)) {
      grouped.set(debtorId, {
        playerId: debtorId,
        playerName: getName(debtorId),
        totalPending: 0,
        games: [],
      })
    }

    const group = grouped.get(debtorId)!
    group.totalPending += pending
    group.games.push({
      game,
      winnerName: getName(winnerId),
      pending,
    })
  }

  const debtors = [...grouped.values()].sort((a, b) => b.totalPending - a.totalPending)

  return (
    <div className="mb-5">
      <h3 className="section-label mb-2">Outstanding Shots</h3>
      <div className="space-y-2">
        {debtors.map((debtor) => {
          const isExpanded = expandedPlayer === debtor.playerId
          return (
            <div key={debtor.playerId} className="card overflow-hidden border-l-[3px] border-l-whiskey/60">
              {/* Summary row */}
              <button
                onClick={() => setExpandedPlayer(isExpanded ? null : debtor.playerId)}
                className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-bg-surface-hover text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-text-primary">{debtor.playerName}</span>
                  <span className="text-text-muted text-xs">owes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="score-jumbo text-xl text-whiskey">{debtor.totalPending}</span>
                  <span className="text-text-muted text-xs">{debtor.totalPending === 1 ? 'shot' : 'shots'}</span>
                  <svg
                    className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </div>
              </button>

              {/* Expanded game breakdown */}
              {isExpanded && (
                <div className="border-t border-border">
                  {debtor.games.map(({ game, winnerName }) => (
                    <div key={game.id} className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-b-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-text-secondary text-xs truncate">
                          vs {winnerName}
                        </span>
                        <span className="text-text-muted text-[10px] shrink-0">
                          {formatRelativeTime(game.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {Array.from({ length: game.drinksOwed }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (i < game.drinksFulfilled) {
                                dispatch({ type: 'UNFULFILL_DRINK', gameId: game.id })
                              } else {
                                dispatch({ type: 'FULFILL_DRINK', gameId: game.id })
                              }
                            }}
                            className={`w-5 h-5 rounded-full transition-all hover:scale-110 active:scale-90 ${
                              i < game.drinksFulfilled
                                ? 'bg-whiskey shadow-[0_0_6px_-1px] shadow-whiskey-glow'
                                : 'bg-border hover:bg-border-bright'
                            }`}
                          />
                        ))}
                        <span className="text-text-muted text-[10px] font-display ml-0.5">
                          {game.drinksFulfilled}/{game.drinksOwed}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
