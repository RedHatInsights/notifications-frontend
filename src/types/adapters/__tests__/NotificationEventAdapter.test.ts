import { Schemas } from '../../../generated/OpenapiNotifications';
import { IntegrationType } from '../../Integration';
import { toNotificationEvent } from '../NotificationEventAdapter';

type ServerEvent = Schemas.EventLogEntry;

describe('src/types/adapters/NotificationEventAdapter', () => {
  it('toNotificationEvent', () => {
    const event: ServerEvent = {
      id: 'my-id',
      event_type: 'my-event',
      application: 'my-app',
      bundle: 'my-bundle',
      created: '2020-07-10 15:00:00.000',
      payload: undefined,
      actions: [
        {
          id: 'ignored',
          endpoint_id: 'id-01',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'PROCESSING',
          recipients_count: 5,
        },
        {
          id: 'ignored',
          endpoint_id: 'id-01',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'SENT',
          recipients_count: 10,
        },
        {
          id: 'ignored',
          endpoint_id: 'id-01',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'FAILED',
          recipients_count: 3,
        },
        {
          id: 'ignored',
          endpoint_id: 'id-02',
          endpoint_type: 'webhook',
          details: {},
          status: 'SUCCESS',
          recipients_count: 1,
        },
        {
          id: 'ignored',
          endpoint_id: 'id-03',
          endpoint_type: 'webhook',
          details: {},
          status: 'FAILED',
          recipients_count: 2,
        },
        {
          id: 'ignored',
          endpoint_id: 'id-04',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'SUCCESS',
          recipients_count: 7,
        },
        {
          id: 'ignored',
          endpoint_id: 'id-04',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'SUCCESS',
          recipients_count: 8,
        },
      ],
    };

    expect(toNotificationEvent(event)).toStrictEqual({
      id: 'my-id',
      bundle: 'my-bundle',
      application: 'my-app',
      event: 'my-event',
      date: new Date('2020-07-10T15:00:00.000Z'),
      severity: undefined,
      actions: [
        {
          id: 'id-01',
          status: {
            last: 'SENT',
            isDegraded: true,
          },
          endpointType: IntegrationType.EMAIL_SUBSCRIPTION,
          successCount: 2,
          errorCount: 1,
          recipientsCount: 3,
        },
        {
          id: 'id-04',
          status: {
            last: 'SUCCESS',
            isDegraded: false,
          },
          endpointType: IntegrationType.EMAIL_SUBSCRIPTION,
          successCount: 2,
          errorCount: 0,
          recipientsCount: 8,
        },
        {
          id: 'id-02',
          status: {
            last: 'SUCCESS',
            isDegraded: false,
          },
          endpointType: IntegrationType.WEBHOOK,
          successCount: 1,
          errorCount: 0,
          recipientsCount: 1,
        },
        {
          id: 'id-03',
          status: {
            last: 'FAILED',
            isDegraded: true,
          },
          endpointType: IntegrationType.WEBHOOK,
          successCount: 0,
          errorCount: 1,
          recipientsCount: 2,
        },
      ],
    });
  });

  it('toNotificationEvent handles null/undefined recipients_count', () => {
    const event: ServerEvent = {
      id: 'no-recipients-id',
      event_type: 'test-event',
      application: 'test-app',
      bundle: 'test-bundle',
      created: '2024-01-01 12:00:00.000',
      actions: [
        {
          id: 'ignored',
          endpoint_id: 'id-01',
          endpoint_type: 'webhook',
          details: {},
          status: 'SUCCESS',
          recipients_count: null,
        },
        {
          id: 'ignored',
          endpoint_id: 'id-02',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'SUCCESS',
        },
      ],
    };

    const result = toNotificationEvent(event);
    expect(result.actions[0].recipientsCount).toBeUndefined();
    expect(result.actions[1].recipientsCount).toBeUndefined();
  });

  it('toNotificationEvent uses latest recipientsCount when grouping', () => {
    const event: ServerEvent = {
      id: 'grouped-id',
      event_type: 'test-event',
      application: 'test-app',
      bundle: 'test-bundle',
      created: '2024-01-01 12:00:00.000',
      actions: [
        {
          id: 'ignored',
          endpoint_id: 'id-01',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'SUCCESS',
          recipients_count: 5,
        },
        {
          id: 'ignored',
          endpoint_id: 'id-01',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'SUCCESS',
          recipients_count: 12,
        },
      ],
    };

    const result = toNotificationEvent(event);
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0].recipientsCount).toBe(12);
  });

  it('toNotificationEvent maps severity', () => {
    const event: ServerEvent = {
      id: 'sev-id',
      event_type: 'sev-event',
      application: 'sev-app',
      bundle: 'sev-bundle',
      created: '2024-01-01 12:00:00.000',
      severity: 'CRITICAL',
      actions: [],
    };

    expect(toNotificationEvent(event)).toStrictEqual({
      id: 'sev-id',
      bundle: 'sev-bundle',
      application: 'sev-app',
      event: 'sev-event',
      date: new Date('2024-01-01T12:00:00.000Z'),
      severity: 'CRITICAL',
      actions: [],
    });
  });

  it('toNotificationEvent handles null severity', () => {
    const event: ServerEvent = {
      id: 'null-sev-id',
      event_type: 'null-sev-event',
      application: 'null-sev-app',
      bundle: 'null-sev-bundle',
      created: '2024-01-01 12:00:00.000',
      severity: null,
      actions: [],
    };

    expect(toNotificationEvent(event)).toStrictEqual({
      id: 'null-sev-id',
      bundle: 'null-sev-bundle',
      application: 'null-sev-app',
      event: 'null-sev-event',
      date: new Date('2024-01-01T12:00:00.000Z'),
      severity: undefined,
      actions: [],
    });
  });

  it('toNotificationEvent treats UNDEFINED severity as undefined', () => {
    const event: ServerEvent = {
      id: 'undefined-sev-id',
      event_type: 'undefined-sev-event',
      application: 'undefined-sev-app',
      bundle: 'undefined-sev-bundle',
      created: '2024-01-01 12:00:00.000',
      severity: 'UNDEFINED',
      actions: [],
    };

    expect(toNotificationEvent(event)).toStrictEqual({
      id: 'undefined-sev-id',
      bundle: 'undefined-sev-bundle',
      application: 'undefined-sev-app',
      event: 'undefined-sev-event',
      date: new Date('2024-01-01T12:00:00.000Z'),
      severity: undefined,
      actions: [],
    });
  });
});
