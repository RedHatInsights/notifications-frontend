import { SelectOptionObject } from '@patternfly/react-core';

import { Recipient } from '../../../types/Recipient';

export class RecipientOption implements SelectOptionObject {
    readonly recipient: Recipient;

    constructor(recipient: Recipient) {
        this.recipient = recipient;
    }

    compareTo(selectOption: any): boolean {
        if (selectOption instanceof RecipientOption) {
            return this.recipient.equals(selectOption.recipient);
        }

        return false;
    }

    toString(): string {
        return this.recipient.displayName;
    }
}
