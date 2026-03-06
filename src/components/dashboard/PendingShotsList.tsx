import { useState } from 'react'
import type { LeagueState, GameRecord } from '../../types/league.ts'
import type { LeagueAction } from '../../state/leagueReducer.ts'
import { computeMatchupBalance, type MatchupBalance } from '../../utils/leagueStats.ts'
import { formatRelativeTime } from '../../utils/formatters.ts'

interface Props {
  state: LeagueState
  dispatch: (action: LeagueAction) => void
}

interface CreditorSubGroup {
  creditorId: string
  creditorName: string
  totalPending: number
  balance: MatchupBalance
  games: {
    game: GameRecord
    pending: number
  }[]
}

interface DebtorGroup {
  playerId: string
  playerName: string
  totalPending: number
  creditors: CreditorSubGroup[]
}

export default function PendingShotsList({ state, dispatch }: Props) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)

  const getName = (id: string) => state.players.find((p) => p.id === id)?.name ?? '???'

  // Filter to games with pending shots
  const pendingGames = state.games.filter(
    (g) => g.loserId && g.drinksOwed > 0 && g.drinksFulfilled < g.drinksOwed
  )

  if (pendingGames.length === 0) return null

  // Build nested map: debtor -> creditor -> games
  const nestedMap = new Map<string, Map<string, { game: GameRecord; pending: number }[]>>()

  for (const game of pendingGames) {
    const debtorId = game.loserId!
    const creditorId = game.winnerId!
    const pending = game.drinksOwed - game.drinksFulfilled

    if (!nestedMap.has(debtorId)) nestedMap.set(debtorId, new Map())
    const creditorMap = nestedMap.get(debtorId)!

    if (!creditorMap.has(creditorId)) creditorMap.set(creditorId, [])
    creditorMap.get(creditorId)!.push({ game, pending })
  }

  // Convert to sorted DebtorGroup array
  const debtors: DebtorGroup[] = [...nestedMap.entries()]
    .map(([debtorId, creditorMap]) => {
      const creditors: CreditorSubGroup[] = [...creditorMap.entries()].map(([creditorId, games]) => {
        const totalPending = games.reduce((sum, g) => sum + g.pending, 0)
        const balance = computeMatchupBalance(debtorId, creditorId, state.games)
        return {
          creditorId,
          creditorName: getName(creditorId),
          totalPending,
          balance,
          games: games.sort((a, b) => b.game.timestamp - a.game.timestamp),
        }
      })
      creditors.sort((a, b) => b.totalPending - a.totalPending)

      return {
        playerId: debtorId,
        playerName: getName(debtorId),
        totalPending: creditors.reduce((sum, c) => sum + c.totalPending, 0),
        creditors,
      }
    })
    .sort((a, b) => b.totalPending - a.totalPending)

  return (
    <div className="mb-6">
      <h3 className="section-label-lg mb-2">Outstanding Shots</h3>
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
                  <span className="text-text-tertiary text-xs">owes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="score-jumbo text-xl text-whiskey">{debtor.totalPending}</span>
                  <span className="text-text-tertiary text-xs">{debtor.totalPending === 1 ? 'shot' : 'shots'}</span>
                  <svg
                    className={`w-4 h-4 text-text-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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

              {/* Expanded: creditor-grouped breakdown */}
              {isExpanded && (
                <div className="border-t border-border">
                  {debtor.creditors.map((creditor) => {
                    const canBank = creditor.balance.bankableCount > 0
                    return (
                      <div key={creditor.creditorId} className="border-b border-border last:border-b-0">
                        {/* Creditor sub-header */}
                        <div className="px-4 py-2 flex items-center justify-between bg-bg-primary/30">
                          <div className="flex items-center gap-1.5">
                            <span className="text-whiskey text-xs">&#8594;</span>
                            <span className="text-text-secondary text-xs font-medium">{creditor.creditorName}</span>
                          </div>
                          <span className="text-text-tertiary text-[11px] font-display">
                            {creditor.totalPending} {creditor.totalPending === 1 ? 'shot' : 'shots'}
                          </span>
                        </div>

                        {/* Game rows under this creditor */}
                        {creditor.games.map(({ game }) => {
                          const drunk = game.drinksFulfilled - game.drinksBanked
                          const banked = game.drinksBanked

                          return (
                            <div key={game.id} className="pl-7 pr-4 py-2.5 border-t border-border/50">
                              <div className="flex items-center justify-between">
                                <span className="text-text-tertiary text-[10px] shrink-0">
                                  {formatRelativeTime(game.timestamp)}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {/* Drunk shots (whiskey) */}
                                  {Array.from({ length: drunk }).map((_, i) => (
                                    <button
                                      key={`d-${i}`}
                                      onClick={() => dispatch({ type: 'UNFULFILL_DRINK', gameId: game.id })}
                                      className="w-5 h-5 rounded-full transition-all hover:scale-110 active:scale-90 bg-whiskey shadow-[0_0_6px_-1px] shadow-whiskey-glow"
                                    />
                                  ))}
                                  {/* Banked shots (muted with B) */}
                                  {Array.from({ length: banked }).map((_, i) => (
                                    <button
                                      key={`b-${i}`}
                                      onClick={() => {
                                        const counterGame = state.games
                                          .filter((g) => g.loserId === creditor.creditorId && g.winnerId === debtor.playerId && g.drinksBanked > 0)
                                          .sort((a, b) => b.timestamp - a.timestamp)[0]
                                        if (counterGame) {
                                          dispatch({ type: 'UNBANK_DRINK', loserGameId: game.id, counterpartGameId: counterGame.id })
                                        }
                                      }}
                                      className="w-5 h-5 rounded-full transition-all hover:scale-110 active:scale-90 bg-text-muted/40 ring-1 ring-text-muted/60 flex items-center justify-center"
                                      title="Banked — click to undo"
                                    >
                                      <span className="text-[8px] font-bold text-text-tertiary leading-none">B</span>
                                    </button>
                                  ))}
                                  {/* Pending shots (unfulfilled) */}
                                  {Array.from({ length: game.drinksOwed - game.drinksFulfilled }).map((_, i) => (
                                    <button
                                      key={`p-${i}`}
                                      onClick={() => dispatch({ type: 'FULFILL_DRINK', gameId: game.id })}
                                      className="w-5 h-5 rounded-full transition-all hover:scale-110 active:scale-90 bg-border hover:bg-border-bright"
                                    />
                                  ))}
                                  <span className="text-text-tertiary text-[10px] font-display ml-0.5">
                                    {game.drinksFulfilled}/{game.drinksOwed}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}

                        {/* Bank action at creditor level */}
                        {canBank && (
                          <div className="pl-7 pr-4 py-2 border-t border-border/50">
                            <button
                              onClick={() => {
                                // FIFO: pick oldest unfulfilled game (balance.aLostGames is already sorted oldest-first)
                                const loserGame = creditor.balance.aLostGames.find(g => g.drinksFulfilled < g.drinksOwed)
                                const counterGame = creditor.balance.bLostGames[0]
                                if (loserGame && counterGame) {
                                  dispatch({ type: 'BANK_DRINK', loserGameId: loserGame.id, counterpartGameId: counterGame.id })
                                }
                              }}
                              className="text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors"
                            >
                              Bank against {creditor.creditorName}'s debt ({creditor.balance.bOwesA} pending)
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {/* Bulk action footer */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch({ type: 'BULK_FULFILL_DRINKS', loserId: debtor.playerId })
                    }}
                    className="w-full px-4 py-2.5 text-xs text-amber hover:bg-amber/[0.06] transition-colors font-medium border-t border-border text-center"
                  >
                    Mark all {debtor.totalPending} shots as done
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
