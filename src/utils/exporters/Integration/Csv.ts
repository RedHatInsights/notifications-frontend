import { UserIntegration } from '../../../types/Integration';
import { ExporterCsv, ExporterHeaders } from '../../insights-common-typescript';

export class IntegrationExporterCsv extends ExporterCsv<UserIntegration> {
  public serialize(integration: UserIntegration) {
    // Convert all values to strings and handle null/undefined values
    const serialized: { [key: string]: string | undefined } = {
      id: integration.id,
      name: integration.name,
      isEnabled: integration.isEnabled.toString(),
      type: integration.type,
      status: integration.status?.toString(),
      serverErrors: integration.serverErrors.toString(),
      eventTypes: integration.eventTypes?.join(', '),
    };

    // Add secretToken only if it exists (for integrations that have it)
    if ('secretToken' in integration && integration.secretToken !== undefined) {
      serialized.secretToken = integration.secretToken;
    }

    return serialized;
  }

  public headers(): ExporterHeaders<IntegrationExporterCsv, UserIntegration> {
    return [
      ['id', 'id'],
      ['name', 'name'],
      ['isEnabled', 'isEnabled'],
      ['type', 'type'],
      ['status', 'status'],
      ['serverErrors', 'serverErrors'],
      ['eventTypes', 'eventTypes'],
      ['secretToken', 'secretToken'],
    ];
  }
}
