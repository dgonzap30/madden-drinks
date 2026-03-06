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
    <div className="max-w-md mx-auto px-4 pt-6 pb-28">
      <h2 className="font-display font-bold text-4xl uppercase tracking-wider text-center mb-1 animate-slide-up text-gradient-gold">
        New League
      </h2>
      <p className="text-text-secondary text-sm text-center mb-8 animate-slide-up" style={{ animationDelay: '60ms' }}>
        Name your league and add the squad
      </p>

      {/* League Name */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '120ms' }}>
        <label className="section-label-lg mb-2 block">League Name</label>
        <input
          type="text"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
          placeholder="e.g. Sunday Madden League"
          className="w-full h-12 px-4 rounded-lg bg-bg-input border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 focus:ring-1 focus:ring-amber/30 input-premium transition-all"
          style={{ fontSize: '16px' }}
          maxLength={30}
        />
      </div>

      {/* Add Player */}
      <div className="animate-slide-up" style={{ animationDelay: '180ms' }}>
        <label className="section-label-lg mb-2 block">Players</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            placeholder="Player name"
            className="flex-1 h-12 px-4 rounded-lg bg-bg-input border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 focus:ring-1 focus:ring-amber/30 input-premium transition-all"
            style={{ fontSize: '16px' }}
            maxLength={20}
          />
          <button
            onClick={addPlayer}
            disabled={!name.trim()}
            className="h-12 px-5 rounded-lg bg-amber text-bg-primary font-bold disabled:opacity-20 transition-all active:scale-95"
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
                <span className="w-6 h-6 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center font-display font-bold text-amber text-xs">
                  {i + 1}
                </span>
                <span className="font-semibold">{p.name}</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_PLAYER', playerId: p.id })}
                className="text-text-muted hover:text-rose transition-colors text-lg leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Player Count */}
      <p className="text-text-tertiary text-xs text-center mb-4">
        {players.length} player{players.length !== 1 ? 's' : ''} added
        {players.length < 2 ? ' (need at least 2)' : ''}
      </p>

      {/* Start */}
      <button
        onClick={activate}
        disabled={players.length < 2 || !leagueName.trim()}
        className="w-full h-14 rounded-lg btn-shimmer text-bg-primary text-lg font-display font-bold transition-all active:scale-[0.98] disabled:opacity-20 shadow-[0_0_24px_-6px] shadow-amber-glow"
      >
        Start League
      </button>
    </div>
  )
}
