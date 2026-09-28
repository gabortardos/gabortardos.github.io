/**
 * Join class names, skipping falsy values.
 * Used throughout the UI so conditional classes stay readable.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
