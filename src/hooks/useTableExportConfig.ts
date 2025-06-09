import * as React from 'react';
import {
  ExporterType,
  exporterTypeFromString,
} from '../utils/insights-common-typescript/Exporters';

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
