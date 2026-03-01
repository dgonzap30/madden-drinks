import { useState } from 'react'
import type { ConnectionStatus as ConnStatus } from '../hooks/useMultiplayer.ts'

interface Props {
  status: ConnStatus
  peerCount: number
  roomId: string
}

export default function ConnectionStatus({ status, peerCount, roomId }: Props) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-1 text-xs text-text-secondary bg-bg-primary border-b border-border">
      {status === 'connected' ? (
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_6px] shadow-emerald" />
          <span>Connected</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              status === 'connecting' ? 'bg-amber animate-connecting-pulse' : 'bg-rose'
            }`}
          />
          <span>{status === 'connecting' ? 'Connecting' : 'Offline'}</span>
        </div>
      )}

      <span className="text-text-muted">&middot;</span>

      <span>{peerCount} online</span>

      <span className="text-text-muted">&middot;</span>

      <button
        onClick={copyCode}
        className="font-display font-bold tracking-widest hover:text-amber transition-colors"
      >
        {copied ? 'Copied!' : roomId}
      </button>
    </div>
  )
}
