import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { Switch } from '@patternfly/react-core/dist/dynamic/components/Switch';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { SearchIcon } from '@patternfly/react-icons';
import { IActions, ISortBy, SortByDirection } from '@patternfly/react-table';
import SkeletonTable from '@redhat-cloud-services/frontend-components/SkeletonTable';
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
> = (props) => {
  const intl = useIntl();

  const onSort = React.useCallback(
    (event, column: number, direction: SortByDirection) => {
      const { onSort } = props;
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
    [props.onSort]
  );

  const sortBy = React.useMemo<ISortBy>(() => {
    const { sortBy } = props;
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
  }, [props.sortBy]);

  const rows = React.useMemo(() => {
    return props.integrations.map((integration, idx) => [
      integration.name,
      Config.integrations.types[integration.type].name,
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
            props.onEnable && props.onEnable(integration, idx, isChecked)
          }
          isDisabled={!props.onEnable}
          ouiaId={`enabled-${integration.id}`}
        />
      ),
    ]);
  }, [props.integrations, props.onEnable]);

  const COLUMNS: DataViewTh[] = [
    {
      cell: 'Name',
      props: { sort: { sortBy, onSort, columnIndex: 1 } },
    },
    'Type',
    'Last connection attempt',
    {
      cell: 'Enabled',
      props: { sort: { sortBy, onSort, columnIndex: 4 } },
    },
  ];

  if (props.isLoading) {
    return <SkeletonTable rows={props.loadingCount || 10} columns={COLUMNS} />;
  }

  if (rows.length === 0) {
    return (
      <EmptyStateSearch
        variant={EmptyStateVariant.full}
        icon={SearchIcon}
        title={intl.formatMessage(messages.integrationsEmptyStateTitle)}
        description={intl.formatMessage(
          messages.integrationsTableEmptyStateBody
        )}
      />
    );
  }

  return (
    <div>
      <DataView ouiaId="integrations-table">
        <DataViewTable variant="compact" columns={COLUMNS} rows={rows} />
      </DataView>
    </div>
  );
};
