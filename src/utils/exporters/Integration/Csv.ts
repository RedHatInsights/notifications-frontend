import { ExporterCsv, ExporterHeaders } from '@redhat-cloud-services/insights-common-typescript';
import { Integration } from '../../../types/Integration';

export class IntegrationExporterCsv extends ExporterCsv<Integration> {

    public serialize(integration: Integration) {
        return {
            ...integration
        };
    }

    public headers(): ExporterHeaders<IntegrationExporterCsv, Integration> {
        return [
            [ 'id', 'id' ],
            [ 'name', 'name' ],
            [ 'isEnabled', 'isEnabled' ],
            [ 'type', 'type' ],
            // This works now, but what will happen when there are multiple types (slack, webhook, etc)
            [ 'url', 'url' ]
        ];
    }
}
