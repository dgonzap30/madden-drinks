import { useState } from 'react'
import type { Player } from '../types/league.ts'
import type { LeagueAction } from '../state/leagueReducer.ts'

interface Props {
  players: Player[]
  dispatch: (action: LeagueAction) => void
}

export default function LeagueSetup({ players, dispatch }: Props) {
  const [name, setName] = useState('')
  const [leagueName, setLeagueName] = useState('')

  const addPlayer = () => {
    if (!name.trim()) return
    dispatch({ type: 'ADD_PLAYER', name: name.trim() })
    setName('')
  }

  const activate = () => {
    if (players.length < 2 || !leagueName.trim()) return
    dispatch({ type: 'ACTIVATE_LEAGUE', leagueName: leagueName.trim() })
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-24">
      <h2 className="font-display font-black text-4xl uppercase tracking-wide text-center mb-1 animate-slide-up text-text-primary">
        New League
      </h2>
      <p className="text-text-secondary text-sm text-center mb-8 animate-slide-up" style={{ animationDelay: '60ms' }}>
        Name your league and add the squad
      </p>

      {/* League Name */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '120ms' }}>
        <label className="section-label mb-2 block">League Name</label>
        <input
          type="text"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
          placeholder="e.g. Sunday Madden League"
          className="w-full h-12 px-4 rounded-md bg-bg-input border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
          style={{ fontSize: '16px' }}
          maxLength={30}
        />
      </div>

      {/* Add Player */}
      <div className="animate-slide-up" style={{ animationDelay: '180ms' }}>
        <label className="section-label mb-2 block">Players</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            placeholder="Player name"
            className="flex-1 h-12 px-4 rounded-md bg-bg-input border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
            style={{ fontSize: '16px' }}
            maxLength={20}
          />
          <button
            onClick={addPlayer}
            disabled={!name.trim()}
            className="h-12 px-5 rounded-md bg-accent text-white font-bold disabled:opacity-20 transition-all active:scale-95"
          >
            Add
          </button>
        </div>
      </div>

      {/* Player List */}
      {players.length > 0 && (
        <div className="space-y-2 mb-8">
          {players.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-4 py-3 card animate-card-enter"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-text-muted text-xs">
                  #{i + 1}
                </span>
                <span className="font-semibold">{p.name}</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_PLAYER', playerId: p.id })}
                className="text-text-muted hover:text-negative transition-colors text-lg leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Player Count */}
      <p className="text-text-muted text-xs text-center mb-4">
        {players.length} player{players.length !== 1 ? 's' : ''} added
        {players.length < 2 ? ' (need at least 2)' : ''}
      </p>

      {/* Start */}
      <button
        onClick={activate}
        disabled={players.length < 2 || !leagueName.trim()}
        className="w-full h-14 rounded-md bg-accent text-white text-lg font-display font-bold transition-all active:scale-[0.98] disabled:opacity-20 hover:brightness-110 shadow-[0_0_20px_-4px] shadow-accent-glow"
      >
        Start League
      </button>
    </div>
  )
}
