import { SelectOptionObject } from '@patternfly/react-core';
import { UserIntegrationType } from '../../../types/Integration';
import { NotificationType } from '../../../types/Notification';
import { Messages } from '../../../properties/Messages';

type ActionTypeOrIntegration = {
    kind: 'integration';
    type: UserIntegrationType;
} | {
    kind: 'notification';
    type: NotificationType;
}

export class ActionOption implements SelectOptionObject {
    readonly integrationType: UserIntegrationType | undefined;
    readonly notificationType: NotificationType;

    constructor(type: ActionTypeOrIntegration) {
        if (type.kind === 'integration') {
            this.notificationType = NotificationType.INTEGRATION;
            this.integrationType = type.type;
        } else {
            this.notificationType = type.type;
            this.integrationType = undefined;
        }
    }

    compareTo(selectOption: any): boolean {
        if (selectOption instanceof ActionOption) {
            return selectOption.notificationType === this.notificationType && selectOption.integrationType === this.integrationType;
        }

        return false;
    }

    toString(): string {
        const actionName = Messages.components.notifications.types[this.notificationType];
        if (this.integrationType) {
            const integrationName = Messages.components.integrations.integrationType[this.integrationType];
            return `${actionName}: ${integrationName}`;
        }

        return actionName;
    }
}
