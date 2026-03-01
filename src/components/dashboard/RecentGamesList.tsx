import type { Player, GameRecord } from '../../types/league.ts'
import { formatRelativeTime } from '../../utils/formatters.ts'
import TeamBadge from '../shared/TeamBadge.tsx'

interface Props {
  games: GameRecord[]
  players: Player[]
}

export default function RecentGamesList({ games, players }: Props) {
  const getName = (id: string) => players.find((p) => p.id === id)?.name ?? '???'

  return (
    <div className="mb-5">
      <h3 className="section-label mb-2">Recent Games</h3>
      <div className="space-y-2">
        {games.map((game, i) => {
          const p1Name = getName(game.player1Id)
          const p2Name = getName(game.player2Id)
          const isTie = game.winnerId === null
          const loserName = game.loserId ? getName(game.loserId) : null
          const allFulfilled = game.drinksFulfilled >= game.drinksOwed

          return (
            <div key={game.id} className="card px-4 py-3 animate-card-enter" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className={`font-semibold text-sm ${game.winnerId === game.player1Id ? 'text-amber' : game.loserId === game.player1Id ? 'text-rose' : ''}`}>
                    {p1Name}
                  </span>
                  {game.team1 && <TeamBadge abbr={game.team1} />}
                  <span className="score-jumbo text-2xl mx-1">
                    {game.score1}
                  </span>
                  <span className="text-text-muted text-xs font-semibold">vs</span>
                  <span className="score-jumbo text-2xl mx-1">
                    {game.score2}
                  </span>
                  {game.team2 && <TeamBadge abbr={game.team2} />}
                  <span className={`font-semibold text-sm ${game.winnerId === game.player2Id ? 'text-amber' : game.loserId === game.player2Id ? 'text-rose' : ''}`}>
                    {p2Name}
                  </span>
                </div>
                <div className="text-text-muted text-[10px] shrink-0 ml-2">{formatRelativeTime(game.timestamp)}</div>
              </div>
              {!isTie && loserName && game.drinksOwed > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-text-secondary text-xs">
                    {loserName} owes {game.drinksOwed} {game.drinksOwed === 1 ? 'shot' : 'shots'}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: game.drinksOwed }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < game.drinksFulfilled ? 'bg-whiskey' : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                  {allFulfilled && (
                    <span className="text-whiskey text-[10px] font-semibold">Done</span>
                  )}
                </div>
              )}
              {isTie && (
                <div className="text-text-muted text-xs mt-1">Tie — no shots</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
