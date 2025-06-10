// This is a convenience package provided only to make it easier to migrate away from the insights-common-typescript package
// insights-common-typescript can be considered deprecated. it was created before frontends-components supported any typescript
// and the need to share between notifications and policies apps was required to lower duplicity on some common patterns
// the team was using on their APIs and frontends. In this sense, this package was holding common code for a team.
// The components found here should be incorporated into the codebase or migrated to a different library.

export * from './dev';
export type { InsightsType } from './InsightsType';
export { getInsights } from './InsightsType';
export { createFetchingClient } from './FetchingConfiguration';
export { RenderIfTrue } from './RenderIf';
export { toUtc, fromUtc } from './Date';
export { Filter, Operator, Sort, Direction, Page } from './Page';
export type { UseSortReturn } from './useSort';
export { useSort } from './useSort';
export type {
  ColumnsMetada,
  OptionalColumnsMetada,
} from './usePrimaryToolbarFilterConfig';
export { usePrimaryToolbarFilterConfig } from './usePrimaryToolbarFilterConfig';
export type { Exporter, ExporterHeaders } from './Exporters';
export {
  ExporterJson,
  ExporterType,
  ExporterCsv,
  exporterTypeFromString,
} from './Exporters';
export type { Environment } from './Environment';
export { getInsightsEnvironment } from './Environment';
export { useTransformQueryResponse } from './ApiUtils';
export { InsightsEnvDetector } from './EnvDetector';
export type {
  ActionModalProps,
  ActionModalError,
  DeleteModalProps,
  SaveModalProps,
} from './Modals';
export { DeleteModal, SaveModal } from './Modals';
export { useInsightsEnvironmentFlag } from './useEnvironmentFlag';
export { join } from './ComponentUtil';
export {
  FormTextInput,
  Checkbox,
  FormTextArea,
  FormSelect,
  Form,
} from './Formik';
export { useUrlStateString } from './useUrlState';
export { useUrlStateMultipleOptions } from './useUrlStateMultipleOptions';
export type {
  Filters,
  SetFilters,
  ClearFilters,
  ClearFilterElement,
} from './Filters';
export { arrayValue, stringValue } from './Filters';
export { useFilters } from './useFilters';
export { localUrl } from './LocalUrl';
export { fetchRBAC, Rbac } from './RbacUtils';
export { useSyncInterval } from './useSyncInterval';
