import { useState } from 'react'
import type { Player, GameRecord } from '../../types/league.ts'
import type { LeagueAction } from '../../state/leagueReducer.ts'
import { calculateDrinksOwed, describeDrinks } from '../../utils/drinkCalc.ts'
import PlayerPicker from './PlayerPicker.tsx'
import TeamPicker from './TeamPicker.tsx'
import ScoreInput from './ScoreInput.tsx'
import DrinkPreview from './DrinkPreview.tsx'

interface Props {
  players: Player[]
  games: GameRecord[]
  dispatch: (action: LeagueAction) => void
  onLogged: () => void
}

interface LoggedDetails {
  player1Name: string
  player2Name: string
  score1: number
  score2: number
  drinks: number
  loserName: string | null
  team1: string | null
  team2: string | null
}

export default function LogGameTab({ players, games, dispatch, onLogged }: Props) {
  const [player1Id, setPlayer1Id] = useState<string | null>(null)
  const [player2Id, setPlayer2Id] = useState<string | null>(null)
  const [team1, setTeam1] = useState<string | null>(null)
  const [team2, setTeam2] = useState<string | null>(null)
  const [score1, setScore1] = useState<number | null>(null)
  const [score2, setScore2] = useState<number | null>(null)
  const [logged, setLogged] = useState<LoggedDetails | null>(null)

  const player1 = players.find((p) => p.id === player1Id) ?? null
  const player2 = players.find((p) => p.id === player2Id) ?? null

  const canLog = player1 && player2 && player1.id !== player2.id && score1 !== null && score2 !== null && score1 >= 0 && score2 >= 0

  const resetForm = () => {
    setPlayer1Id(null)
    setPlayer2Id(null)
    setTeam1(null)
    setTeam2(null)
    setScore1(null)
    setScore2(null)
    setLogged(null)
  }

  const logGame = () => {
    if (!canLog || score1 === null || score2 === null || !player1 || !player2) return

    const drinks = calculateDrinksOwed(score1, score2)
    const isTie = score1 === score2
    const loserName = isTie ? null : score1 < score2 ? player1.name : player2.name

    const details: LoggedDetails = {
      player1Name: player1.name,
      player2Name: player2.name,
      score1,
      score2,
      drinks,
      loserName,
      team1,
      team2,
    }

    dispatch({
      type: 'LOG_GAME',
      player1Id: player1.id,
      player2Id: player2.id,
      score1,
      score2,
      ...(team1 ? { team1 } : {}),
      ...(team2 ? { team2 } : {}),
    })

    setLogged(details)
  }

  if (logged) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 animate-slide-up">
        <div className="w-16 h-16 mb-6 rounded-full bg-amber/20 flex items-center justify-center animate-celebrate animate-pulse-glow">
          <span className="text-amber text-3xl">&#10003;</span>
        </div>
        <h3 className="font-display font-black text-3xl text-gradient-gold uppercase tracking-wide mb-4">
          Game Logged
        </h3>

        <div className="card-featured p-4 w-full max-w-xs text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <span className="text-text-primary font-semibold">{logged.player1Name}</span>
            <span className="score-jumbo text-2xl text-amber">{logged.score1}</span>
            <span className="text-text-muted font-display font-bold text-sm">-</span>
            <span className="score-jumbo text-2xl text-amber">{logged.score2}</span>
            <span className="text-text-primary font-semibold">{logged.player2Name}</span>
          </div>
          {logged.loserName && (
            <div className="text-sm text-text-secondary mt-2">
              <span className="text-rose">{logged.loserName}</span> owes{' '}
              <span className="text-whiskey font-display font-bold">{describeDrinks(logged.drinks)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              resetForm()
              onLogged()
            }}
            className="flex-1 h-12 rounded-xl bg-bg-input border border-border text-text-primary text-sm font-semibold transition-all active:scale-[0.98] hover:border-border-bright"
          >
            Back to Standings
          </button>
          <button
            onClick={resetForm}
            className="flex-1 h-12 rounded-xl bg-amber text-bg-primary text-sm font-bold transition-all active:scale-[0.98] hover:brightness-110"
          >
            Log Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md lg:max-w-4xl xl:max-w-5xl mx-auto px-4 pt-4 pb-28">
      <h2 className="text-xl font-display font-bold tracking-wide mb-4 text-text-primary">
        Log Game
      </h2>

      <PlayerPicker
        players={players}
        games={games}
        player1={player1}
        player2={player2}
        onSelect1={setPlayer1Id}
        onSelect2={setPlayer2Id}
      />

      {player1 && player2 && player1.id !== player2.id && (
        <>
          <div className="mt-4 animate-slide-up">
            <TeamPicker
              player1Name={player1.name}
              player2Name={player2.name}
              team1={team1}
              team2={team2}
              onTeam1={setTeam1}
              onTeam2={setTeam2}
            />
          </div>

          <div className="mt-4 animate-slide-up">
            <ScoreInput
              player1Name={player1.name}
              player2Name={player2.name}
              team1={team1}
              team2={team2}
              score1={score1}
              score2={score2}
              onScore1={setScore1}
              onScore2={setScore2}
            />
          </div>
        </>
      )}

      {player1 && player2 && score1 !== null && score2 !== null && score1 >= 0 && score2 >= 0 && (
        <div className="mt-4 animate-slide-up">
          <DrinkPreview
            player1Name={player1.name}
            player2Name={player2.name}
            team1={team1}
            team2={team2}
            score1={score1}
            score2={score2}
          />
        </div>
      )}

      <button
        onClick={logGame}
        disabled={!canLog}
        className="w-full h-14 mt-6 rounded-xl btn-shimmer text-bg-primary text-lg font-bold font-display transition-all active:scale-[0.98] disabled:opacity-20 shadow-[0_0_24px_-6px] shadow-amber-glow"
      >
        Log Game
      </button>
    </div>
  )
}
