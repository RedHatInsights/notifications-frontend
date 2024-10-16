import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';

import { IntegrationExporterJson } from '../Json';

describe('src/utils/exporters/Policy/Json', () => {
  it('has json type', () => {
    const exporter = new IntegrationExporterJson();
    expect(exporter.type).toEqual(ExporterType.JSON);
  });

  it('has application/json type', () => {
    const result = new IntegrationExporterJson().export([]);
    expect(result.type).toEqual('application/json');
  });

  // No way to compare blobs yet
  // https://github.com/facebook/jest/issues/7372
  it('empty export', () => {
    const result = new IntegrationExporterJson().export([]);
    expect(result.size).toEqual('[]'.length);
  });
});
