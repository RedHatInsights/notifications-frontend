import { IntegrationType, isCamelIntegrationType, isCamelType, isUserIntegrationType, UserIntegrationType } from '../Integration';

describe('src/types/Integration', () => {
    it('isCamelType returns true for camel subtypes', () => {
        expect(isCamelType(IntegrationType.WEBHOOK)).toBe(false);
        expect(isCamelType(IntegrationType.ANSIBLE)).toBe(false);
        expect(isCamelType(IntegrationType.EMAIL_SUBSCRIPTION)).toBe(false);
        expect(isCamelType(IntegrationType.SPLUNK)).toBe(true);
        expect(isCamelType(IntegrationType.SLACK)).toBe(true);
        expect(isCamelType(IntegrationType.TEAMS)).toBe(true);
        expect(isCamelType(undefined)).toBe(false);
        expect(isCamelType(UserIntegrationType.WEBHOOK)).toBe(false);
        expect(isCamelType(UserIntegrationType.SPLUNK)).toBe(true);
        expect(isCamelType(UserIntegrationType.SLACK)).toBe(true);
        expect(isCamelType(UserIntegrationType.TEAMS)).toBe(true);
        expect(isCamelType(UserIntegrationType.GOOGLE_CHAT)).toBe(true);
    });

    it('isCamelIntegrationType returns true for integrations with a camel subtype', () => {
        expect(isCamelIntegrationType({})).toBe(false);
        expect(isCamelIntegrationType({
            type: IntegrationType.WEBHOOK
        })).toBe(false);
        expect(isCamelIntegrationType({
            type: IntegrationType.ANSIBLE
        })).toBe(false);
        expect(isCamelIntegrationType({
            type: IntegrationType.SPLUNK
        })).toBe(true);
        expect(isCamelIntegrationType({
            type: UserIntegrationType.SLACK
        })).toBe(true);
        expect(isCamelIntegrationType({
            type: UserIntegrationType.TEAMS
        })).toBe(true);
        expect(isCamelIntegrationType({
            type: UserIntegrationType.GOOGLE_CHAT
        })).toBe(true);
        expect(isCamelIntegrationType({
            name: 'camel'
        })).toBe(false);
    });

    it('isUserIntegrationType returns true for UserIntegrationType', () => {
        expect(isUserIntegrationType(IntegrationType.WEBHOOK)).toBe(true);
        expect(isUserIntegrationType(IntegrationType.ANSIBLE)).toBe(true);
        expect(isUserIntegrationType(IntegrationType.EMAIL_SUBSCRIPTION)).toBe(false);
        expect(isUserIntegrationType(IntegrationType.SPLUNK)).toBe(true);
        expect(isUserIntegrationType(IntegrationType.SLACK)).toBe(true);
        expect(isUserIntegrationType(IntegrationType.TEAMS)).toBe(true);
        expect(isUserIntegrationType(IntegrationType.GOOGLE_CHAT)).toBe(true);
        expect(isUserIntegrationType(undefined)).toBe(false);
    });
});
