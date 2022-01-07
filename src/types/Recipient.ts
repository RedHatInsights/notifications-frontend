import { IntegrationRef, UUID } from './Notification';

export abstract class Recipient {
    readonly displayName: string;

    protected constructor(displayName: string) {
        this.displayName = displayName;
    }

    public abstract getKey();
    public abstract equals(recipient: Recipient);
}

export class IntegrationRecipient extends Recipient {
    readonly integration: IntegrationRef;

    public constructor(integration: IntegrationRef) {
        super(integration.name + (integration.isEnabled ? '' : ' - Disabled'));
        this.integration = integration;
    }

    public getKey() {
        return this.integration.id;
    }

    public equals(recipient: Recipient) {
        if (recipient instanceof IntegrationRecipient) {
            return recipient.integration.id === this.integration.id;
        }

        return false;
    }
}

export class NotificationRecipient extends Recipient {
    readonly sendToAdmin: boolean;
    readonly integrationId: UUID | undefined;
    readonly key: string;
    readonly description: string | undefined;

    public constructor(integrationId: UUID | undefined, sendToAdmin: boolean, description: string) {
        let displayName = 'Users:';
        if (sendToAdmin) {
            displayName += ' Admins';
            description += ' Organization administrators for your account';
        } else {
            displayName += ' All';
            description += ' All users in your organization who subscribed to this email in their User Preferences';
        }

        super(displayName);
        this.key = sendToAdmin ? 'admin' : 'user';
        this.sendToAdmin = sendToAdmin;
        this.integrationId = integrationId;
        this.description = description;
    }

    public getKey() {
        return this.key;
    }

    public equals(recipient: Recipient) {
        if (recipient instanceof NotificationRecipient) {
            return recipient.sendToAdmin === this.sendToAdmin;
        }

        return false;
    }
}

