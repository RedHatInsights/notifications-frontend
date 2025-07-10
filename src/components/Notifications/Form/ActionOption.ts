import Config from '../../../config/Config';
import { UserIntegrationType } from '../../../types/Integration';

export class ActionOption {
  readonly kind: 'notification' | 'integration';
  readonly type: string;

  constructor(props: {
    kind: 'notification' | 'integration';
    type: string;
  }) {
    this.kind = props.kind;
    this.type = props.type;
  }

  get integrationType(): UserIntegrationType | undefined {
    if (this.kind === 'integration') {
      return this.type as UserIntegrationType;
    }
    return undefined;
  }

  toString(): string {
    if (this.kind === 'notification') {
      return this.type;
    }

    return Config.integrations.types[this.type as UserIntegrationType]?.name ?? this.type;
  }
}
