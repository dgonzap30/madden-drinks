import { useState } from 'react'
import type { LeagueAction } from '../../state/leagueReducer.ts'

interface Props {
  dispatch: (action: LeagueAction) => void
}

export default function AddPlayerForm({ dispatch }: Props) {
  const [name, setName] = useState('')

  const add = () => {
    if (!name.trim()) return
    dispatch({ type: 'ADD_PLAYER', name: name.trim() })
    setName('')
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && add()}
        placeholder="New player name"
        className="flex-1 h-11 px-4 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 focus:ring-1 focus:ring-amber/30 input-premium transition-all"
        style={{ fontSize: '16px' }}
        maxLength={20}
      />
      <button
        onClick={add}
        disabled={!name.trim()}
        className="h-11 px-5 rounded-xl bg-amber text-bg-primary font-bold disabled:opacity-20 transition-all active:scale-95"
      >
        Add
      </button>
    </div>
  )
}
