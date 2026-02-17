import { useState } from 'react'
import type { LeagueState } from '../types/league.ts'
import type { LeagueAction } from '../state/leagueReducer.ts'
import type { ConnectionStatus as ConnStatus } from '../hooks/useMultiplayer.ts'
import ConnectionStatus from './ConnectionStatus.tsx'
import LeagueSetup from './LeagueSetup.tsx'
import BottomNav from './BottomNav.tsx'
import type { Tab } from './BottomNav.tsx'
import DashboardTab from './dashboard/DashboardTab.tsx'
import LogGameTab from './log-game/LogGameTab.tsx'
import HistoryTab from './history/HistoryTab.tsx'
import ManageTab from './manage/ManageTab.tsx'
import PlayerProfileTab from './player/PlayerProfileTab.tsx'

interface Props {
  state: LeagueState
  dispatch: (action: LeagueAction) => void
  connectionStatus: ConnStatus
  peerCount: number
  roomId: string
  onLeave: () => void
}

export default function LeagueShell({ state, dispatch, connectionStatus, peerCount, roomId, onLeave }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)

  if (state.phase === 'setup') {
    return (
      <div className="min-h-dvh">
        <div className="flex items-center justify-between px-4 pt-3">
          <button
            onClick={onLeave}
            className="text-text-secondary text-sm hover:text-accent transition-colors"
          >
            &larr; Leave
          </button>
          <ConnectionStatus status={connectionStatus} peerCount={peerCount} roomId={roomId} />
        </div>
        <LeagueSetup players={state.players} dispatch={dispatch} />
      </div>
    )
  }

  // Player profile view
  if (selectedPlayerId) {
    return (
      <div className="min-h-dvh">
        <ConnectionStatus status={connectionStatus} peerCount={peerCount} roomId={roomId} />
        <PlayerProfileTab
          state={state}
          playerId={selectedPlayerId}
          onBack={() => setSelectedPlayerId(null)}
        />
        <BottomNav active={activeTab} onChange={(t) => { setSelectedPlayerId(null); setActiveTab(t) }} />
      </div>
    )
  }

  return (
    <div className="min-h-dvh">
      <ConnectionStatus status={connectionStatus} peerCount={peerCount} roomId={roomId} />

      {activeTab === 'dashboard' && (
        <DashboardTab state={state} onSelectPlayer={setSelectedPlayerId} onNavigateToLog={() => setActiveTab('log')} />
      )}
      {activeTab === 'log' && (
        <LogGameTab players={state.players} dispatch={dispatch} onLogged={() => setActiveTab('dashboard')} />
      )}
      {activeTab === 'history' && (
        <HistoryTab state={state} dispatch={dispatch} />
      )}
      {activeTab === 'manage' && (
        <ManageTab state={state} roomId={roomId} dispatch={dispatch} />
      )}

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
