import { useEffect, useState } from 'react'

interface Props {
  message: string | null
  onDone: () => void
}

export default function Toast({ message, onDone }: Props) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    setLeaving(false)
    const timer = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => {
        setVisible(false)
        setLeaving(false)
        onDone()
      }, 300)
    }, 1700)
    return () => clearTimeout(timer)
  }, [message, onDone])

  if (!visible || !message) return null

  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-bg-elevated border border-border border-l-2 border-l-amber/40 text-text-primary text-sm font-medium shadow-lg ${
      leaving ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
    } transition-all duration-300`}>
      {message}
    </div>
  )
}
