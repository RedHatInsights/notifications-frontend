import {
  ExporterType,
  exporterTypeFromString,
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

type OnExport = (type: ExporterType) => void;

export const useTableExportConfig = (onExport?: OnExport) => {
  return React.useMemo(() => {
    if (onExport) {
      return {
        extraItems: [],
        onSelect: (_event, type: string) => {
          onExport(exporterTypeFromString(type));
        },
      };
    }

    return undefined;
  }, [onExport]);
};
