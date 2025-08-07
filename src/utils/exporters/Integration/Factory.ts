import { assertNever } from 'assert-never';

import { UserIntegration } from '../../../types/Integration';
import { IntegrationExporterCsv } from './Csv';
import { IntegrationExporterJson } from './Json';
import { Exporter, ExporterType } from '../../insights-common-typescript';

export const integrationExporterFactory = (
  type: ExporterType
): Exporter<UserIntegration> => {
  switch (type) {
    case ExporterType.CSV:
      return new IntegrationExporterCsv();
    case ExporterType.JSON:
      return new IntegrationExporterJson();
  }

  assertNever(type);
};
