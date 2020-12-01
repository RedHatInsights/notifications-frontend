import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';

import { IntegrationExporterCsv } from '../Csv';
import { integrationExporterFactory } from '../Factory';
import { IntegrationExporterJson } from '../Json';

describe('src/utils/exporters/Policy/Factory', () => {
    it('get CSV Exporter', () => {
        const exporter = integrationExporterFactory(ExporterType.CSV);
        expect(exporter).toEqual(new IntegrationExporterCsv());
    });

    it('get JSON Exporter', () => {
        const exporter = integrationExporterFactory(ExporterType.JSON);
        expect(exporter).toEqual(new IntegrationExporterJson());
    });

    it('Wrong type throws exception', () => {
        expect(() => integrationExporterFactory('foo' as any)).toThrowError();
    });
});
