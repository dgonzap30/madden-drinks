import type { Player, GameRecord, PlayerStats, HeadToHeadStats } from '../types/league.ts'

function getPlayerScore(game: GameRecord, playerId: string): { scored: number; allowed: number } {
  if (game.player1Id === playerId) return { scored: game.score1, allowed: game.score2 }
  return { scored: game.score2, allowed: game.score1 }
}

export interface MatchupBalance {
  aOwesB: number
  bOwesA: number
  bankableCount: number
  aLostGames: GameRecord[]
  bLostGames: GameRecord[]
}

export function computeMatchupBalance(
  playerAId: string,
  playerBId: string,
  games: GameRecord[]
): MatchupBalance {
  const aLostGames: GameRecord[] = []
  const bLostGames: GameRecord[] = []
  let aOwesB = 0
  let bOwesA = 0

  for (const g of games) {
    const isMatchup =
      (g.player1Id === playerAId && g.player2Id === playerBId) ||
      (g.player1Id === playerBId && g.player2Id === playerAId)
    if (!isMatchup || !g.winnerId) continue

    const pending = g.drinksOwed - g.drinksFulfilled
    if (pending <= 0) continue

    if (g.loserId === playerAId) {
      aOwesB += pending
      aLostGames.push(g)
    } else if (g.loserId === playerBId) {
      bOwesA += pending
      bLostGames.push(g)
    }
  }

  // Sort oldest first (FIFO for banking)
  aLostGames.sort((a, b) => a.timestamp - b.timestamp)
  bLostGames.sort((a, b) => a.timestamp - b.timestamp)

  return {
    aOwesB,
    bOwesA,
    bankableCount: Math.min(aOwesB, bOwesA),
    aLostGames,
    bLostGames,
  }
}

export function computePlayerStats(player: Player, games: GameRecord[]): PlayerStats {
  const playerGames = games.filter(
    (g) => g.player1Id === player.id || g.player2Id === player.id
  )

  let wins = 0, losses = 0, ties = 0
  let drinksTaken = 0, drinksGiven = 0, drinksConsumed = 0, drinksBanked = 0
  let totalPointsScored = 0, totalPointsAllowed = 0
  let currentWinStreak = 0, currentLossStreak = 0
  let longestWinStreak = 0, longestLossStreak = 0
  let tempWinStreak = 0, tempLossStreak = 0
  let biggestWin: GameRecord | null = null
  let biggestLoss: GameRecord | null = null
  let biggestWinDiff = 0, biggestLossDiff = 0
  let mostDrinksInOneGame = 0

  for (const game of playerGames) {
    const { scored, allowed } = getPlayerScore(game, player.id)
    totalPointsScored += scored
    totalPointsAllowed += allowed

    if (game.winnerId === player.id) {
      wins++
      drinksGiven += game.drinksOwed
      tempWinStreak++
      tempLossStreak = 0
      if (tempWinStreak > longestWinStreak) longestWinStreak = tempWinStreak

      const diff = scored - allowed
      if (diff > biggestWinDiff) {
        biggestWinDiff = diff
        biggestWin = game
      }
    } else if (game.loserId === player.id) {
      losses++
      drinksTaken += game.drinksOwed
      drinksConsumed += game.drinksFulfilled
      drinksBanked += game.drinksBanked
      tempLossStreak++
      tempWinStreak = 0
      if (tempLossStreak > longestLossStreak) longestLossStreak = tempLossStreak

      const diff = allowed - scored
      if (diff > biggestLossDiff) {
        biggestLossDiff = diff
        biggestLoss = game
      }
      if (game.drinksOwed > mostDrinksInOneGame) mostDrinksInOneGame = game.drinksOwed
    } else {
      ties++
      tempWinStreak = 0
      tempLossStreak = 0
    }
  }

  currentWinStreak = tempWinStreak
  currentLossStreak = tempLossStreak

  const totalGames = playerGames.length

  return {
    playerId: player.id,
    playerName: player.name,
    wins,
    losses,
    ties,
    totalGames,
    winPct: totalGames > 0 ? wins / totalGames : 0,
    drinksTaken,
    drinksGiven,
    netDrinks: drinksGiven - drinksTaken,
    drinksConsumed,
    drinksBanked,
    drinksActuallyDrunk: drinksConsumed - drinksBanked,
    drinksPending: drinksTaken - drinksConsumed,
    currentWinStreak,
    currentLossStreak,
    longestWinStreak,
    longestLossStreak,
    biggestWin,
    biggestLoss,
    mostDrinksInOneGame,
    totalPointsScored,
    totalPointsAllowed,
    avgPointsScored: totalGames > 0 ? totalPointsScored / totalGames : 0,
    avgPointsAllowed: totalGames > 0 ? totalPointsAllowed / totalGames : 0,
  }
}

