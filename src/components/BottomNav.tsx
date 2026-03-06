export type Tab = 'dashboard' | 'log' | 'history' | 'manage'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
  leagueName?: string
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Standings' },
  { id: 'log', label: 'Log Game' },
  { id: 'history', label: 'History' },
  { id: 'manage', label: 'Manage' },
]

function TabIcon({ id, size = 20 }: { id: Tab; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (id) {
    case 'dashboard':
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
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
    case 'manage':
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

export default function BottomNav({ active, onChange, leagueName }: Props) {
  return (
    <>
      {/* Mobile / Tablet: Bottom nav bar (hidden on lg+) */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-bg-primary/90 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="flex items-stretch max-w-lg mx-auto">
          {tabs.map((tab) => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative flex-1 flex flex-col items-center justify-center h-14 transition-colors ${
                  isActive
                    ? 'text-amber'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <TabIcon id={tab.id} />
                <span className="text-[10px] font-display tracking-wide mt-0.5">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-5 h-[3px] rounded-full bg-amber animate-tab-indicator" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Desktop: Left sidebar (hidden below lg) */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 z-20 w-[200px] bg-bg-primary border-r border-border flex-col">
        {/* App title */}
        <div className="px-5 pt-6 pb-8">
          <h1 className="font-display font-bold text-2xl uppercase tracking-wider text-gradient-gold leading-tight">
            Madden<br />Drinks
          </h1>
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col gap-1 px-2">
          {tabs.map((tab) => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isActive
                    ? 'text-amber bg-amber/[0.08]'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-surface-hover'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-amber animate-tab-indicator" />
                )}
                <TabIcon id={tab.id} size={18} />
                <span className="font-display font-bold text-sm tracking-wide">
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Bottom section: league name */}
        {leagueName && (
          <div className="px-5 py-4 border-t border-border">
            <p className="text-[10px] font-display tracking-widest uppercase text-text-muted mb-0.5">League</p>
            <p className="text-xs text-text-tertiary font-semibold truncate">{leagueName}</p>
          </div>
        )}
      </nav>
    </>
  )
}
