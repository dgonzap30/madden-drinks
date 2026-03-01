import { NFL_DIVISIONS, getTeamByAbbr } from '../../data/nflTeams.ts'

interface Props {
  player1Name: string
  player2Name: string
  team1: string | null
  team2: string | null
  onTeam1: (abbr: string | null) => void
  onTeam2: (abbr: string | null) => void
}

function TeamSelector({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: string | null
  onSelect: (abbr: string | null) => void
}) {
  const selectedTeam = selected ? getTeamByAbbr(selected) : null

  return (
    <div>
      <label className="section-label mb-1.5 block">
        {label}'s Team
      </label>
      {selectedTeam ? (
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold"
            style={{
              borderColor: selectedTeam.color + '80',
              backgroundColor: selectedTeam.color + '15',
              color: ['#0B162A', '#002244', '#0C2340', '#311D00', '#03202F'].includes(selectedTeam.color)
                ? 'var(--color-text-primary)'
                : selectedTeam.color,
            }}
          >
            <span>{selectedTeam.abbr}</span>
            <span className="text-text-secondary text-xs font-normal">{selectedTeam.city} {selectedTeam.name}</span>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="text-text-muted hover:text-text-secondary text-lg leading-none transition-colors"
          >
            &times;
          </button>
        </div>
      ) : null}
      <div className="max-h-[260px] overflow-y-auto scrollbar-none">
        {NFL_DIVISIONS.map((div) => (
          <div key={`${div.conference}-${div.division}`}>
            <div className="section-label text-[9px] mb-1 mt-2">{div.conference} {div.division}</div>
            <div className="grid grid-cols-4 gap-1">
              {div.teams.map((abbr) => {
                const team = getTeamByAbbr(abbr)!
                const isSelected = selected === team.abbr

                return (
                  <button
                    key={team.abbr}
                    onClick={() => onSelect(isSelected ? null : team.abbr)}
                    className={`px-2 py-1.5 text-xs font-display font-bold rounded tracking-wide transition-all active:scale-90 border ${
                      isSelected
                        ? 'bg-amber/15 border-amber/40 text-amber'
                        : 'bg-bg-input border-border text-text-secondary'
                    }`}
                    title={`${team.city} ${team.name}`}
                  >
                    {team.abbr}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TeamPicker({ player1Name, player2Name, team1, team2, onTeam1, onTeam2 }: Props) {
  return (
    <div className="card p-4 space-y-4">
      <div className="section-label mb-0">NFL Teams <span className="text-text-muted/50 normal-case tracking-normal">(optional)</span></div>
      <TeamSelector label={player1Name} selected={team1} onSelect={onTeam1} />
      <TeamSelector label={player2Name} selected={team2} onSelect={onTeam2} />
    </div>
  )
}
