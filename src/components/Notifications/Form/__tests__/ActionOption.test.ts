import { ActionOption } from '../ActionOption';
import { IntegrationType } from '../../../../types/Integration';
import { NotificationType } from '../../../../types/Notification';

describe('src/components/Notifications/Form/ActionOption', () => {
    it('CompareTo returns equal for the same object', () => {
        const a = new ActionOption({
            kind: 'integration',
            type: IntegrationType.WEBHOOK
        });
        expect(a.compareTo(a)).toBe(true);
    });

    it('CompareTo returns true for objects with same integration types', () => {
        const a = new ActionOption({
            kind: 'integration',
            type: IntegrationType.WEBHOOK
        });
        const b = new ActionOption({
            kind: 'integration',
            type: IntegrationType.WEBHOOK
        });
        expect(a.compareTo(b)).toBe(true);
    });

    it('CompareTo returns true for objects with same notification types', () => {
        const a = new ActionOption({
            kind: 'notification',
            type: NotificationType.PLATFORM_ALERT
        });
        const b = new ActionOption({
            kind: 'notification',
            type: NotificationType.PLATFORM_ALERT
        });
        expect(a.compareTo(b)).toBe(true);
    });

    it('CompareTo returns false for objects with different notification types', () => {
        const a = new ActionOption({
            kind: 'notification',
            type: NotificationType.DRAWER
        });
        const b = new ActionOption({
            kind: 'notification',
            type: NotificationType.PLATFORM_ALERT
        });
        expect(a.compareTo(b)).toBe(false);
    });

    it('CompareTo returns false for objects with integration and notification types', () => {
        const a = new ActionOption({
            kind: 'integration',
            type: IntegrationType.WEBHOOK
        });
        const b = new ActionOption({
            kind: 'notification',
            type: NotificationType.PLATFORM_ALERT
        });
        expect(a.compareTo(b)).toBe(false);
    });

    it('CompareTo returns false for other objects', () => {
        const a = new ActionOption({
            kind: 'integration',
            type: IntegrationType.WEBHOOK
        });
        expect(a.compareTo('foo')).toBe(false);
        expect(a.compareTo(true)).toBe(false);
        expect(a.compareTo({ stuff: 'bar' })).toBe(false);
    });

    it('toString returns the notification type name', () => {
        const a = new ActionOption({
            kind: 'notification',
            type: NotificationType.PLATFORM_ALERT
        });
        expect(a.toString()).toEqual('Platform alert');
    });

    it('toString of integration returns the notification type name plus the integration', () => {
        const a = new ActionOption({
            kind: 'integration',
            type: IntegrationType.WEBHOOK
        });
        expect(a.toString()).toEqual('Integration: Webhook');
    });
});
