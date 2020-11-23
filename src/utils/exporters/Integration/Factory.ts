import { Exporter, ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import { UserIntegration } from '../../../types/Integration';
import { IntegrationExporterJson } from './Json';
import { IntegrationExporterCsv } from './Csv';
import { assertNever } from 'assert-never';

export const integrationExporterFactory = (type: ExporterType): Exporter<UserIntegration> => {
    switch (type) {
        case ExporterType.CSV:
            return new IntegrationExporterCsv();
        case ExporterType.JSON:
            return new IntegrationExporterJson();
    }

    assertNever(type);
};
