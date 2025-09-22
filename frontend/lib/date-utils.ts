// Utility functions for consistent date formatting to prevent hydration issues

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toISOString().split('T')[0] // YYYY-MM-DD format
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toISOString().replace('T', ' ').split('.')[0] // YYYY-MM-DD HH:MM:SS format
}

export function isDateInFuture(date: string | Date): boolean {
  return new Date(date) > new Date()
}

export function getDaysDifference(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
}

// Utility function to safely truncate strings
export function safeTruncate(text: any, maxLength: number = 50): string {
  if (!text || typeof text !== 'string') {
    return ''
  }
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Utility function to safely get string value
export function safeString(value: any): string {
  if (typeof value === 'string') {
    return value
  }
  if (value && typeof value.toString === 'function') {
    return value.toString()
  }
  return ''
}
