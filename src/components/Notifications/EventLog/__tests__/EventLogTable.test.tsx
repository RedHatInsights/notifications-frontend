import { toSeverityLabelProps } from '../EventLogTable';

describe('EventLogTable severity', () => {
  describe.each([
    ['CRITICAL', 'red'],
    ['IMPORTANT', 'orange'],
    ['MODERATE', 'yellow'],
    ['LOW', 'blue'],
    ['NONE', 'grey'],
    ['UNDEFINED', 'grey'],
  ] as const)('toSeverityLabelProps(%s)', (severity, expectedColor) => {
    it(`returns color "${expectedColor}"`, () => {
      const result = toSeverityLabelProps(severity);
      expect(result.color).toBe(expectedColor);
    });

    it('returns an icon element', () => {
      const result = toSeverityLabelProps(severity);
      expect(result.icon).toBeTruthy();
    });
  });

  it('returns grey for undefined severity', () => {
    const result = toSeverityLabelProps(undefined);
    expect(result.color).toBe('grey');
    expect(result.icon).toBeTruthy();
  });
});
