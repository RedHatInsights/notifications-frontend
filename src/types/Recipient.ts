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

    public constructor(integrationId: UUID | undefined, sendToAdmin: boolean) {
        let displayName = 'Users:';
        if (sendToAdmin) {
            displayName += ' Admins';
        } else {
            displayName += ' All';
        }

        super(displayName);
        this.key = sendToAdmin ? 'admin' : 'user';
        this.sendToAdmin = sendToAdmin;
        this.integrationId = integrationId;
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

