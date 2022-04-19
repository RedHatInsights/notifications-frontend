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

    protected constructor(displayName: string, description: string | undefined, integrationId: UUID | undefined, key: string) {
        super(displayName);

        this.key = key;
        this.description = description;
        this.integrationId = integrationId;
    }

    public getKey() {
        return this.key;
    }
}

export class NotificationUserRecipient extends BaseNotificationRecipient {
    readonly sendToAdmin: boolean;

    public constructor(integrationId: UUID | undefined, sendToAdmin: boolean) {
        let displayName;
        let description;
        if (sendToAdmin) {
            displayName = 'Admins';
            description = 'Organization administrators for your account';
        } else {
            displayName = 'All';
            description = 'All users in your organization who subscribed to this email in their User Preferences';
        }

        super(
            displayName,
            description,
            integrationId,
            sendToAdmin ? 'users-admin' : 'users-all'
        );

        this.sendToAdmin = sendToAdmin;
    }

    public equals(recipient: Recipient) {
        if (recipient instanceof NotificationUserRecipient) {
            return recipient.sendToAdmin === this.sendToAdmin;
        }

        return false;
    }
}

export class NotificationRbacGroupRecipient extends BaseNotificationRecipient {
    readonly groupId: UUID;
    readonly isLoading: boolean;
    readonly hasError: boolean;

    public constructor(integrationId: UUID | undefined, groupId: UUID, displayNameOrIsLoading: string | boolean) {
        let displayName;
        let isLoading;
        let hasError;

        if (typeof displayNameOrIsLoading === 'string') {
            displayName = displayNameOrIsLoading;
            isLoading = false;
            hasError = false;
        } else {
            displayName = 'Loading';
            isLoading = displayNameOrIsLoading;
            hasError = !displayNameOrIsLoading;
        }

        super(
            displayName,
            undefined,
            integrationId,
            `rbac-group-${groupId}`
        );

        this.groupId = groupId;
        this.isLoading = isLoading;
        this.hasError = hasError;
    }

    public equals(recipient: Recipient) {
        if (recipient instanceof NotificationRbacGroupRecipient) {
            return recipient.groupId === this.groupId;
        }

        return false;
    }
}

