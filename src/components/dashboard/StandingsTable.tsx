import type { PlayerStats } from '../../types/league.ts'
import { formatRecord, formatPct } from '../../utils/formatters.ts'

interface Props {
  standings: (PlayerStats & { rank: number })[]
  onSelectPlayer: (playerId: string) => void
}

export default function StandingsTable({ standings, onSelectPlayer }: Props) {
  return (
    <div className="mb-5">
      <h3 className="section-label mb-2">Standings</h3>
      <div className="card overflow-hidden border-l-[3px] border-highlight">
        {/* Header */}
        <div className="flex items-center px-4 py-2 border-b border-border bg-[#0E1318] text-text-muted text-[10px] uppercase tracking-[0.12em]">
          <div className="w-6 font-display">#</div>
          <div className="flex-1 font-display">Player</div>
          <div className="w-20 text-right font-display">Record</div>
          <div className="w-12 text-right font-display">Pct</div>
          <div className="w-12 text-right font-display">+/-</div>
        </div>

        {/* Rows */}
        {standings.map((s, i) => (
          <button
            key={s.playerId}
            onClick={() => onSelectPlayer(s.playerId)}
            className={`w-full flex items-center px-4 py-3 transition-colors hover:bg-bg-card-hover text-left ${
              i < standings.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="w-6">
              {s.rank === 1 ? (
                <span className="bg-highlight/15 text-highlight border border-highlight/30 rounded px-1.5 py-0.5 text-xs font-display font-bold">{s.rank}</span>
              ) : s.rank === standings.length && s.totalGames > 0 ? (
                <span className="bg-negative/15 text-negative border border-negative/30 rounded px-1.5 py-0.5 text-xs font-display font-bold">{s.rank}</span>
              ) : (
                <span className="text-text-muted font-display font-bold text-sm">{s.rank || '-'}</span>
              )}
            </div>
            <div className="flex-1 flex items-center gap-1.5">
              <span className="font-semibold text-[15px]">{s.playerName}</span>
              {s.currentWinStreak >= 3 && (
                <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-bold shadow-[0_0_8px_-2px] shadow-accent-glow">
                  W{s.currentWinStreak}
                </span>
              )}
              {s.currentLossStreak >= 3 && (
                <span className="text-[9px] bg-negative/20 text-negative px-1.5 py-0.5 rounded font-bold shadow-[0_0_8px_-2px] shadow-negative-glow">
                  L{s.currentLossStreak}
                </span>
              )}
            </div>
            <div className="w-20 text-right text-sm text-text-secondary font-display score-display">
              {s.totalGames > 0 ? formatRecord(s.wins, s.losses, s.ties) : '--'}
            </div>
            <div className="w-12 text-right text-sm text-text-secondary font-display score-display">
              {s.totalGames > 0 ? formatPct(s.winPct) : '--'}
            </div>
            <div className={`w-12 text-right text-sm font-display score-display ${
              s.netDrinks > 0 ? 'text-accent' : s.netDrinks < 0 ? 'text-negative' : 'text-text-muted'
            }`}>
              {s.totalGames > 0 ? (s.netDrinks > 0 ? `+${s.netDrinks}` : s.netDrinks) : '--'}
            </div>
          </button>
        ))}

        {standings.length === 0 && (
          <div className="px-4 py-10 text-center">
            <p className="text-highlight text-lg font-display font-bold mb-1">First game?</p>
            <p className="text-text-muted text-xs">Head to Log Game to see standings</p>
          </div>
        )}
      </div>
    </div>
  )
}
