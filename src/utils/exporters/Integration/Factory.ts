import { Exporter, ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import { Integration } from '../../../types/Integration';
import { IntegrationExporterJson } from './Json';
import { IntegrationExporterCsv } from './Csv';
import { assertNever } from 'assert-never';

export const integrationExporterFactory = (type: ExporterType): Exporter<Integration> => {
    switch (type) {
        case ExporterType.CSV:
            return new IntegrationExporterCsv();
        case ExporterType.JSON:
            return new IntegrationExporterJson();
    }

    assertNever(type);
};
