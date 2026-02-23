/**
 * Format a date to a readable string
 * @param date - The date to format
 * @param format - The format string (default: 'MM/DD/YYYY')
 * @returns Formatted date string
 */
export function formatDate(date: Date, format = 'MM/DD/YYYY'): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year));
}

/**
 * Truncate a string to a specified length
 * @param str - The string to truncate
 * @param length - The maximum length
 * @returns Truncated string with ellipsis
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}
