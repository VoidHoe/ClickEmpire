export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(2)}K`
  return Math.floor(amount).toString()
}

export function canAfford(currency: number, cost: number): boolean {
  return currency >= cost
}
