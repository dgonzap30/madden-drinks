import { useMemo } from 'react'
import type { Player, GameRecord } from '../../types/league.ts'

interface Props {
  players: Player[]
  games: GameRecord[]
  player1: Player | null
  player2: Player | null
  onSelect1: (id: string | null) => void
  onSelect2: (id: string | null) => void
}

function getRecentOpponents(games: GameRecord[], playerId: string, limit: number = 3): string[] {
  const sorted = [...games]
    .filter((g) => g.player1Id === playerId || g.player2Id === playerId)
    .sort((a, b) => b.timestamp - a.timestamp)

  const seen = new Set<string>()
  const result: string[] = []

  for (const g of sorted) {
    const opponentId = g.player1Id === playerId ? g.player2Id : g.player1Id
    if (!seen.has(opponentId)) {
      seen.add(opponentId)
      result.push(opponentId)
      if (result.length >= limit) break
    }
  }

  return result
}

export default function PlayerPicker({ players, games, player1, player2, onSelect1, onSelect2 }: Props) {
  const recentOpponentIds = useMemo(() => {
    if (!player1) return []
    return getRecentOpponents(games, player1.id, 3)
  }, [games, player1])

  // Filter recent opponents: must exist in players list and not already selected as player2
  const recentOpponents = useMemo(() => {
    if (!player1 || recentOpponentIds.length === 0) return []
    return recentOpponentIds
      .map((id) => players.find((p) => p.id === id))
      .filter((p): p is Player => p !== undefined && p.id !== player2?.id)
  }, [recentOpponentIds, players, player1, player2])

  return (
    <div className="card p-4">
      <div className="section-label-lg mb-2">Pick matchup</div>

      <div className="flex flex-wrap gap-2">
        {players.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              if (player1?.id === p.id) {
                onSelect1(null)
              } else {
                onSelect1(p.id)
                if (player2?.id === p.id) onSelect2(null)
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
              player1?.id === p.id
                ? 'bg-amber/15 border border-amber/40 text-amber shadow-[0_0_8px_-2px] shadow-amber-glow'
                : player2?.id === p.id
                  ? 'bg-bg-input border border-border text-text-muted opacity-40 transition-all duration-200'
                  : 'bg-bg-input border border-border text-text-primary hover:border-border-bright'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="text-text-muted text-xs font-display font-bold tracking-widest text-center py-2">VS</div>

      {player1 && recentOpponents.length > 0 && (
        <div className="mb-2">
          <div className="section-label mb-1.5">Recent</div>
          <div className="flex flex-wrap gap-1.5">
            {recentOpponents.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  if (player2?.id === p.id) {
                    onSelect2(null)
                  } else {
                    onSelect2(p.id)
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
                  player2?.id === p.id
                    ? 'bg-amber/15 border border-amber/40 text-amber shadow-[0_0_8px_-2px] shadow-amber-glow'
                    : 'bg-bg-input border border-border text-text-primary hover:border-border-bright'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {players.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              if (player2?.id === p.id) {
                onSelect2(null)
              } else {
                onSelect2(p.id)
                if (player1?.id === p.id) onSelect1(null)
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
              player2?.id === p.id
                ? 'bg-amber/15 border border-amber/40 text-amber shadow-[0_0_8px_-2px] shadow-amber-glow'
                : player1?.id === p.id
                  ? 'bg-bg-input border border-border text-text-muted opacity-40 transition-all duration-200'
                  : 'bg-bg-input border border-border text-text-primary hover:border-border-bright'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  )
}
