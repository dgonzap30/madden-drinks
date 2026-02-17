export type Tab = 'dashboard' | 'log' | 'history' | 'manage'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Standings' },
  { id: 'log', label: 'Log Game' },
  { id: 'history', label: 'History' },
  { id: 'manage', label: 'Manage' },
]

function TabIcon({ id }: { id: Tab }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (id) {
    case 'dashboard':
      // Trophy icon
      return (
        <svg {...props}>
          <path d="M6 9H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M18 9h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
          <path d="M6 4h12v6a6 6 0 0 1-12 0V4z" />
          <path d="M10 16v2" />
          <path d="M14 16v2" />
          <path d="M8 20h8" />
        </svg>
      )
    case 'log':
      // Football with plus
      return (
        <svg {...props}>
          <ellipse cx="12" cy="12" rx="9" ry="5" transform="rotate(-45 12 12)" />
          <path d="M15 9l-6 6" />
          <path d="M13.5 7.5l-1-1" />
          <path d="M11.5 17.5l1 1" />
          <circle cx="18" cy="6" r="3.5" fill="currentColor" stroke="none" opacity="0.9" />
          <path d="M18 4.5v3" stroke="var(--color-bg-primary)" strokeWidth="1.5" />
          <path d="M16.5 6h3" stroke="var(--color-bg-primary)" strokeWidth="1.5" />
        </svg>
      )
    case 'history':
      // Clock icon
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
    case 'manage':
      // Sliders icon
      return (
        <svg {...props}>
          <path d="M4 21v-7" />
          <path d="M4 10V3" />
          <path d="M12 21v-4" />
          <path d="M12 13V3" />
          <path d="M20 21v-10" />
          <path d="M20 7V3" />
          <circle cx="4" cy="12" r="2" />
          <circle cx="12" cy="15" r="2" />
          <circle cx="20" cy="9" r="2" />
        </svg>
      )
  }
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-bg-primary/90 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center h-14 transition-colors ${
                isActive
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <TabIcon id={tab.id} />
              <span className="text-[10px] font-display tracking-wide mt-0.5">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-5 h-[3px] rounded-full bg-accent animate-tab-indicator" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
