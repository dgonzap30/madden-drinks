import type { LeagueState } from '../../types/league.ts'
import type { LeagueAction } from '../../state/leagueReducer.ts'
import { computeAllStats } from '../../utils/leagueStats.ts'
import StandingsTable from './StandingsTable.tsx'
import RecentGamesList from './RecentGamesList.tsx'
import LeagueRecords from './LeagueRecords.tsx'
import PendingShotsList from './PendingShotsList.tsx'

interface Props {
  state: LeagueState
  dispatch: (action: LeagueAction) => void
  onSelectPlayer: (playerId: string) => void
  onNavigateToLog?: () => void
}

export default function DashboardTab({ state, dispatch, onSelectPlayer, onNavigateToLog }: Props) {
  const { standings, totalGamesPlayed, totalDrinksOwed, totalDrinksConsumed, records } = computeAllStats(
    state.players,
    state.games
  )

  const recentGames = [...state.games].reverse().slice(0, 5)

  return (
    <div className="max-w-md md:max-w-2xl mx-auto px-4 pt-4 pb-24">
      {/* League Title */}
      <h2 className="font-display font-bold text-2xl mb-0.5 text-text-primary">
        {state.leagueName}
      </h2>
      <div className="w-12 h-0.5 bg-amber/40 rounded-full mb-4" />

      {/* Quick Stats */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 p-3 card text-center border-t-2 border-amber">
          <div className="score-jumbo text-3xl text-amber pt-1">{totalGamesPlayed}</div>
          <div className="section-label mt-0.5">Games</div>
        </div>
        <div className="flex-1 p-3 card text-center border-t-2 border-whiskey">
          <div className="score-jumbo text-3xl text-whiskey pt-1">
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
        <div className="card-featured p-5 mb-5 text-center">
          <p className="text-text-primary font-semibold mb-1">Ready to play?</p>
          <p className="text-text-muted text-xs mb-3">Log your first Madden game and start tracking</p>
          {onNavigateToLog && (
            <button onClick={onNavigateToLog} className="px-5 py-2 rounded-xl bg-amber text-bg-primary text-sm font-display font-bold">
              Log First Game
            </button>
          )}
        </div>
      )}

      {/* Pending Shots */}
      <PendingShotsList state={state} dispatch={dispatch} />

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
