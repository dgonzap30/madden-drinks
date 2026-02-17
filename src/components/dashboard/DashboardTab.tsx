import type { LeagueState } from '../../types/league.ts'
import { computeAllStats } from '../../utils/leagueStats.ts'
import StandingsTable from './StandingsTable.tsx'
import RecentGamesList from './RecentGamesList.tsx'
import LeagueRecords from './LeagueRecords.tsx'

interface Props {
  state: LeagueState
  onSelectPlayer: (playerId: string) => void
  onNavigateToLog?: () => void
}

export default function DashboardTab({ state, onSelectPlayer, onNavigateToLog }: Props) {
  const { standings, totalGamesPlayed, totalDrinksOwed, totalDrinksConsumed, records } = computeAllStats(
    state.players,
    state.games
  )

  const recentGames = [...state.games].reverse().slice(0, 5)

  return (
    <div className="max-w-md md:max-w-2xl mx-auto px-4 pt-4 pb-24">
      {/* League Title */}
      <h2 className="font-display font-bold text-2xl mb-1 text-text-primary">
        {state.leagueName}
      </h2>

      {/* Quick Stats */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 p-3 card text-center border-t-2 border-accent">
          <div className="score-jumbo text-3xl text-accent pt-1">{totalGamesPlayed}</div>
          <div className="section-label mt-0.5">Games</div>
        </div>
        <div className="flex-1 p-3 card text-center border-t-2 border-highlight">
          <div className="score-jumbo text-3xl text-highlight pt-1">
            {totalDrinksConsumed}<span className="text-text-muted text-xs">/{totalDrinksOwed}</span>
          </div>
          <div className="section-label mt-0.5">Shots</div>
        </div>
        <div className="flex-1 p-3 card text-center border-t-2 border-text-muted">
          <div className="score-jumbo text-3xl text-text-secondary pt-1">{state.players.length}</div>
          <div className="section-label mt-0.5">Players</div>
        </div>
      </div>

      {/* CTA when no games */}
      {totalGamesPlayed === 0 && (
        <div className="card p-5 mb-5 text-center border border-accent/20">
          <p className="text-text-primary font-semibold mb-1">Ready to play?</p>
          <p className="text-text-muted text-xs mb-3">Log your first Madden game and start tracking</p>
          {onNavigateToLog && (
            <button onClick={onNavigateToLog} className="px-5 py-2 rounded-md bg-accent text-white text-sm font-display font-bold">
              Log First Game
            </button>
          )}
        </div>
      )}

      {/* Two-column grid on desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-5">
        {/* Left: Standings */}
        <div>
          <StandingsTable standings={standings} onSelectPlayer={onSelectPlayer} />
        </div>

        {/* Right: Recent Games + Records */}
        <div>
          {recentGames.length > 0 && (
            <RecentGamesList games={recentGames} players={state.players} />
          )}
          {totalGamesPlayed > 0 && (
            <LeagueRecords records={records} players={state.players} />
          )}
        </div>
      </div>
    </div>
  )
}
