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

export abstract class BaseNotificationRecipient extends Recipient {
    readonly integrationId: UUID | undefined;
    readonly key: string;
    readonly description: string | undefined;

    protected constructor(displayName: string, description: string, integrationId: UUID | undefined, key: string) {
        super(displayName);

        this.key = key;
        this.description = description;
        this.integrationId = integrationId;
    }

    public getKey() {
        return this.key;
    }
}

export class NotificationRecipient extends BaseNotificationRecipient {
    readonly sendToAdmin: boolean;

    public constructor(integrationId: UUID | undefined, sendToAdmin: boolean) {
        let displayName = 'Users:';
        let description = '';
        if (sendToAdmin) {
            displayName += ' Admins';
            description = 'Organization administrators for your account';
        } else {
            displayName += ' All';
            description = 'All users in your organization who subscribed to this email in their User Preferences';
        }

        super(
            displayName,
            description,
            integrationId,
            sendToAdmin ? 'admin' : 'user'
        );

        this.sendToAdmin = sendToAdmin;
    }

    public equals(recipient: Recipient) {
        if (recipient instanceof NotificationRecipient) {
            return recipient.sendToAdmin === this.sendToAdmin;
        }

        return false;
    }
}

export class NotificationRbacGroupRecipient extends BaseNotificationRecipient {
    readonly groupId: UUID;
    readonly isLoading: boolean;

    public constructor(integrationId: UUID | undefined, groupId: UUID, displayName: string | undefined) {

        const description = 'All users in the RBAC group';

        super(
            displayName ?? 'Loading',
            description,
            integrationId,
            `rbac-group-${groupId}`
        );

        this.groupId = groupId;
        this.isLoading = displayName === undefined;
    }

    public equals(recipient: Recipient) {
        if (recipient instanceof NotificationRbacGroupRecipient) {
            return recipient.groupId === this.groupId;
        }

        return false;
    }
}

