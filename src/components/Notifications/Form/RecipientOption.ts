import { Recipient } from '../../../types/Recipient';

export class RecipientOption {
  readonly recipient: Recipient;

  constructor(recipient: Recipient) {
    this.recipient = recipient;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
