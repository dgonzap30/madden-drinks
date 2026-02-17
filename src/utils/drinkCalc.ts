export function calculateDrinksOwed(score1: number, score2: number): number {
  const diff = Math.abs(score1 - score2)
  if (diff === 0) return 0
  return Math.ceil(diff / 8)
}

export function describeDrinks(drinks: number): string {
  if (drinks === 0) return 'No shots'
  if (drinks === 1) return '1 shot'
  return `${drinks} shots`
}

export function describeFulfillment(fulfilled: number, owed: number): string {
  if (owed === 0) return ''
  if (fulfilled >= owed) return `${owed}/${owed} shots`
  return `${fulfilled}/${owed} shots`
}

export function describeScoreGap(score1: number, score2: number): string {
  const diff = Math.abs(score1 - score2)
  if (diff === 0) return 'Tied'
  const scores = Math.ceil(diff / 8)
  if (scores === 1) return '1-score game'
  return `${scores}-score game`
}
