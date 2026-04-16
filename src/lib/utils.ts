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

export function formatDistanceToNow(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return then.toLocaleDateString()
}
