import { useState, useEffect } from 'react'
import { useMultiplayer } from './hooks/useMultiplayer.ts'
import Lobby from './components/Lobby.tsx'
import LeagueShell from './components/LeagueShell.tsx'
import { saveRecentLeague } from './utils/recentLeagues.ts'

type AppMode =
  | { type: 'choosing' }
  | { type: 'online'; room: string }

function getInitialMode(): AppMode {
  const params = new URLSearchParams(window.location.search)
  const room = params.get('room')
  if (room) return { type: 'online', room: room.toUpperCase() }
  return { type: 'choosing' }
}

function OnlineLeague({ room, onLeave }: { room: string; onLeave: () => void }) {
  const { state, dispatch, status, peerCount } = useMultiplayer(room)

  useEffect(() => {
    saveRecentLeague(room, state.leagueName || null)
  }, [room, state.leagueName])

  return (
    <LeagueShell
      state={state}
      dispatch={dispatch}
      connectionStatus={status}
      peerCount={peerCount}
      roomId={room}
      onLeave={onLeave}
    />
  )
}

function App() {
  const [mode, setMode] = useState<AppMode>(getInitialMode)

  const goToLobby = () => {
    window.history.replaceState(null, '', window.location.pathname)
    setMode({ type: 'choosing' })
  }

  if (mode.type === 'choosing') {
    return <Lobby onJoin={(room) => setMode({ type: 'online', room })} />
  }

  return <OnlineLeague room={mode.room} onLeave={goToLobby} />
}

export default App
