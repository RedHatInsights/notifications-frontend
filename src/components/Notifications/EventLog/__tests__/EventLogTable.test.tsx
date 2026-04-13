import { severityDescription, toSeverityLabelProps } from '../EventLogTable';

describe('EventLogTable severity', () => {
  describe.each(['CRITICAL', 'IMPORTANT', 'MODERATE', 'LOW', 'NONE', 'UNDEFINED'] as const)(
    'toSeverityLabelProps(%s)',
    (severity) => {
      it('returns an icon element', () => {
        const result = toSeverityLabelProps(severity);
        expect(result.icon).toBeTruthy();
      });

      it('does not set a color prop (uses PF tokens)', () => {
        const result = toSeverityLabelProps(severity);
        expect(result.color).toBeUndefined();
      });
    }
  );

  it('returns icon for undefined severity', () => {
    const result = toSeverityLabelProps(undefined);
    expect(result.icon).toBeTruthy();
    expect(result.color).toBeUndefined();
  });

  describe('severityDescription', () => {
    it.each(['CRITICAL', 'IMPORTANT', 'MODERATE', 'LOW', 'NONE', 'UNDEFINED'] as const)(
      'has a non-empty description for %s',
      (severity) => {
        expect(severityDescription[severity]).toBeTruthy();
        expect(typeof severityDescription[severity]).toBe('string');
        expect(severityDescription[severity].length).toBeGreaterThan(0);
      }
    );
  });
});
