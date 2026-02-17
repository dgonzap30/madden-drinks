export interface NflTeam {
  abbr: string
  name: string
  city: string
  color: string  // primary jersey color
  conference: string
  division: string
}

export const NFL_TEAMS: NflTeam[] = [
  { abbr: 'ARI', name: 'Cardinals', city: 'Arizona', color: '#97233F', conference: 'NFC', division: 'West' },
  { abbr: 'ATL', name: 'Falcons', city: 'Atlanta', color: '#A71930', conference: 'NFC', division: 'South' },
  { abbr: 'BAL', name: 'Ravens', city: 'Baltimore', color: '#241773', conference: 'AFC', division: 'North' },
  { abbr: 'BUF', name: 'Bills', city: 'Buffalo', color: '#00338D', conference: 'AFC', division: 'East' },
  { abbr: 'CAR', name: 'Panthers', city: 'Carolina', color: '#0085CA', conference: 'NFC', division: 'South' },
  { abbr: 'CHI', name: 'Bears', city: 'Chicago', color: '#0B162A', conference: 'NFC', division: 'North' },
  { abbr: 'CIN', name: 'Bengals', city: 'Cincinnati', color: '#FB4F14', conference: 'AFC', division: 'North' },
  { abbr: 'CLE', name: 'Browns', city: 'Cleveland', color: '#311D00', conference: 'AFC', division: 'North' },
  { abbr: 'DAL', name: 'Cowboys', city: 'Dallas', color: '#003594', conference: 'NFC', division: 'East' },
  { abbr: 'DEN', name: 'Broncos', city: 'Denver', color: '#FB4F14', conference: 'AFC', division: 'West' },
  { abbr: 'DET', name: 'Lions', city: 'Detroit', color: '#0076B6', conference: 'NFC', division: 'North' },
  { abbr: 'GB', name: 'Packers', city: 'Green Bay', color: '#203731', conference: 'NFC', division: 'North' },
  { abbr: 'HOU', name: 'Texans', city: 'Houston', color: '#03202F', conference: 'AFC', division: 'South' },
  { abbr: 'IND', name: 'Colts', city: 'Indianapolis', color: '#002C5F', conference: 'AFC', division: 'South' },
  { abbr: 'JAX', name: 'Jaguars', city: 'Jacksonville', color: '#006778', conference: 'AFC', division: 'South' },
  { abbr: 'KC', name: 'Chiefs', city: 'Kansas City', color: '#E31837', conference: 'AFC', division: 'West' },
  { abbr: 'LV', name: 'Raiders', city: 'Las Vegas', color: '#A5ACAF', conference: 'AFC', division: 'West' },
  { abbr: 'LAC', name: 'Chargers', city: 'Los Angeles', color: '#0080C6', conference: 'AFC', division: 'West' },
  { abbr: 'LAR', name: 'Rams', city: 'Los Angeles', color: '#003594', conference: 'NFC', division: 'West' },
  { abbr: 'MIA', name: 'Dolphins', city: 'Miami', color: '#008E97', conference: 'AFC', division: 'East' },
  { abbr: 'MIN', name: 'Vikings', city: 'Minnesota', color: '#4F2683', conference: 'NFC', division: 'North' },
  { abbr: 'NE', name: 'Patriots', city: 'New England', color: '#002244', conference: 'AFC', division: 'East' },
  { abbr: 'NO', name: 'Saints', city: 'New Orleans', color: '#D3BC8D', conference: 'NFC', division: 'South' },
  { abbr: 'NYG', name: 'Giants', city: 'New York', color: '#0B2265', conference: 'NFC', division: 'East' },
  { abbr: 'NYJ', name: 'Jets', city: 'New York', color: '#125740', conference: 'AFC', division: 'East' },
  { abbr: 'PHI', name: 'Eagles', city: 'Philadelphia', color: '#004C54', conference: 'NFC', division: 'East' },
  { abbr: 'PIT', name: 'Steelers', city: 'Pittsburgh', color: '#FFB612', conference: 'AFC', division: 'North' },
  { abbr: 'SF', name: '49ers', city: 'San Francisco', color: '#AA0000', conference: 'NFC', division: 'West' },
  { abbr: 'SEA', name: 'Seahawks', city: 'Seattle', color: '#002244', conference: 'NFC', division: 'West' },
  { abbr: 'TB', name: 'Buccaneers', city: 'Tampa Bay', color: '#D50A0A', conference: 'NFC', division: 'South' },
  { abbr: 'TEN', name: 'Titans', city: 'Tennessee', color: '#0C2340', conference: 'AFC', division: 'South' },
  { abbr: 'WAS', name: 'Commanders', city: 'Washington', color: '#5A1414', conference: 'NFC', division: 'East' },
]

export function getTeamByAbbr(abbr: string): NflTeam | undefined {
  return NFL_TEAMS.find((t) => t.abbr === abbr)
}

export interface Division {
  conference: string
  division: string
  teams: string[] // abbreviations
}

export const NFL_DIVISIONS: Division[] = [
  { conference: 'AFC', division: 'East', teams: ['BUF', 'MIA', 'NE', 'NYJ'] },
  { conference: 'AFC', division: 'North', teams: ['BAL', 'CIN', 'CLE', 'PIT'] },
  { conference: 'AFC', division: 'South', teams: ['HOU', 'IND', 'JAX', 'TEN'] },
  { conference: 'AFC', division: 'West', teams: ['DEN', 'KC', 'LAC', 'LV'] },
  { conference: 'NFC', division: 'East', teams: ['DAL', 'NYG', 'PHI', 'WAS'] },
  { conference: 'NFC', division: 'North', teams: ['CHI', 'DET', 'GB', 'MIN'] },
  { conference: 'NFC', division: 'South', teams: ['ATL', 'CAR', 'NO', 'TB'] },
  { conference: 'NFC', division: 'West', teams: ['ARI', 'LAR', 'SEA', 'SF'] },
]
