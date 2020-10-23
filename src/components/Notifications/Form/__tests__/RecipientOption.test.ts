import { RecipientOption } from '../RecipientOption';
import { IntegrationType } from '../../../../types/Integration';

describe('src/components/Notifications/Form/RecipientOption', () => {
    it('CompareTo returns equal for the same object', () => {
        const a = new RecipientOption('foobar');
        const b = new RecipientOption({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });

        expect(a.compareTo(a)).toBe(true);
        expect(b.compareTo(b)).toBe(true);
    });

    it('CompareTo returns true for objects with same string', () => {
        const a = new RecipientOption('foobar');
        const b = new RecipientOption('foobar');

        expect(a.compareTo(b)).toBe(true);
    });

    it('CompareTo returns true for objects with same IntegrationRef', () => {
        const c = new RecipientOption({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });
        const d = new RecipientOption({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });

        expect(c.compareTo(d)).toBe(true);
    });

    it('CompareTo returns false for objects with different strings', () => {
        const a = new RecipientOption('foobar');
        const b = new RecipientOption('xyz');
        expect(a.compareTo(b)).toBe(false);
    });

    it('CompareTo returns false for objects with different integration ref', () => {
        const c = new RecipientOption({
            name: 'baz',
            isEnabled: true,
            type: IntegrationType.WEBHOOK,
            id: 'abc'
        });
        const d = new RecipientOption({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });

        expect(c.compareTo(d)).toBe(false);
    });

    it('CompareTo returns false when mixing strings and integration ref', () => {
        const c = new RecipientOption('bar');
        const d = new RecipientOption({
            name: 'bar',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });

        expect(c.compareTo(d)).toBe(false);
    });

    it('toString returns the string', () => {
        const a = new RecipientOption('bar');

        expect(a.toString()).toEqual('bar');
    });

    it('toString returns the name of the integrationRef', () => {
        const a = new RecipientOption({
            name: 'baz',
            isEnabled: false,
            type: IntegrationType.WEBHOOK,
            id: '123456789'
        });

        expect(a.toString()).toEqual('baz');
    });
});
