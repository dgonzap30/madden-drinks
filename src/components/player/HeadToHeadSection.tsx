import type { HeadToHeadStats } from '../../types/league.ts'
import { formatRecord } from '../../utils/formatters.ts'

interface Props {
  playerName: string
  h2hStats: HeadToHeadStats[]
}

export default function HeadToHeadSection({ playerName, h2hStats }: Props) {
  return (
    <div className="mb-5">
      <h3 className="section-label mb-2">Head to Head</h3>
      <div className="card divide-y divide-border">
        {h2hStats.map((h2h) => {
          const oppName = h2h.player1Name === playerName ? h2h.player2Name : h2h.player1Name
          const myWins = h2h.player1Name === playerName ? h2h.player1Wins : h2h.player2Wins
          const oppWins = h2h.player1Name === playerName ? h2h.player2Wins : h2h.player1Wins
          const myDrinksGiven = h2h.player1Name === playerName ? h2h.player1DrinksGiven : h2h.player2DrinksGiven
          const oppDrinksGiven = h2h.player1Name === playerName ? h2h.player2DrinksGiven : h2h.player1DrinksGiven
          const total = myWins + oppWins + h2h.ties

          return (
            <div key={`${h2h.player1Id}-${h2h.player2Id}`} className="px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">vs {oppName}</span>
                <span className={`text-sm font-bold font-display score-display ${
                  myWins > oppWins ? 'text-amber' : myWins < oppWins ? 'text-rose' : 'text-text-primary'
                }`}>
                  {formatRecord(myWins, oppWins, h2h.ties)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-text-muted text-[10px]">
                <span>Given: {myDrinksGiven}</span>
                <span>&middot;</span>
                <span>Taken: {oppDrinksGiven}</span>
                <span>&middot;</span>
                <span>{h2h.games.length} games</span>
              </div>
              {total > 0 && (
                <div className="flex h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber transition-all" style={{ width: `${(myWins / total) * 100}%` }} />
                  {h2h.ties > 0 && <div className="bg-text-muted transition-all" style={{ width: `${(h2h.ties / total) * 100}%` }} />}
                  <div className="bg-rose transition-all" style={{ width: `${(oppWins / total) * 100}%` }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
