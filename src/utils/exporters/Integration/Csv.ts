import { UserIntegration } from '../../../types/Integration';
import { ExporterCsv, ExporterHeaders } from '../../insights-common-typescript';

export class IntegrationExporterCsv extends ExporterCsv<UserIntegration> {
  public serialize(integration: UserIntegration) {
    return {
      ...integration,
    };
  }

  public headers(): ExporterHeaders<IntegrationExporterCsv, UserIntegration> {
    return [
      ['id', 'id'],
      ['name', 'name'],
      ['isEnabled', 'isEnabled'],
      ['type', 'type'],
      // This works now, but what will happen when there are multiple types (slack, webhook, etc)
      ['secretToken', 'secretToken'],
      ['status', 'status'],
      ['serverErrors', 'serverErrors'],
    ];
  }
}
