import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';

import { Schemas } from '../../../../generated/OpenapiNotifications';
import { UserIntegrationType } from '../../../../types/Integration';
import { IntegrationExporterCsv } from '../Csv';

describe('src/utils/exporters/Policy/Csv', () => {
    it('has csv type', () => {
        const exporter = new IntegrationExporterCsv();
        expect(exporter.type).toEqual(ExporterType.CSV);
    });

    it('has text/csv type', () => {
        const result = new IntegrationExporterCsv().export([]);
        expect(result.type).toEqual('text/csv');
    });

    it('has 5 columns', () => {
        const result = new IntegrationExporterCsv().export([
            {
                id: '12345',
                name: 'hello world',
                isEnabled: false,
                type: UserIntegrationType.WEBHOOK,
                url: 'http://foo.bar',
                secretToken: 'foo',
                method: Schemas.HttpType.Enum.GET,
                sslVerificationEnabled: false
            }
        ]);

        const reader = new FileReader();
        return new Promise<void>((done, fail) => {
            reader.addEventListener('loadend', () => {
                try {
                    const text = (reader.result as string).split('\r');
                    expect(text[0]).toEqual('id,name,isEnabled,type,url');
                    done();
                } catch (ex) {
                    fail(ex);
                }
            });
            reader.readAsText(result);
        });
    });

    // No way to compare blobs yet
    // https://github.com/facebook/jest/issues/7372
    it('empty export has the headers', () => {
        const result = new IntegrationExporterCsv().export([]);
        expect(result.size).toBeGreaterThan(0);
    });
});
