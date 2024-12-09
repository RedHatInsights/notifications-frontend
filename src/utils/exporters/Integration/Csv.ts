import {
  ExporterCsv,
  ExporterHeaders,
} from '@redhat-cloud-services/insights-common-typescript';

import { UserIntegration } from '../../../types/Integration';

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
