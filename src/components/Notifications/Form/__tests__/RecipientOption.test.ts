import { IntegrationType } from '../../../../types/Integration';
import { IntegrationRecipient, NotificationUserRecipient } from '../../../../types/Recipient';
import { RecipientOption } from '../RecipientOption';

describe('src/components/Notifications/Form/RecipientOption', () => {
    it('CompareTo returns equal for the same object', () => {
        const recipient1 = new NotificationUserRecipient(undefined, true);
        const recipient2 = new IntegrationRecipient({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });

        const a = new RecipientOption(recipient1);
        const b = new RecipientOption(recipient2);

        expect(a.compareTo(a)).toBe(true);
        expect(b.compareTo(b)).toBe(true);
    });

    it('CompareTo returns true for objects with same values', () => {
        const recipient1 = new NotificationUserRecipient(undefined, true);
        const recipient2 = new NotificationUserRecipient(undefined, true);
        const a = new RecipientOption(recipient1);
        const b = new RecipientOption(recipient2);

        expect(a.compareTo(b)).toBe(true);
    });

    it('CompareTo returns true for objects with same IntegrationRef', () => {
        const recipient1 = new IntegrationRecipient({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });
        const recipient2 = new IntegrationRecipient({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });
        const c = new RecipientOption(recipient1);
        const d = new RecipientOption(recipient2);

        expect(c.compareTo(d)).toBe(true);
    });

    it('CompareTo returns false for objects with different values', () => {
        const recipient1 = new NotificationUserRecipient(undefined, true);
        const recipient2 = new NotificationUserRecipient(undefined, false);
        const a = new RecipientOption(recipient1);
        const b = new RecipientOption(recipient2);
        expect(a.compareTo(b)).toBe(false);
    });

    it('CompareTo returns false for objects with different integration ref', () => {
        const recipient1 = new IntegrationRecipient({
            name: 'baz',
            isEnabled: true,
            type: IntegrationType.WEBHOOK,
            id: 'abc'
        });
        const recipient2 = new IntegrationRecipient({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });
        const c = new RecipientOption(recipient1);
        const d = new RecipientOption(recipient2);

        expect(c.compareTo(d)).toBe(false);
    });

    it('CompareTo returns false when mixing notification and integration', () => {
        const recipient1 = new NotificationUserRecipient(undefined, true);
        const recipient2 = new IntegrationRecipient({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });
        const c = new RecipientOption(recipient1);
        const d = new RecipientOption(recipient2);

        expect(c.compareTo(d)).toBe(false);
    });

    it('toString returns the description', () => {
        const recipient1 = new NotificationUserRecipient(undefined, true);
        const a = new RecipientOption(recipient1);

        expect(a.toString()).toEqual('Admins');
    });

    it('toString returns the name of the integrationRef if enabled', () => {
        const recipient1 = new IntegrationRecipient({
            name: 'baz',
            isEnabled: true,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });
        const a = new RecipientOption(recipient1);

        expect(a.toString()).toEqual('baz');
    });

    it('toString appends "- Disabled" the name of the integrationRef', () => {
        const recipient1 = new IntegrationRecipient({
            name: 'baz',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });
        const a = new RecipientOption(recipient1);

        expect(a.toString()).toEqual('baz - Disabled');
    });
});
