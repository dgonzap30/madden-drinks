import { getTeamByAbbr } from '../../data/nflTeams.ts'
import { calculateDrinksOwed } from '../../utils/drinkCalc.ts'

interface Props {
  player1Name: string
  player2Name: string
  team1: string | null
  team2: string | null
  score1: number | null
  score2: number | null
  onScore1: (v: number | null) => void
  onScore2: (v: number | null) => void
}

const QUICK_SCORES = [0, 3, 7, 10, 14, 17, 21, 24, 28, 31, 35, 42]

function ScoreField({
  label,
  teamAbbr,
  value,
  opponentScore,
  isWinning,
  isLosing,
  onChange,
}: {
  label: string
  teamAbbr: string | null
  value: number | null
  opponentScore: number | null
  isWinning: boolean
  isLosing: boolean
  onChange: (v: number | null) => void
}) {
  const team = teamAbbr ? getTeamByAbbr(teamAbbr) : null

  return (
    <div>
      <label className="section-label-lg mb-1.5 flex items-center gap-1.5">
        {label}
        {team && (
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: team.color + '25',
              color: team.color,
              border: `1px solid ${team.color}40`,
            }}
          >
            {team.abbr}
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (value === null || value === 0) return
            onChange(value - 1)
          }}
          className="w-11 h-11 rounded-full bg-bg-input border border-border text-text-secondary font-display font-bold text-xl flex items-center justify-center btn-press transition-colors hover:border-border-bright"
        >
          -
        </button>
        <input
          type="number"
          inputMode="numeric"
          value={value ?? ''}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') return onChange(null)
            const n = parseInt(v, 10)
            if (!isNaN(n) && n >= 0) onChange(n)
          }}
          placeholder="0"
          className={`flex-1 h-20 text-4xl score-jumbo text-center rounded-xl bg-bg-primary border border-border outline-none input-premium transition-all focus:border-amber/60 focus:ring-1 focus:ring-amber/30 ${
            isWinning ? 'text-amber' : isLosing ? 'text-rose' : ''
          }`}
          style={!isWinning && !isLosing ? { color: 'var(--color-text-primary)' } : undefined}
          min={0}
          max={999}
        />
        <button
          onClick={() => {
            onChange((value ?? 0) + 1)
          }}
          className="w-11 h-11 rounded-full bg-bg-input border border-border text-text-secondary font-display font-bold text-xl flex items-center justify-center btn-press transition-colors hover:border-border-bright"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {QUICK_SCORES.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`px-2.5 py-1 rounded text-xs font-display font-semibold transition-all active:scale-90 flex flex-col items-center ${
              value === s
                ? 'bg-amber/15 border border-amber/40 text-amber'
                : 'bg-bg-input border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{s}</span>
            {opponentScore !== null && opponentScore !== undefined && (
              <div className="text-[7px] text-text-tertiary mt-0.5">
                {calculateDrinksOwed(s, opponentScore) || '-'}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ScoreInput({ player1Name, player2Name, team1, team2, score1, score2, onScore1, onScore2 }: Props) {
  const bothSet = score1 !== null && score2 !== null
  const p1Winning = bothSet && score1! > score2!
  const p1Losing = bothSet && score1! < score2!
  const p2Winning = bothSet && score2! > score1!
  const p2Losing = bothSet && score2! < score1!

  return (
    <div className="card p-4">
      <div className="lg:flex lg:gap-8 lg:items-start">
        <div className="flex-1">
          <ScoreField
            label={player1Name}
            teamAbbr={team1}
            value={score1}
            opponentScore={score2}
            isWinning={p1Winning}
            isLosing={p1Losing}
            onChange={onScore1}
          />
        </div>
        <div className="flex items-center gap-3 py-2 lg:py-0 lg:pt-8 lg:flex-col lg:gap-1">
          <div className="flex-1 border-t divider-warm lg:hidden" />
          <span className="font-display font-bold text-text-muted tracking-widest text-sm">VS</span>
          <div className="flex-1 border-t divider-warm lg:hidden" />
        </div>
        <div className="flex-1">
          <ScoreField
            label={player2Name}
            teamAbbr={team2}
            value={score2}
            opponentScore={score1}
            isWinning={p2Winning}
            isLosing={p2Losing}
            onChange={onScore2}
          />
        </div>
      </div>
    </div>
  )
}
