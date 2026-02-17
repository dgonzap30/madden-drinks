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
}

export default function GameCard({ game, players, dispatch, onToast }: Props) {
  const getName = (id: string) => players.find((p) => p.id === id)?.name ?? '???'
  const p1Name = getName(game.player1Id)
  const p2Name = getName(game.player2Id)
  const isTie = game.winnerId === null
  const loserName = game.loserId ? getName(game.loserId) : null
  const allFulfilled = game.drinksFulfilled >= game.drinksOwed

  return (
    <div className="card px-4 py-3">
      <div className="flex items-center justify-between mb-2 pt-1">
        <div className="text-text-muted text-[10px] uppercase tracking-[0.12em] font-display">
          {formatDate(game.timestamp)}
        </div>
        <div className="text-text-muted text-[10px] font-display">
          {describeScoreGap(game.score1, game.score2)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-1">
        <div className="text-center flex-1">
          <div className={`font-semibold text-sm ${game.winnerId === game.player1Id ? 'text-accent' : game.loserId === game.player1Id ? 'text-negative' : ''}`}>
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
          <div className={`font-semibold text-sm ${game.winnerId === game.player2Id ? 'text-accent' : game.loserId === game.player2Id ? 'text-negative' : ''}`}>
            {p2Name}
          </div>
          {game.team2 && <TeamBadge abbr={game.team2} />}
        </div>
      </div>

      <div className="mt-2">
        {isTie ? (
          <div className="text-center text-text-muted text-xs">Tie — no shots</div>
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
                    className={`w-5 h-5 rounded-full transition-all hover:scale-110 ${
                      i < game.drinksFulfilled ? 'bg-highlight' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-text-muted text-[11px] font-display">{game.drinksFulfilled}/{game.drinksOwed}</span>
            </div>
            {allFulfilled && (
              <span className="text-highlight font-display font-bold text-xs">Done</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
