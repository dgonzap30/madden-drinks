import type { LeagueState, GameRecord } from '../types/league.ts'
import { calculateDrinksOwed } from '../utils/drinkCalc.ts'

export type LeagueAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'ACTIVATE_LEAGUE'; leagueName: string }
  | { type: 'LOG_GAME'; player1Id: string; player2Id: string; score1: number; score2: number; team1?: string; team2?: string }
  | { type: 'FULFILL_DRINK'; gameId: string }
  | { type: 'UNFULFILL_DRINK'; gameId: string }
  | { type: 'UNDO_LAST_GAME' }
  | { type: 'DELETE_GAME'; gameId: string }
  | { type: 'BANK_DRINK'; loserGameId: string; counterpartGameId: string }
  | { type: 'UNBANK_DRINK'; loserGameId: string; counterpartGameId: string }
  | { type: 'BULK_FULFILL_DRINKS'; loserId: string }
  | { type: 'RESET_LEAGUE' }
  | { type: 'LOAD_STATE'; state: LeagueState }

export const initialState: LeagueState = {
  phase: 'setup',
  players: [],
  games: [],
  leagueName: '',
}

export function migrateState(saved: Partial<LeagueState> | undefined | null): LeagueState {
  if (!saved || typeof saved !== 'object') return { ...initialState }
  return {
    phase: saved.phase ?? 'setup',
    players: (saved.players ?? []).map((p) => ({
      id: p.id ?? crypto.randomUUID(),
      name: p.name ?? 'Unknown',
      joinedAt: p.joinedAt ?? Date.now(),
    })),
    games: (saved.games ?? []).map((g) => ({
      id: g.id ?? crypto.randomUUID(),
      player1Id: g.player1Id ?? '',
      player2Id: g.player2Id ?? '',
      score1: g.score1 ?? 0,
      score2: g.score2 ?? 0,
      drinksOwed: g.drinksOwed ?? calculateDrinksOwed(g.score1 ?? 0, g.score2 ?? 0),
      drinksFulfilled: g.drinksFulfilled ?? 0,
      drinksBanked: g.drinksBanked ?? 0,
      winnerId: g.winnerId ?? null,
      loserId: g.loserId ?? null,
      timestamp: g.timestamp ?? Date.now(),
      ...(g.team1 ? { team1: g.team1 } : {}),
      ...(g.team2 ? { team2: g.team2 } : {}),
    })),
    leagueName: saved.leagueName ?? '',
  }
}

