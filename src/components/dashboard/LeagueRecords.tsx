import type { Player, GameRecord } from '../../types/league.ts'

interface Props {
  records: {
    biggestBlowout: GameRecord | null
    highestScoringGame: GameRecord | null
    longestStreakHolder: { playerId: string; playerName: string; streak: number } | null
  }
  players: Player[]
}

export default function LeagueRecords({ records, players }: Props) {
  const getName = (id: string) => players.find((p) => p.id === id)?.name ?? '???'

  const items: { label: string; value: string }[] = []

  if (records.biggestBlowout) {
    const g = records.biggestBlowout
    const diff = Math.abs(g.score1 - g.score2)
    const winnerName = g.winnerId ? getName(g.winnerId) : '???'
    items.push({
      label: 'Biggest Blowout',
      value: `${winnerName} (${g.score1}-${g.score2}, +${diff})`,
    })
  }

  if (records.highestScoringGame) {
    const g = records.highestScoringGame
    items.push({
      label: 'Highest Scoring',
      value: `${getName(g.player1Id)} vs ${getName(g.player2Id)} (${g.score1}-${g.score2})`,
    })
  }

  if (records.longestStreakHolder && records.longestStreakHolder.streak > 0) {
    items.push({
      label: 'Best Win Streak',
      value: `${records.longestStreakHolder.playerName} (${records.longestStreakHolder.streak})`,
    })
  }

  if (items.length === 0) return null

  return (
    <div className="mb-5">
      <h3 className="section-label mb-2">League Records</h3>
      <div className="card divide-y divide-border">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-text-secondary text-xs">{item.label}</span>
            <span className="text-sm font-semibold font-display text-amber">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
