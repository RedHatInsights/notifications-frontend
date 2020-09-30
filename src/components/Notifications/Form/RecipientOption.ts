import { SelectOptionObject } from '@patternfly/react-core';
import { IntegrationRef } from '../../../types/Notification';

export class RecipientOption implements SelectOptionObject {
    readonly recipientOrIntegration: string | IntegrationRef;

    constructor(recipientOrIntegration: string | IntegrationRef) {
        this.recipientOrIntegration = recipientOrIntegration;
    }

    compareTo(selectOption: any): boolean {
        if (selectOption instanceof RecipientOption && typeof selectOption.recipientOrIntegration === typeof this.recipientOrIntegration) {
            if (typeof selectOption.recipientOrIntegration === 'string') {
                return selectOption.recipientOrIntegration === this.recipientOrIntegration;
            } else {
                return selectOption.recipientOrIntegration.id === (this.recipientOrIntegration as IntegrationRef).id;
            }
        }

        return false;
    }

    toString(): string {
        if (typeof this.recipientOrIntegration === 'string') {
            return this.recipientOrIntegration;
        } else {
            return this.recipientOrIntegration.name;
        }
    }
}
