import { toNotification, toNotifications } from '../NotificationAdapter';
import { ServerNotificationResponse } from '../../Notification';

const makeServerEventType = (
  overrides: Partial<ServerNotificationResponse> = {}
): ServerNotificationResponse => ({
  id: 'test-id-1',
  application_id: 'app-1',
  application: {
    display_name: 'Test Application',
    name: 'test-app',
    id: 'app-1',
    bundle_id: 'bundle-1',
  },
  display_name: 'Test Event Type',
  name: 'test-event-type',
  ...overrides,
});

describe('NotificationAdapter', () => {
  describe('toNotification', () => {
    it('maps basic fields correctly', () => {
      const server = makeServerEventType({
        description: 'A test event',
      });

      const result = toNotification(server);

      expect(result.id).toBe('test-id-1');
      expect(result.applicationDisplayName).toBe('Test Application');
      expect(result.eventTypeDisplayName).toBe('Test Event Type');
      expect(result.description).toBe('A test event');
    });

    it('maps defaultSeverity from default_severity', () => {
      const server = makeServerEventType({
        default_severity: 'CRITICAL',
      });

      const result = toNotification(server);

      expect(result.defaultSeverity).toBe('CRITICAL');
    });

    it('maps all severity values correctly', () => {
      const severities = ['CRITICAL', 'IMPORTANT', 'MODERATE', 'LOW', 'NONE', 'UNDEFINED'] as const;

      for (const severity of severities) {
        const server = makeServerEventType({ default_severity: severity });
        const result = toNotification(server);
        expect(result.defaultSeverity).toBe(severity);
      }
    });

    it('sets defaultSeverity to undefined when API omits it', () => {
      const server = makeServerEventType({
        default_severity: undefined,
      });

      const result = toNotification(server);

      expect(result.defaultSeverity).toBeUndefined();
    });

    it('sets defaultSeverity to undefined when API returns null', () => {
      const server = makeServerEventType({
        default_severity: null,
      });

      const result = toNotification(server);

      expect(result.defaultSeverity).toBeUndefined();
    });

    it('sets description to undefined when empty string', () => {
      const server = makeServerEventType({
        description: '',
      });

      const result = toNotification(server);

      expect(result.description).toBeUndefined();
    });

    it('throws if id is missing', () => {
      const server = makeServerEventType({ id: undefined });
      expect(() => toNotification(server)).toThrow();
    });

    it('throws if application is missing', () => {
      const server = makeServerEventType({ application: undefined });
      expect(() => toNotification(server)).toThrow();
    });
  });

  describe('toNotifications', () => {
    it('maps an array of server notifications', () => {
      const servers = [
        makeServerEventType({ id: 'id-1', default_severity: 'CRITICAL' }),
        makeServerEventType({ id: 'id-2', default_severity: 'LOW' }),
        makeServerEventType({ id: 'id-3' }),
      ];

      const results = toNotifications(servers);

      expect(results).toHaveLength(3);
      expect(results[0].defaultSeverity).toBe('CRITICAL');
      expect(results[1].defaultSeverity).toBe('LOW');
      expect(results[2].defaultSeverity).toBeUndefined();
    });
  });
});
