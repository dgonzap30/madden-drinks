import { getTeamByAbbr } from '../../data/nflTeams.ts'

interface Props {
  abbr: string
  size?: 'sm' | 'xs'
}

export default function TeamBadge({ abbr, size = 'xs' }: Props) {
  const team = getTeamByAbbr(abbr)
  if (!team) return null

  const isDark = ['#0B162A', '#002244', '#0C2340', '#311D00', '#03202F', '#002C5F', '#125740', '#004C54', '#203731', '#241773', '#0B2265'].includes(team.color)

  return (
    <span
      className={`font-bold font-display rounded-sm inline-block leading-none ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[9px] px-1 py-0.5'
      }`}
      style={{
        backgroundColor: team.color + '25',
        color: isDark ? 'var(--color-text-secondary)' : team.color,
        border: `1px solid ${team.color}40`,
      }}
    >
      {team.abbr}
    </span>
  )
}
