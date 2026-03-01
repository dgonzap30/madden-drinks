import { calculateDrinksOwed, describeDrinks, describeScoreGap } from '../../utils/drinkCalc.ts'
import TeamBadge from '../shared/TeamBadge.tsx'

interface Props {
  player1Name: string
  player2Name: string
  team1: string | null
  team2: string | null
  score1: number
  score2: number
}

function DrinkMeter({ drinks, isTie }: { drinks: number; isTie: boolean }) {
  const segments = 4
  const filled = isTie ? 0 : Math.min(drinks, segments)

  const getColor = (index: number) => {
    if (index >= filled) return 'bg-border'
    if (drinks >= 4) return 'bg-rose'
    if (drinks >= 2) return 'bg-whiskey'
    return 'bg-amber'
  }

  return (
    <div className="flex gap-1.5 mt-3">
      {Array.from({ length: segments }, (_, i) => (
        <div
          key={i}
          className={`flex-1 h-3 rounded-full transition-colors ${getColor(i)}`}
          style={{ transitionDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  )
}

export default function DrinkPreview({ player1Name, player2Name, team1, team2, score1, score2 }: Props) {
  const diff = Math.abs(score1 - score2)
  const drinks = calculateDrinksOwed(score1, score2)
  const isTie = score1 === score2

  const loserName = isTie ? null : score1 < score2 ? player1Name : player2Name
  const winnerName = isTie ? null : score1 > score2 ? player1Name : player2Name

  return (
    <div className={`card-featured p-4 ${!isTie ? 'border-amber/20' : ''}`}>
      {/* Score Display */}
      <div className="flex items-center justify-center gap-6 mb-3 pt-1">
        <div className="text-center">
          <div className="section-label mb-1 flex items-center justify-center gap-1">
            {player1Name}
            {team1 && <TeamBadge abbr={team1} />}
          </div>
          <div
            className={`score-jumbo text-4xl ${score1 > score2 ? 'text-amber' : score1 < score2 ? 'text-rose' : 'text-text-primary'}`}
          >
            {score1}
          </div>
        </div>
        <div className="text-text-muted text-sm font-semibold">-</div>
        <div className="text-center">
          <div className="section-label mb-1 flex items-center justify-center gap-1">
            {player2Name}
            {team2 && <TeamBadge abbr={team2} />}
          </div>
          <div
            className={`score-jumbo text-4xl ${score2 > score1 ? 'text-amber' : score2 < score1 ? 'text-rose' : 'text-text-primary'}`}
          >
            {score2}
          </div>
        </div>
      </div>

      {/* Gap Description */}
      <div className="text-text-secondary text-xs text-center mb-1">
        {isTie ? 'Tie game' : `${describeScoreGap(score1, score2)} (${diff} pts)`}
      </div>

      {/* Drink Result */}
      <div className="text-center">
        <div
          className={`text-lg font-bold mt-1 ${
            isTie
              ? 'text-text-muted'
              : drinks >= 4
                ? 'text-rose'
                : drinks >= 2
                  ? 'text-whiskey'
                  : 'text-amber'
          }`}
        >
          {isTie ? (
            'No shots — tie game'
          ) : (
            <>
              <span className="text-rose">{loserName}</span>
              {' '}owes{' '}
              <span className="text-whiskey font-display font-bold">
                {describeDrinks(drinks)}
              </span>
              {winnerName && (
                <div className="text-[11px] text-text-muted font-normal mt-0.5">
                  {winnerName} wins
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Drink Meter */}
      <DrinkMeter drinks={drinks} isTie={isTie} />
    </div>
  )
}
