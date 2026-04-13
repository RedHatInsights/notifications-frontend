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
        },
        {
          id: 'ignored',
          endpoint_id: 'id-01',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'SENT',
        },
        {
          id: 'ignored',
          endpoint_id: 'id-01',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'FAILED',
        },
        {
          id: 'ignored',
          endpoint_id: 'id-02',
          endpoint_type: 'webhook',
          details: {},
          status: 'SUCCESS',
        },
        {
          id: 'ignored',
          endpoint_id: 'id-03',
          endpoint_type: 'webhook',
          details: {},
          status: 'FAILED',
        },
        {
          id: 'ignored',
          endpoint_id: 'id-04',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'SUCCESS',
        },
        {
          id: 'ignored',
          endpoint_id: 'id-04',
          endpoint_type: 'email_subscription',
          details: {},
          status: 'SUCCESS',
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
        },
      ],
    });
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
});
