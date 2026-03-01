import type { Player } from '../../types/league.ts'

interface Props {
  players: Player[]
  player1: Player | null
  player2: Player | null
  onSelect1: (id: string | null) => void
  onSelect2: (id: string | null) => void
}

export default function PlayerPicker({ players, player1, player2, onSelect1, onSelect2 }: Props) {
  return (
    <div className="card p-4">
      <div className="section-label mb-3">Pick matchup</div>

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
                ? 'bg-amber/10 border border-amber/40 text-amber shadow-[0_0_8px_-2px] shadow-amber-glow'
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
                ? 'bg-amber/10 border border-amber/40 text-amber shadow-[0_0_8px_-2px] shadow-amber-glow'
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
