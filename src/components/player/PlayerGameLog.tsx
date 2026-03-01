import type { Player, GameRecord } from '../../types/league.ts'
import { formatDate } from '../../utils/formatters.ts'
import { describeFulfillment } from '../../utils/drinkCalc.ts'
import TeamBadge from '../shared/TeamBadge.tsx'

interface Props {
  games: GameRecord[]
  playerId: string
  players: Player[]
}

export default function PlayerGameLog({ games, playerId, players }: Props) {
  const getName = (id: string) => players.find((p) => p.id === id)?.name ?? '???'

  return (
    <div className="mb-5">
      <h3 className="section-label mb-2">Game Log</h3>
      <div className="card divide-y divide-border">
        {games.slice(0, 20).map((game) => {
          const oppId = game.player1Id === playerId ? game.player2Id : game.player1Id
          const myScore = game.player1Id === playerId ? game.score1 : game.score2
          const oppScore = game.player1Id === playerId ? game.score2 : game.score1
          const myTeam = game.player1Id === playerId ? game.team1 : game.team2
          const oppTeam = game.player1Id === playerId ? game.team2 : game.team1
          const won = game.winnerId === playerId
          const lost = game.loserId === playerId
          const isTie = game.winnerId === null

          return (
            <div key={game.id} className="flex items-center px-4 py-2.5">
              <div className={`w-7 text-[10px] font-bold font-display rounded px-1 py-0.5 text-center ${
                won ? 'bg-amber/20 text-amber' : lost ? 'bg-rose/20 text-rose' : 'bg-border text-text-muted'
              }`}>
                {won ? 'W' : lost ? 'L' : 'T'}
              </div>
              <div className="flex-1 text-sm ml-2 flex items-center gap-1 min-w-0">
                <span className="text-text-secondary">vs </span>
                <span className="font-semibold truncate">{getName(oppId)}</span>
                {myTeam && <TeamBadge abbr={myTeam} />}
                {oppTeam && (
                  <>
                    <span className="text-text-muted text-[9px]">v</span>
                    <TeamBadge abbr={oppTeam} />
                  </>
                )}
              </div>
              <div className="text-sm font-display score-display mr-3 shrink-0">
                {myScore}-{oppScore}
              </div>
              <div className="text-text-muted text-[10px] w-16 text-right shrink-0">
                {isTie ? '' : lost ? describeFulfillment(game.drinksFulfilled, game.drinksOwed) : ''}
              </div>
              <div className="text-text-muted font-display text-[10px] w-16 text-right shrink-0">{formatDate(game.timestamp)}</div>
            </div>
          )
        })}
      </div>
      {games.length > 20 && (
        <p className="text-text-muted text-xs text-center mt-2">Showing latest 20 of {games.length} games</p>
      )}
    </div>
  )
}
