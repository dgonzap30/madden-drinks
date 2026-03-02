import { useState } from 'react'
import type { Player, GameRecord } from '../../types/league.ts'
import type { LeagueAction } from '../../state/leagueReducer.ts'
import { formatDate } from '../../utils/formatters.ts'
import { describeScoreGap } from '../../utils/drinkCalc.ts'
import TeamBadge from '../shared/TeamBadge.tsx'

interface Props {
  game: GameRecord
  players: Player[]
  dispatch: (action: LeagueAction) => void
  onToast?: (msg: string) => void
  onDelete?: (gameId: string) => void
}

export default function GameCard({ game, players, dispatch, onToast, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const getName = (id: string) => players.find((p) => p.id === id)?.name ?? '???'
  const p1Name = getName(game.player1Id)
  const p2Name = getName(game.player2Id)
  const isTie = game.winnerId === null
  const loserName = game.loserId ? getName(game.loserId) : null
  const allFulfilled = game.drinksFulfilled >= game.drinksOwed

  return (
    <div className="card px-4 py-3 relative">
      <div className="flex items-center justify-between mb-2 pt-1">
        <div className="text-text-tertiary text-[10px] uppercase tracking-[0.12em] font-display">
          {formatDate(game.timestamp)}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-text-tertiary text-[10px] font-display">
            {describeScoreGap(game.score1, game.score2)}
          </div>
          {onDelete && (
            <button
              onClick={() => {
                if (confirmDelete) {
                  onDelete(game.id)
                } else {
                  setConfirmDelete(true)
                  setTimeout(() => setConfirmDelete(false), 3000)
                }
              }}
              className={`text-xs font-display transition-colors ${
                confirmDelete
                  ? 'text-rose font-semibold'
                  : 'text-text-muted hover:text-rose'
              }`}
            >
              {confirmDelete ? 'Delete?' : '×'}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-1">
        <div className="text-center flex-1">
          <div className={`font-semibold text-sm ${game.winnerId === game.player1Id ? 'text-amber' : game.loserId === game.player1Id ? 'text-rose' : ''}`}>
            {p1Name}
          </div>
          {game.team1 && <TeamBadge abbr={game.team1} />}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="score-jumbo text-3xl">{game.score1}</span>
          <span className="text-text-muted font-display text-sm">-</span>
          <span className="score-jumbo text-3xl">{game.score2}</span>
        </div>

        <div className="text-center flex-1">
          <div className={`font-semibold text-sm ${game.winnerId === game.player2Id ? 'text-amber' : game.loserId === game.player2Id ? 'text-rose' : ''}`}>
            {p2Name}
          </div>
          {game.team2 && <TeamBadge abbr={game.team2} />}
        </div>
      </div>

      <div className="mt-2">
        {isTie ? (
          <div className="text-center text-text-tertiary text-xs">Tie — no shots</div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-xs">
                {loserName} owes {game.drinksOwed} {game.drinksOwed === 1 ? 'shot' : 'shots'}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: game.drinksOwed }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i < game.drinksFulfilled) {
                        dispatch({ type: 'UNFULFILL_DRINK', gameId: game.id })
                        onToast?.('Shot unmarked')
                      } else {
                        dispatch({ type: 'FULFILL_DRINK', gameId: game.id })
                        onToast?.('Shot marked')
                      }
                    }}
                    className={`w-6 h-6 rounded-full transition-all hover:scale-110 active:scale-90 ${
                      i < game.drinksFulfilled
                        ? 'bg-whiskey shadow-[0_0_6px_-1px] shadow-whiskey-glow'
                        : 'bg-border hover:bg-border-bright'
                    }`}
                  />
                ))}
              </div>
              <span className="text-text-tertiary text-[11px] font-display">{game.drinksFulfilled}/{game.drinksOwed}</span>
            </div>
            {allFulfilled && (
              <span className="text-whiskey font-display font-bold text-xs">Done</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
