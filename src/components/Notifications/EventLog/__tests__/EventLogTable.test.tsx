import {
  eventLogSeverityLabelStyles,
  severityDescription,
  toSeverityLabelProps,
} from '../EventLogTable';

describe('EventLogTable severity', () => {
  describe.each(['CRITICAL', 'IMPORTANT', 'MODERATE', 'LOW', 'NONE'] as const)(
    'toSeverityLabelProps(%s)',
    (severity) => {
      it('returns an icon element', () => {
        const result = toSeverityLabelProps(severity);
        expect(result.icon).toBeTruthy();
      });

      it('uses inline Label style with PatternFly severity surface tokens', () => {
        const result = toSeverityLabelProps(severity);
        expect(result.style).toEqual(eventLogSeverityLabelStyles[severity]);
        expect(result.status).toBeUndefined();
        expect(result.color).toBeUndefined();
        expect(result.variant).toBeUndefined();
      });
    }
  );

  describe('toSeverityLabelProps(UNDEFINED)', () => {
    it('returns outline grey label with severity undefined border style', () => {
      const result = toSeverityLabelProps('UNDEFINED');
      expect(result.icon).toBeTruthy();
      expect(result.style).toEqual(eventLogSeverityLabelStyles.UNDEFINED);
      expect(result.status).toBeUndefined();
      expect(result.color).toBe('grey');
      expect(result.variant).toBe('outline');
    });
  });

  it('matches UNDEFINED styling when severity is missing', () => {
    const result = toSeverityLabelProps(undefined);
    expect(result.icon).toBeTruthy();
    expect(result.style).toEqual(eventLogSeverityLabelStyles.UNDEFINED);
    expect(result.status).toBeUndefined();
    expect(result.color).toBe('grey');
    expect(result.variant).toBe('outline');
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
