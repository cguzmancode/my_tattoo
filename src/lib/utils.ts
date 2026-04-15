export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function formatCurrency(cents: number): string {
  const euros = cents / 100
  return `€${euros.toFixed(2)}`
}

export function isFutureDate(date: Date): boolean {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const inputDate = new Date(date)
  inputDate.setHours(0, 0, 0, 0)
  return inputDate > now
}
