import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { ResponsiveAction, ResponsiveActions } from '@patternfly/react-component-groups';
import { DataViewToolbar } from '@patternfly/react-data-view/dist/dynamic/DataViewToolbar';
import { DataViewFilters } from '@patternfly/react-data-view/dist/dynamic/DataViewFilters';
import { DataViewTextFilter } from '@patternfly/react-data-view/dist/dynamic/DataViewTextFilter';
import { DataViewCheckboxFilter } from '@patternfly/react-data-view/dist/dynamic/DataViewCheckboxFilter';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Messages } from '../../properties/Messages';
import { ExporterType } from '../../utils/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { IntegrationFilterColumn, IntegrationFilters, SetIntegrationFilters } from './Filters';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

interface IntegrationsToolbarProps extends OuiaProps {
  onAddIntegration?: () => void;
  onExport: (type: ExporterType) => void;
  filters: IntegrationFilters;
  setFilters: SetIntegrationFilters;
  count: number;
  page: number;
  perPage: number;
  pageChanged: (page: number) => void;
  perPageChanged: (page: number) => void;
}

const messages = defineMessages({
  name: {
    id: 'integrations.toolbar.name',
    defaultMessage: 'Name',
  },
  filterByName: {
    id: 'integrations.toolbar.filterByName',
    defaultMessage: 'Filter by name',
  },
  enabled: {
    id: 'integrations.toolbar.enabled',
    defaultMessage: 'Enabled',
  },
  filterByEnabled: {
    id: 'integrations.toolbar.filterByEnabled',
    defaultMessage: 'Filter by enabled',
  },
  enabledOption: {
    id: 'integrations.toolbar.enabledOption',
    defaultMessage: 'Enabled',
  },
  disabledOption: {
    id: 'integrations.toolbar.disabledOption',
    defaultMessage: 'Disabled',
  },
  exportCsv: {
    id: 'integrations.toolbar.exportCsv',
    defaultMessage: 'Export as CSV',
  },
  exportJson: {
    id: 'integrations.toolbar.exportJson',
    defaultMessage: 'Export as JSON',
  },
});

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
  const intl = useIntl();

  const enabledFilterOptions = React.useMemo(
    () => [
      {
        value: 'Enabled',
        label: intl.formatMessage(messages.enabledOption),
      },
      {
        value: 'Disabled',
        label: intl.formatMessage(messages.disabledOption),
      },
    ],
    [intl]
  );

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
              title={intl.formatMessage(messages.name)}
              placeholder={intl.formatMessage(messages.filterByName)}
            />
            <DataViewCheckboxFilter
              filterId={IntegrationFilterColumn.ENABLED}
              title={intl.formatMessage(messages.enabled)}
              placeholder={intl.formatMessage(messages.filterByEnabled)}
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
              {intl.formatMessage(messages.exportCsv)}
            </ResponsiveAction>
            <ResponsiveAction onClick={() => onExport(ExporterType.JSON)}>
              {intl.formatMessage(messages.exportJson)}
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
            onPerPageSelect={perPageChanged}
          />
        }
      />
    </div>
  );
};
