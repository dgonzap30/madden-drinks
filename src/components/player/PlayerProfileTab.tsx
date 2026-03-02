import { useState } from 'react'
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

  const [statsCopied, setStatsCopied] = useState(false)

  const shareStats = () => {
    const streakType = stats.currentWinStreak > 0 ? 'W' : stats.currentLossStreak > 0 ? 'L' : null
    const streakCount = stats.currentWinStreak || stats.currentLossStreak
    const streakText = streakType ? `${streakType}${streakCount}` : 'None'

    const text = [
      `\u{1F3C8} ${player.name} \u{2014} ${state.leagueName}`,
      `Record: ${formatRecord(stats.wins, stats.losses, stats.ties)} (${(stats.winPct * 100).toFixed(1)}%)`,
      `Net Shots: ${netDrinks > 0 ? '+' : ''}${netDrinks}`,
      `Avg Score: ${stats.avgPointsScored.toFixed(1)} - ${stats.avgPointsAllowed.toFixed(1)}`,
      `Current Streak: ${streakText}`,
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setStatsCopied(true)
      setTimeout(() => setStatsCopied(false), 2000)
    })
  }

  return (
    <div className="max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 pt-4 pb-28">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-text-secondary text-sm hover:text-amber transition-colors mb-3"
      >
        <svg className="w-4 h-4 inline mr-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8l4-4" /></svg>
        Back to standings
      </button>

      {/* Name + Share */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display font-black text-4xl text-text-primary">
          {player.name}
        </h2>
        {stats.totalGames > 0 && (
          <button
            onClick={shareStats}
            className="text-xs bg-amber/10 text-amber border border-amber/30 rounded-lg px-3 py-1.5 hover:bg-amber/20 transition-colors font-display font-semibold shrink-0"
          >
            {statsCopied ? 'Copied!' : 'Share Stats'}
          </button>
        )}
      </div>

      {/* Big Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-3 text-center border-t-2 border-border-bright">
          <div className="score-jumbo text-2xl text-text-primary pt-1">
            {stats.totalGames > 0 ? formatRecord(stats.wins, stats.losses, stats.ties) : '--'}
          </div>
          <div className="section-label text-[9px] mt-0.5">Record</div>
        </div>
        <div className={`card p-3 text-center border-t-2 ${winPct > 0.5 ? 'border-amber' : winPct < 0.5 ? 'border-rose' : 'border-text-muted'}`}>
          <div className="score-jumbo text-2xl text-text-primary pt-1">
            {stats.totalGames > 0 ? formatPct(stats.winPct) : '--'}
          </div>
          <div className="section-label text-[9px] mt-0.5">Win %</div>
        </div>
        <div className={`card p-3 text-center border-t-2 ${netDrinks > 0 ? 'border-amber' : netDrinks < 0 ? 'border-rose' : 'border-text-muted'}`}>
          <div className={`score-jumbo text-2xl pt-1 ${netDrinks > 0 ? 'text-amber' : netDrinks < 0 ? 'text-rose' : 'text-text-primary'}`}>
            {stats.totalGames > 0 ? (netDrinks > 0 ? `+${netDrinks}` : netDrinks) : '--'}
          </div>
          <div className="section-label text-[9px] mt-0.5">Net Shots</div>
        </div>
      </div>

      {/* Drinks + Performance side by side on desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-5">
        {/* Drinks Stats */}
        <div className="mb-6">
          <h3 className="section-label-lg mb-2">Drinks</h3>
          <div className="card divide-y divide-border">
            <StatRow label="Shots Owed" value={stats.drinksTaken} color="text-rose" />
            <StatRow label="Shots Taken" value={stats.drinksConsumed} color="text-whiskey" />
            {stats.drinksPending > 0 && (
              <StatRow label="Shots Pending" value={stats.drinksPending} color="text-rose" />
            )}
            <StatRow label="Shots Imposed" value={stats.drinksGiven} color="text-amber" />
            {stats.mostDrinksInOneGame > 0 && (
              <StatRow label="Most Shots (1 Game)" value={stats.mostDrinksInOneGame} color="text-whiskey" />
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mb-6">
          <h3 className="section-label-lg mb-2">Performance</h3>
          <div className="card divide-y divide-border">
            <StatRow label="Avg Pts Scored" value={stats.avgPointsScored.toFixed(1)} />
            <StatRow label="Avg Pts Allowed" value={stats.avgPointsAllowed.toFixed(1)} />
            <StatRow label="Longest Win Streak" value={stats.longestWinStreak} color="text-amber" />
            <StatRow label="Longest Loss Streak" value={stats.longestLossStreak} color="text-rose" />
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
