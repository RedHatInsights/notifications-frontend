/**
 * Ensures a timestamp string is treated as UTC by appending 'Z' if not present.
 *
 * The backend sends LocalDateTime strings without timezone information
 * (e.g., "2026-09-23T14:30:00"), but these are intended to be UTC timestamps.
 * Without the 'Z' suffix, JavaScript's Date constructor interprets them as
 * local time, causing incorrect "time ago" calculations.
 *
 * @param timestamp - ISO 8601 timestamp string
 * @returns Timestamp string guaranteed to have UTC indicator
 *
 * @example
 * ensureUtcTimestamp("2026-09-23T14:30:00")   // "2026-09-23T14:30:00Z"
 * ensureUtcTimestamp("2026-09-23T14:30:00Z")  // "2026-09-23T14:30:00Z" (unchanged)
 */
export const ensureUtcTimestamp = (timestamp: string): string => {
  if (!timestamp) {
    return timestamp;
  }

  // Already has timezone indicator (Z or +/-offset)
  if (timestamp.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(timestamp)) {
    return timestamp;
  }

  // Append Z to indicate UTC
  return `${timestamp}Z`;
};
