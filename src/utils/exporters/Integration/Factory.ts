import {
  Exporter,
  ExporterType,
} from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';

import { UserIntegration } from '../../../types/Integration';
import { IntegrationExporterCsv } from './Csv';
import { IntegrationExporterJson } from './Json';

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
