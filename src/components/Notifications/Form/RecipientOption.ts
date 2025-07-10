import { Recipient } from '../../../types/Recipient';

export class RecipientOption {
  readonly recipient: Recipient;

  constructor(recipient: Recipient) {
    this.recipient = recipient;
  }

  toString(): string {
    return this.recipient.displayName;
  }
}
