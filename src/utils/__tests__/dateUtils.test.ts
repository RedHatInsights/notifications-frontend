import { ensureUtcTimestamp } from '../dateUtils';

describe('ensureUtcTimestamp', () => {
  it('appends Z to timestamp without timezone info', () => {
    expect(ensureUtcTimestamp('2026-09-23T14:30:00')).toBe('2026-09-23T14:30:00Z');
  });

  it('does not modify timestamp that already has Z', () => {
    expect(ensureUtcTimestamp('2026-09-23T14:30:00Z')).toBe('2026-09-23T14:30:00Z');
  });

  it('does not modify timestamp with timezone offset', () => {
    expect(ensureUtcTimestamp('2026-09-23T14:30:00+02:00')).toBe('2026-09-23T14:30:00+02:00');
    expect(ensureUtcTimestamp('2026-09-23T14:30:00-05:00')).toBe('2026-09-23T14:30:00-05:00');
  });

  it('handles empty string', () => {
    expect(ensureUtcTimestamp('')).toBe('');
  });

  it('handles timestamp with milliseconds', () => {
    expect(ensureUtcTimestamp('2026-09-23T14:30:00.123')).toBe('2026-09-23T14:30:00.123Z');
  });

  describe('timezone parsing behavior verification', () => {
    it('correctly parses UTC timestamp for time-ago calculation', () => {
      const utcTimestamp = '2026-09-23T14:30:00';
      const normalized = ensureUtcTimestamp(utcTimestamp);

      // Parse the normalized timestamp
      const dateWithZ = new Date(normalized);

      // When normalized with Z, the timestamp should be parsed as UTC
      expect(normalized).toBe('2026-09-23T14:30:00Z');
      expect(dateWithZ.toISOString()).toBe('2026-09-23T14:30:00.000Z');

      // Without Z, it would be parsed as local time (varying by machine timezone)
      // This fix ensures consistent UTC parsing for time-ago calculations
    });
  });
});