export function computeHeadToHead(
  player1: Player,
  player2: Player,
  games: GameRecord[]
): HeadToHeadStats {
  const h2hGames = games.filter(
    (g) =>
      (g.player1Id === player1.id && g.player2Id === player2.id) ||
      (g.player1Id === player2.id && g.player2Id === player1.id)
  )

  let p1Wins = 0, p2Wins = 0, ties = 0
  let p1DrinksGiven = 0, p2DrinksGiven = 0

  for (const game of h2hGames) {
    if (game.winnerId === player1.id) {
      p1Wins++
      p1DrinksGiven += game.drinksOwed
    } else if (game.winnerId === player2.id) {
      p2Wins++
      p2DrinksGiven += game.drinksOwed
    } else {
      ties++
    }
  }

  return {
    player1Id: player1.id,
    player2Id: player2.id,
    player1Name: player1.name,
    player2Name: player2.name,
    player1Wins: p1Wins,
    player2Wins: p2Wins,
    ties,
    player1DrinksGiven: p1DrinksGiven,
    player2DrinksGiven: p2DrinksGiven,
    games: h2hGames,
  }
}

export function computeAllStats(players: Player[], games: GameRecord[]) {
  const stats = players.map((p) => computePlayerStats(p, games))

  stats.sort((a, b) => {
    if (a.totalGames === 0 && b.totalGames === 0) return a.playerName.localeCompare(b.playerName)
    if (a.totalGames === 0) return 1
    if (b.totalGames === 0) return -1
    if (b.winPct !== a.winPct) return b.winPct - a.winPct
    if (b.wins !== a.wins) return b.wins - a.wins
    if (b.netDrinks !== a.netDrinks) return b.netDrinks - a.netDrinks
    return a.playerName.localeCompare(b.playerName)
  })

  const standings = stats.map((s, i) => ({ ...s, rank: s.totalGames > 0 ? i + 1 : 0 }))

  const totalDrinksOwed = stats.reduce((sum, s) => sum + s.drinksTaken, 0)
  const totalDrinksConsumed = stats.reduce((sum, s) => sum + s.drinksConsumed, 0)

  let biggestBlowout: GameRecord | null = null
  let biggestBlowoutDiff = 0
  let highestScoringGame: GameRecord | null = null
  let highestTotalScore = 0
  let longestStreakHolder: { playerId: string; playerName: string; streak: number } | null = null

  for (const game of games) {
    const diff = Math.abs(game.score1 - game.score2)
    if (diff > biggestBlowoutDiff) {
      biggestBlowoutDiff = diff
      biggestBlowout = game
    }
    const total = game.score1 + game.score2
    if (total > highestTotalScore) {
      highestTotalScore = total
      highestScoringGame = game
    }
  }

  for (const s of stats) {
    if (longestStreakHolder === null || s.longestWinStreak > longestStreakHolder.streak) {
      longestStreakHolder = { playerId: s.playerId, playerName: s.playerName, streak: s.longestWinStreak }
    }
  }

  return {
    standings,
    totalGamesPlayed: games.length,
    totalDrinksOwed,
    totalDrinksConsumed,
    records: {
      biggestBlowout,
      highestScoringGame,
      longestStreakHolder,
    },
  }
}
