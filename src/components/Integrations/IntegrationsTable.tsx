import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { Switch } from '@patternfly/react-core/dist/dynamic/components/Switch';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { SearchIcon } from '@patternfly/react-icons';
import {
  ActionsColumn,
  IActions,
  ISortBy,
  SortByDirection,
} from '@patternfly/react-table';
import {
  SkeletonTableBody,
  SkeletonTableHead,
} from '@patternfly/react-component-groups';

import {
  Direction,
  OuiaComponentProps,
  Sort,
  UseSortReturn,
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useIntl } from 'react-intl';

import Config from '../../config/Config';
import messages from '../../properties/DefinedMessages';
import {
  IntegrationConnectionAttempt,
  UserIntegration,
} from '../../types/Integration';
import { EmptyStateSearch } from '../EmptyStateSearch';
import { IntegrationStatus, StatusUnknown } from './Table/IntegrationStatus';
import { DataView } from '@patternfly/react-data-view/dist/dynamic/DataView';
import {
  DataViewTable,
  DataViewTh,
} from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import { getIntegrationIcon } from './IntegrationDetails';
import { Split, SplitItem } from '@patternfly/react-core';

export type OnEnable = (
  integration: IntegrationRow,
  index: number,
  isChecked: boolean
) => void;

interface IntegrationsTableProps extends OuiaComponentProps {
  isLoading: boolean;
  loadingCount?: number;
  integrations: IntegrationRow[];
  onCollapse?: (
    integration: IntegrationRow,
    index: number,
    isOpen: boolean
  ) => void;
  onEnable?: OnEnable;
  actionResolver: (row: IntegrationRow, index: number) => IActions;
  sortBy?: Sort;
  onSort?: UseSortReturn['onSort'];
  selectedIntegration?: UserIntegration;
  setFocusedIntegration?: React.Dispatch<
    React.SetStateAction<IntegrationRow | undefined>
  >;
}

export type IntegrationRow = UserIntegration & {
  isOpen: boolean;
  isSelected: boolean;
  isEnabledLoading: boolean;
  isConnectionAttemptLoading: boolean;
  lastConnectionAttempts?: Array<IntegrationConnectionAttempt>;
  includeDetails: boolean;
};

const sortMapper = [
  {
    name: 'name',
    index: 1,
  },
  {
    name: 'enabled',
    index: 4,
  },
];

export const DataViewIntegrationsTable: React.FunctionComponent<
  IntegrationsTableProps
> = ({
  onSort,
  sortBy,
  selectedIntegration,
  actionResolver,
  setFocusedIntegration,
  integrations,
  onEnable,
  loadingCount,
  isLoading,
}) => {
  const intl = useIntl();

  const onSortCallback = React.useCallback(
    (event, column: number, direction: SortByDirection) => {
      const mapping = sortMapper.find((p) => p.index === column);
      if (onSort && mapping) {
        onSort(
          mapping.index,
          mapping.name,
          direction === SortByDirection.asc
            ? Direction.ASCENDING
            : Direction.DESCENDING
        );
      }
    },
    [onSort] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const sortByMemo = React.useMemo<ISortBy>(() => {
    if (sortBy) {
      const mapping = sortMapper.find((p) => p.name === sortBy.column);
      if (mapping) {
        return {
          index: mapping.index,
          direction:
            sortBy.direction === Direction.ASCENDING
              ? SortByDirection.asc
              : SortByDirection.desc,
        };
      }
    }
    return { defaultDirection: SortByDirection.asc };
  }, [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = React.useMemo(() => {
    const handleRowClick = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      event: React.MouseEvent<HTMLTableElement, MouseEvent>,
      integration: IntegrationRow | undefined
    ) => {
      if (
        event.target instanceof Element &&
        (event.target.matches('td') || event.target.matches('tr'))
      ) {
        setFocusedIntegration?.(integration);
      }
    };
    return integrations.map((integration, idx) => ({
      row: [
        integration.name,
        <Split key={idx}>
          <SplitItem>{getIntegrationIcon(integration.type)}</SplitItem>
          <SplitItem>
            {' '}
            {Config.integrations.types[integration.type].name}{' '}
          </SplitItem>
        </Split>,
        integration.lastConnectionAttempts === undefined ? (
          <StatusUnknown />
        ) : (
          <IntegrationStatus
            status={integration.status}
            lastConnectionAttempts={
              integration.isConnectionAttemptLoading
                ? undefined
                : integration.lastConnectionAttempts
            }
            includeDetails={integration.includeDetails}
          />
        ),
        integration.isEnabledLoading ? (
          <Spinner className="pf-v5-u-ml-sm" size="md" />
        ) : (
          <Switch
            id={`table-row-switch-id-${integration.id}`}
            aria-label="Enabled"
            isChecked={integration.isEnabled}
            onChange={(_e, isChecked) =>
              onEnable?.(integration, idx, isChecked)
            }
            isDisabled={!onEnable}
            ouiaId={`enabled-${integration.id}`}
          />
        ),
        {
          cell: <ActionsColumn items={actionResolver(integration, idx)} />,
          props: { isActionCell: true },
        },
      ],
      props: {
        isClickable: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRowClick: (event: any) =>
          handleRowClick(
            event,
            selectedIntegration?.id === integration.id ? undefined : integration
          ),
        isRowSelected: selectedIntegration?.id === integration.id,
      },
    }));
  }, [integrations, selectedIntegration?.id, onEnable]); // eslint-disable-line react-hooks/exhaustive-deps

  const COLUMNS: DataViewTh[] = [
    {
      cell: 'Name',
      props: {
        sort: { sortBy: sortByMemo, onSort: onSortCallback, columnIndex: 1 },
      },
    },
    'Type',
    'Last connection attempt',
    {
      cell: 'Enabled',
      props: {
        sort: { sortBy: sortByMemo, onSort: onSortCallback, columnIndex: 4 },
      },
    },
  ];

  const emptyState = (
    <EmptyStateSearch
      variant={EmptyStateVariant.full}
      icon={SearchIcon}
      title={intl.formatMessage(messages.integrationsEmptyStateTitle)}
      description={intl.formatMessage(messages.integrationsTableEmptyStateBody)}
    />
  );

  const loadingStateHeader = <SkeletonTableHead columns={COLUMNS} />;
  const loadingStateBody = (
    <SkeletonTableBody
      rowsCount={loadingCount || 10}
      columnsCount={COLUMNS.length}
    />
  );

  return (
    <DataView
      ouiaId="integrations-table"
      activeState={
        isLoading
          ? 'loading'
          : !(integrations?.length > 0)
          ? 'empty'
          : undefined
      }
    >
      <DataViewTable
        variant="compact"
        columns={COLUMNS}
        rows={rows}
        headStates={{ loading: loadingStateHeader }}
        bodyStates={{ loading: loadingStateBody, empty: emptyState }}
      />
    </DataView>
  );
};
