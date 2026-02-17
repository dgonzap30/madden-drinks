import type { LeagueState } from '../../types/league.ts'
import { computePlayerStats, computeHeadToHead } from '../../utils/leagueStats.ts'
import { formatRecord, formatPct } from '../../utils/formatters.ts'
import HeadToHeadSection from './HeadToHeadSection.tsx'
import PlayerGameLog from './PlayerGameLog.tsx'

interface Props {
  state: LeagueState
  playerId: string
  onBack: () => void
}

export default function PlayerProfileTab({ state, playerId, onBack }: Props) {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) return null

  const stats = computePlayerStats(player, state.games)
  const opponents = state.players.filter((p) => p.id !== playerId)
  const h2hStats = opponents.map((opp) => computeHeadToHead(player, opp, state.games)).filter((h) => h.games.length > 0)
  const playerGames = [...state.games]
    .filter((g) => g.player1Id === playerId || g.player2Id === playerId)
    .reverse()

  const winPct = stats.winPct
  const netDrinks = stats.netDrinks

  return (
    <div className="max-w-md md:max-w-2xl mx-auto px-4 pt-4 pb-24">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-text-secondary text-sm hover:text-accent transition-colors mb-3"
      >
        <svg className="w-4 h-4 inline mr-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8l4-4" /></svg>
        Back to standings
      </button>

      {/* Name */}
      <h2 className="font-display font-black text-4xl mb-4 text-text-primary">
        {player.name}
      </h2>

      {/* Big Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="card p-3 text-center border-t-2 border-text-secondary">
          <div className="score-jumbo text-2xl text-text-primary pt-1">
            {stats.totalGames > 0 ? formatRecord(stats.wins, stats.losses, stats.ties) : '--'}
          </div>
          <div className="section-label text-[9px] mt-0.5">Record</div>
        </div>
        <div className={`card p-3 text-center border-t-2 ${winPct > 0.5 ? 'border-accent' : winPct < 0.5 ? 'border-negative' : 'border-text-muted'}`}>
          <div className="score-jumbo text-2xl text-text-primary pt-1">
            {stats.totalGames > 0 ? formatPct(stats.winPct) : '--'}
          </div>
          <div className="section-label text-[9px] mt-0.5">Win %</div>
        </div>
        <div className={`card p-3 text-center border-t-2 ${netDrinks > 0 ? 'border-accent' : netDrinks < 0 ? 'border-negative' : 'border-text-muted'}`}>
          <div className={`score-jumbo text-2xl pt-1 ${netDrinks > 0 ? 'text-accent' : netDrinks < 0 ? 'text-negative' : 'text-text-primary'}`}>
            {stats.totalGames > 0 ? (netDrinks > 0 ? `+${netDrinks}` : netDrinks) : '--'}
          </div>
          <div className="section-label text-[9px] mt-0.5">Net Shots</div>
        </div>
      </div>

      {/* Drinks + Performance side by side on desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-4">
        {/* Drinks Stats */}
        <div className="mb-5">
          <h3 className="section-label mb-2">Drinks</h3>
          <div className="card divide-y divide-border">
            <StatRow label="Shots Owed" value={stats.drinksTaken} color="text-negative" />
            <StatRow label="Shots Taken" value={stats.drinksConsumed} color="text-highlight" />
            {stats.drinksPending > 0 && (
              <StatRow label="Shots Pending" value={stats.drinksPending} color="text-negative" />
            )}
            <StatRow label="Shots Imposed" value={stats.drinksGiven} color="text-accent" />
            {stats.mostDrinksInOneGame > 0 && (
              <StatRow label="Most Shots (1 Game)" value={stats.mostDrinksInOneGame} color="text-highlight" />
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mb-5">
          <h3 className="section-label mb-2">Performance</h3>
          <div className="card divide-y divide-border">
            <StatRow label="Avg Pts Scored" value={stats.avgPointsScored.toFixed(1)} />
            <StatRow label="Avg Pts Allowed" value={stats.avgPointsAllowed.toFixed(1)} />
            <StatRow label="Longest Win Streak" value={stats.longestWinStreak} color="text-accent" />
            <StatRow label="Longest Loss Streak" value={stats.longestLossStreak} color="text-negative" />
          </div>
        </div>
      </div>

      {/* Head to Head */}
      {h2hStats.length > 0 && (
        <HeadToHeadSection playerName={player.name} h2hStats={h2hStats} />
      )}

      {/* Game Log */}
      {playerGames.length > 0 && (
        <PlayerGameLog games={playerGames} playerId={playerId} players={state.players} />
      )}
    </div>
  )
}

function StatRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-text-secondary text-xs">{label}</span>
      <span className={`text-sm font-bold font-display score-display ${color ?? 'text-text-primary'}`}>{value}</span>
    </div>
  )
}
