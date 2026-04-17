import {
  SEVERITY_VALUES,
  severityDescription,
  severityDisplayName,
  toSeverityLabelProps,
} from '../severityUtils';

describe('severityUtils', () => {
  describe('toSeverityLabelProps', () => {
    it.each(['CRITICAL', 'IMPORTANT', 'MODERATE', 'LOW', 'NONE'] as const)(
      'returns an icon and style for %s severity',
      (severity) => {
        const result = toSeverityLabelProps(severity);
        expect(result.icon).toBeTruthy();
        expect(result.style).toBeTruthy();
      }
    );

    it('returns outline variant for UNDEFINED severity', () => {
      const result = toSeverityLabelProps('UNDEFINED');
      expect(result.icon).toBeTruthy();
      expect(result.color).toBe('grey');
      expect(result.variant).toBe('outline');
      expect(result.style).toBeTruthy();
    });

    it('returns outline variant for undefined severity', () => {
      const result = toSeverityLabelProps(undefined);
      expect(result.icon).toBeTruthy();
      expect(result.color).toBe('grey');
      expect(result.variant).toBe('outline');
      expect(result.style).toBeTruthy();
    });
  });

  describe('severityDisplayName', () => {
    it.each(['CRITICAL', 'IMPORTANT', 'MODERATE', 'LOW', 'NONE', 'UNDEFINED'] as const)(
      'has a display name for %s',
      (severity) => {
        expect(severityDisplayName[severity]).toBeTruthy();
        expect(typeof severityDisplayName[severity]).toBe('string');
      }
    );

    it('maps to human-readable names', () => {
      expect(severityDisplayName.CRITICAL).toBe('Critical');
      expect(severityDisplayName.IMPORTANT).toBe('Important');
      expect(severityDisplayName.MODERATE).toBe('Moderate');
      expect(severityDisplayName.LOW).toBe('Low');
      expect(severityDisplayName.NONE).toBe('None');
      expect(severityDisplayName.UNDEFINED).toBe('Undefined');
    });
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

  describe('SEVERITY_VALUES', () => {
    it('contains all six severity levels', () => {
      expect(SEVERITY_VALUES).toHaveLength(6);
      expect(SEVERITY_VALUES).toContain('CRITICAL');
      expect(SEVERITY_VALUES).toContain('IMPORTANT');
      expect(SEVERITY_VALUES).toContain('MODERATE');
      expect(SEVERITY_VALUES).toContain('LOW');
      expect(SEVERITY_VALUES).toContain('NONE');
      expect(SEVERITY_VALUES).toContain('UNDEFINED');
    });
  });
});
