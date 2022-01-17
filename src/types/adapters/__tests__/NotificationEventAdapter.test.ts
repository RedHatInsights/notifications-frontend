import { Schemas } from '../../../generated/OpenapiNotifications';
import { NotificationEventStatus } from '../../Event';
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
                    invocation_result: true,
                    details: { }
                },
                {
                    id: 'ignored',
                    endpoint_id: 'id-01',
                    endpoint_type: 'email_subscription',
                    invocation_result: true,
                    details: { }
                },
                {
                    id: 'ignored',
                    endpoint_id: 'id-01',
                    endpoint_type: 'email_subscription',
                    invocation_result: false,
                    details: { }
                },
                {
                    id: 'ignored',
                    endpoint_id: 'id-02',
                    endpoint_type: 'webhook',
                    invocation_result: true,
                    details: { }
                },
                {
                    id: 'ignored',
                    endpoint_id: 'id-03',
                    endpoint_type: 'webhook',
                    invocation_result: false,
                    details: { }
                },
                {
                    id: 'ignored',
                    endpoint_id: 'id-04',
                    endpoint_type: 'email_subscription',
                    invocation_result: true,
                    details: { }
                },
                {
                    id: 'ignored',
                    endpoint_id: 'id-04',
                    endpoint_type: 'email_subscription',
                    invocation_result: true,
                    details: { }
                }
            ]
        };

        expect(toNotificationEvent(event)).toStrictEqual({
            id: 'my-id',
            bundle: 'my-bundle',
            application: 'my-app',
            event: 'my-event',
            date: new Date('2020-07-10T15:00:00.000Z'),
            actions: [
                {
                    id: 'id-01',
                    status: NotificationEventStatus.WARNING,
                    endpointType: IntegrationType.EMAIL_SUBSCRIPTION,
                    successCount: 2,
                    errorCount: 1
                },
                {
                    id: 'id-02',
                    status: NotificationEventStatus.SUCCESS,
                    endpointType: IntegrationType.WEBHOOK,
                    successCount: 1,
                    errorCount: 0
                },
                {
                    id: 'id-03',
                    status: NotificationEventStatus.ERROR,
                    endpointType: IntegrationType.WEBHOOK,
                    successCount: 0,
                    errorCount: 1
                },
                {
                    id: 'id-04',
                    status: NotificationEventStatus.SUCCESS,
                    endpointType: IntegrationType.EMAIL_SUBSCRIPTION,
                    successCount: 2,
                    errorCount: 0
                }
            ]
        });
    });
});
