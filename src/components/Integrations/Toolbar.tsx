import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { ResponsiveAction, ResponsiveActions } from '@patternfly/react-component-groups';
import { DataViewToolbar } from '@patternfly/react-data-view/dist/dynamic/DataViewToolbar';
import { DataViewFilters } from '@patternfly/react-data-view/dist/dynamic/DataViewFilters';
import { DataViewTextFilter } from '@patternfly/react-data-view/dist/dynamic/DataViewTextFilter';
import { DataViewCheckboxFilter } from '@patternfly/react-data-view/dist/dynamic/DataViewCheckboxFilter';
import * as React from 'react';

import { Messages } from '../../properties/Messages';
import { ExporterType } from '../../utils/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { DisabledIntegrationIcon, EnabledIntegrationIcon } from '../Icons';
import { IntegrationFilterColumn, IntegrationFilters, SetIntegrationFilters } from './Filters';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

interface IntegrationsToolbarProps extends OuiaProps {
  onAddIntegration?: () => void;
  onExport: (type: ExporterType) => void;
  filters: IntegrationFilters;
  setFilters: SetIntegrationFilters;
  pageCount: number;
  count: number;
  page: number;
  perPage: number;
  pageChanged: (page: number) => void;
  perPageChanged: (page: number) => void;
}

const enabledFilterOptions = [
  {
    value: 'Enabled',
    label: (
      <>
        <EnabledIntegrationIcon /> Enabled
      </>
    ),
  },
  {
    value: 'Disabled',
    label: (
      <>
        <DisabledIntegrationIcon /> Disabled
      </>
    ),
  },
];

export const IntegrationsToolbar: React.FunctionComponent<
  React.PropsWithChildren<IntegrationsToolbarProps>
> = ({
  filters,
  setFilters,
  onAddIntegration,
  onExport,
  count,
  page,
  perPage,
  pageChanged: onPageChanged,
  perPageChanged: onPerPageChanged,
  children,
  ...ouiaProps
}) => {
  const filterValues = React.useMemo(
    () => ({
      [IntegrationFilterColumn.NAME]: (typeof filters.name === 'string' ? filters.name : '') || '',
      [IntegrationFilterColumn.ENABLED]: Array.isArray(filters.enabled) ? filters.enabled : [],
    }),
    [filters.name, filters.enabled]
  );

  const handleFilterChange = React.useCallback(
    (filterId: string, newValues: Partial<Record<string, string | string[]>>) => {
      if (filterId === IntegrationFilterColumn.NAME && IntegrationFilterColumn.NAME in newValues) {
        setFilters.name(newValues[IntegrationFilterColumn.NAME] as string);
      }

      if (
        filterId === IntegrationFilterColumn.ENABLED &&
        IntegrationFilterColumn.ENABLED in newValues
      ) {
        setFilters.enabled(newValues[IntegrationFilterColumn.ENABLED] as string[]);
      }
    },
    [setFilters]
  );

  const clearAllFilters = React.useCallback(() => {
    setFilters.name('');
    setFilters.enabled([]);
  }, [setFilters]);

  const pageChanged = React.useCallback(
    (_event: unknown, newPage: number) => {
      onPageChanged(newPage);
    },
    [onPageChanged]
  );

  const perPageChanged = React.useCallback(
    (_event: unknown, newPerPage: number) => {
      onPerPageChanged(newPerPage);
    },
    [onPerPageChanged]
  );

  return (
    <div {...getOuiaProps('Integrations/DualToolbar', ouiaProps)}>
      <DataViewToolbar
        ouiaId="integrations-top-toolbar"
        clearAllFilters={clearAllFilters}
        filters={
          <DataViewFilters onChange={handleFilterChange} values={filterValues}>
            <DataViewTextFilter
              filterId={IntegrationFilterColumn.NAME}
              title="Name"
              placeholder="Filter by name"
            />
            <DataViewCheckboxFilter
              filterId={IntegrationFilterColumn.ENABLED}
              title="Enabled"
              placeholder="Filter by enabled"
              options={enabledFilterOptions}
            />
          </DataViewFilters>
        }
        actions={
          <ResponsiveActions breakpoint="lg" ouiaId="integrations-actions">
            <ResponsiveAction
              isPersistent
              variant="primary"
              onClick={onAddIntegration}
              isDisabled={!onAddIntegration}
            >
              {Messages.components.integrations.toolbar.actions.addIntegration}
            </ResponsiveAction>
            <ResponsiveAction onClick={() => onExport(ExporterType.CSV)}>
              Export as CSV
            </ResponsiveAction>
            <ResponsiveAction onClick={() => onExport(ExporterType.JSON)}>
              Export as JSON
            </ResponsiveAction>
          </ResponsiveActions>
        }
        pagination={
          <Pagination
            itemCount={count}
            page={page}
            perPage={perPage}
            isCompact
            variant={PaginationVariant.top}
            onSetPage={pageChanged}
            onFirstClick={pageChanged}
            onPreviousClick={pageChanged}
            onNextClick={pageChanged}
            onLastClick={pageChanged}
            onPageInput={pageChanged}
            onPerPageSelect={perPageChanged}
          />
        }
      />
      {children}
      <DataViewToolbar
        ouiaId="integrations-bottom-toolbar"
        pagination={
          <Pagination
            itemCount={count}
            page={page}
            perPage={perPage}
            variant={PaginationVariant.bottom}
            onSetPage={pageChanged}
            onFirstClick={pageChanged}
            onPreviousClick={pageChanged}
            onNextClick={pageChanged}
            onLastClick={pageChanged}
            onPageInput={pageChanged}
            onPerPageSelect={perPageChanged}
          />
        }
      />
    </div>
  );
};