export function leagueReducer(state: LeagueState, action: LeagueAction): LeagueState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const trimmed = action.name.trim()
      if (!trimmed) return state
      const exists = state.players.some(
        (p) => p.name.toLowerCase() === trimmed.toLowerCase()
      )
      if (exists) return state
      return {
        ...state,
        players: [
          ...state.players,
          { id: crypto.randomUUID(), name: trimmed, joinedAt: Date.now() },
        ],
      }
    }

    case 'REMOVE_PLAYER': {
      const hasGames = state.games.some(
        (g) => g.player1Id === action.playerId || g.player2Id === action.playerId
      )
      if (hasGames) return state
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.playerId),
      }
    }

    case 'ACTIVATE_LEAGUE': {
      if (state.players.length < 2) return state
      const name = action.leagueName.trim()
      if (!name) return state
      return { ...state, phase: 'active', leagueName: name }
    }

    case 'LOG_GAME': {
      if (state.phase !== 'active') return state
      const { player1Id, player2Id, score1, score2, team1, team2 } = action
      if (player1Id === player2Id) return state
      if (!state.players.some((p) => p.id === player1Id)) return state
      if (!state.players.some((p) => p.id === player2Id)) return state
      if (score1 < 0 || score2 < 0) return state

      const drinksOwed = calculateDrinksOwed(score1, score2)
      const isTie = score1 === score2

      const game: GameRecord = {
        id: crypto.randomUUID(),
        player1Id,
        player2Id,
        score1,
        score2,
        drinksOwed,
        drinksFulfilled: 0,
        drinksBanked: 0,
        winnerId: isTie ? null : score1 > score2 ? player1Id : player2Id,
        loserId: isTie ? null : score1 < score2 ? player1Id : player2Id,
        timestamp: Date.now(),
        ...(team1 ? { team1 } : {}),
        ...(team2 ? { team2 } : {}),
      }

      return { ...state, games: [...state.games, game] }
    }

    case 'FULFILL_DRINK': {
      const gameIdx = state.games.findIndex((g) => g.id === action.gameId)
      if (gameIdx === -1) return state
      const game = state.games[gameIdx]
      if (game.winnerId === null) return state
      if (game.drinksFulfilled >= game.drinksOwed) return state
      const updated = { ...game, drinksFulfilled: game.drinksFulfilled + 1 }
      const games = [...state.games]
      games[gameIdx] = updated
      return { ...state, games }
    }

    case 'UNFULFILL_DRINK': {
      const gameIdx = state.games.findIndex((g) => g.id === action.gameId)
      if (gameIdx === -1) return state
      const game = state.games[gameIdx]
      if (game.winnerId === null) return state
      if (game.drinksFulfilled <= 0) return state
      const updated = { ...game, drinksFulfilled: game.drinksFulfilled - 1 }
      const games = [...state.games]
      games[gameIdx] = updated
      return { ...state, games }
    }

    case 'BANK_DRINK': {
      const loserIdx = state.games.findIndex((g) => g.id === action.loserGameId)
      const counterIdx = state.games.findIndex((g) => g.id === action.counterpartGameId)
      if (loserIdx === -1 || counterIdx === -1) return state

      const loserGame = state.games[loserIdx]
      const counterGame = state.games[counterIdx]

      // Both must have pending shots
      if (loserGame.drinksFulfilled >= loserGame.drinksOwed) return state
      if (counterGame.drinksFulfilled >= counterGame.drinksOwed) return state

      // Must be same matchup with opposite winners
      if (loserGame.loserId !== counterGame.winnerId) return state
      if (loserGame.winnerId !== counterGame.loserId) return state

      const games = [...state.games]
      games[loserIdx] = {
        ...loserGame,
        drinksFulfilled: loserGame.drinksFulfilled + 1,
        drinksBanked: loserGame.drinksBanked + 1,
      }
      games[counterIdx] = {
        ...counterGame,
        drinksFulfilled: counterGame.drinksFulfilled + 1,
        drinksBanked: counterGame.drinksBanked + 1,
      }
      return { ...state, games }
    }

    case 'UNBANK_DRINK': {
      const loserIdx = state.games.findIndex((g) => g.id === action.loserGameId)
      const counterIdx = state.games.findIndex((g) => g.id === action.counterpartGameId)
      if (loserIdx === -1 || counterIdx === -1) return state

      const loserGame = state.games[loserIdx]
      const counterGame = state.games[counterIdx]

      // Both must have banked shots to undo
      if (loserGame.drinksBanked <= 0) return state
      if (counterGame.drinksBanked <= 0) return state

      const games = [...state.games]
      games[loserIdx] = {
        ...loserGame,
        drinksFulfilled: loserGame.drinksFulfilled - 1,
        drinksBanked: loserGame.drinksBanked - 1,
      }
      games[counterIdx] = {
        ...counterGame,
        drinksFulfilled: counterGame.drinksFulfilled - 1,
        drinksBanked: counterGame.drinksBanked - 1,
      }
      return { ...state, games }
    }

    case 'UNDO_LAST_GAME': {
      if (state.games.length === 0) return state
      return { ...state, games: state.games.slice(0, -1) }
    }

    case 'DELETE_GAME': {
      const exists = state.games.some((g) => g.id === action.gameId)
      if (!exists) return state
      return { ...state, games: state.games.filter((g) => g.id !== action.gameId) }
    }

    case 'BULK_FULFILL_DRINKS': {
      const updated = state.games.map((g) => {
        if (g.loserId === action.loserId && g.winnerId !== null && g.drinksFulfilled < g.drinksOwed) {
          return { ...g, drinksFulfilled: g.drinksOwed }
        }
        return g
      })
      if (updated === state.games) return state
      return { ...state, games: updated }
    }

    case 'RESET_LEAGUE':
      return { ...initialState }

    case 'LOAD_STATE':
      return migrateState(action.state)

    default:
      return state
  }
}
