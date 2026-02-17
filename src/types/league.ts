export interface Player {
  id: string
  name: string
  joinedAt: number
}

export interface GameRecord {
  id: string
  player1Id: string
  player2Id: string
  score1: number
  score2: number
  drinksOwed: number
  drinksFulfilled: number
  winnerId: string | null
  loserId: string | null
  timestamp: number
  team1?: string  // NFL team abbreviation (e.g. "KC")
  team2?: string
}

export interface LeagueState {
  phase: 'setup' | 'active'
  players: Player[]
  games: GameRecord[]
  leagueName: string
}

export interface PlayerStats {
  playerId: string
  playerName: string
  wins: number
  losses: number
  ties: number
  totalGames: number
  winPct: number
  drinksTaken: number
  drinksGiven: number
  netDrinks: number
  drinksConsumed: number
  drinksPending: number
  currentWinStreak: number
  currentLossStreak: number
  longestWinStreak: number
  longestLossStreak: number
  biggestWin: GameRecord | null
  biggestLoss: GameRecord | null
  mostDrinksInOneGame: number
  totalPointsScored: number
  totalPointsAllowed: number
  avgPointsScored: number
  avgPointsAllowed: number
}

export interface HeadToHeadStats {
  player1Id: string
  player2Id: string
  player1Name: string
  player2Name: string
  player1Wins: number
  player2Wins: number
  ties: number
  player1DrinksGiven: number
  player2DrinksGiven: number
  games: GameRecord[]
}
