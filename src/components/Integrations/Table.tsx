import {
  EmptyStateVariant,
  Spinner,
  Switch,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Table/table';
import {
  IActions,
  IActionsResolver,
  ICell,
  IRow,
  IRowData,
  ISortBy,
  RowWrapperProps,
  SortByDirection,
  Table,
  TableBody,
  TableHeader,
  expandable,
  info,
  sortable,
} from '@patternfly/react-table';
import SkeletonTable from '@redhat-cloud-services/frontend-components/SkeletonTable';
import {
  Direction,
  OuiaComponentProps,
  Sort,
  UseSortReturn,
} from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';
import { important } from 'csx';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { style } from 'typestyle';

import Config from '../../config/Config';
import messages from '../../properties/DefinedMessages';
import { Messages } from '../../properties/Messages';
import {
  IntegrationConnectionAttempt,
  UserIntegration,
} from '../../types/Integration';
import {
  AggregatedConnectionAttemptStatus,
  aggregateConnectionAttemptStatus,
} from '../../utils/ConnectionAttemptStatus';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { EmptyStateSearch } from '../EmptyStateSearch';
import { ConnectionDegraded } from './Table/ConnectionDegraded';
import { ConnectionFailed } from './Table/ConnectionFailed';
import { ExpandedContent } from './Table/ExpandedContent';
import { IntegrationStatus, StatusUnknown } from './Table/IntegrationStatus';
import { LastConnectionHelpTable } from './Table/LastConnectionHelpTable';

export type OnEnable = (
  integration: IntegrationRow,
  index: number,
  isChecked: boolean
) => void;

interface IntegrationsTableProps extends OuiaComponentProps {
  isLoading: boolean;
  loadingCount?: number;
  integrations: Array<IntegrationRow>;
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

const getConnectionAlert = (attempts: Array<IntegrationConnectionAttempt>) => {
  const status = aggregateConnectionAttemptStatus(attempts);
  switch (status) {
    case AggregatedConnectionAttemptStatus.UNKNOWN:
    case AggregatedConnectionAttemptStatus.SUCCESS:
      return null;
    case AggregatedConnectionAttemptStatus.ERROR:
      return (
        <div className="pf-v5-u-pb-md">
          <ConnectionFailed attempts={attempts} />
        </div>
      );
    case AggregatedConnectionAttemptStatus.WARNING:
      return (
        <div className="pf-v5-u-pb-md">
          <ConnectionDegraded attempts={attempts} />
        </div>
      );
    default:
      assertNever(status);
  }
};

const toTableRows = (
  integrations: Array<IntegrationRow>,
  onEnable?: OnEnable
): Array<IRow> => {
  return integrations.reduce((rows, integration, idx) => {
    rows.push({
      id: integration.id,
      key: integration.id,
      isOpen: integration.isOpen,
      selected: integration.isSelected,
      cells: [
        {
          title: integration.name,
        },
        {
          title: Config.integrations.types[integration.type].name,
        },
        {
          title: (
            <>
              {integration.lastConnectionAttempts === undefined ? (
                <StatusUnknown />
              ) : (
                <IntegrationStatus
                  status={integration.status}
                  lastConnectionAttempts={
                    integration.isConnectionAttemptLoading
                      ? undefined
                      : integration.lastConnectionAttempts
                  }
                />
              )}
            </>
          ),
        },
        {
          title: (
            <>
              {integration.isEnabledLoading ? (
                <Spinner className="pf-v5-u-ml-sm" size="md" />
              ) : (
                <Switch
                  id={`table-row-switch-id-${integration.id}`}
                  aria-label="Enabled"
                  isChecked={integration.isEnabled}
                  onChange={(isChecked) =>
                    onEnable && onEnable(integration, idx, isChecked)
                  }
                  isDisabled={!onEnable}
                  ouiaId={`enabled-${integration.id}`}
                />
              )}
            </>
          ),
        },
      ],
    });
    rows.push({
      fullWidth: true,
      parent: idx * 2,
      cells: [
        {
          title: (
            <>
              {integration.lastConnectionAttempts !== undefined &&
                getConnectionAlert(integration.lastConnectionAttempts)}
              <div className="pf-v5-u-pl-0 pf-v5-u-pb-0">
                <ExpandedContent
                  integration={integration}
                  ouiaId={integration.id}
                />
              </div>
            </>
          ),
          props: {
            colSpan: 6,
          },
        },
      ],
    });
    return rows;
  }, [] as Array<IRow>);
};

const columns: Array<ICell> = [
  {
    title: Messages.components.integrations.table.columns.name,
    cellFormatters: [expandable],
    transforms: [sortable],
  },
  {
    title: Messages.components.integrations.table.columns.type,
    transforms: [],
  },
  {
    title: Messages.components.integrations.table.columns.lastConnectionAttempt,
    transforms: [
      info({
        popover: <LastConnectionHelpTable />,
        popoverProps: {
          hasAutoWidth: true,
          headerContent: (
            <TextContent>
              <Text component="h6">
                Last connection attempt status meanings
              </Text>
            </TextContent>
          ),
        },
      }),
    ],
  },
  {
    title: Messages.components.integrations.table.columns.enabled,
    transforms: [sortable],
  },
];

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

const buildClassNames = () => {
  const noneStyle = important('none');
  const borderStyle = important(
    'var(--pf-c-table--border-width--base) solid var(--pf-c-table--BorderColor)'
  );

  const noBorderBottom = {
    borderBottom: noneStyle,
  };

  const rowExpandedContentClassName = style(noBorderBottom);
  const rowWrapperClassName = style(noBorderBottom, {
    borderTop: borderStyle,
  });
  const tableClassName = style({
    borderBottom: borderStyle,
  });

  return {
    rowExpandedContentClassName,
    rowWrapperClassName,
    tableClassName,
  };
};

const { rowExpandedContentClassName, rowWrapperClassName, tableClassName } =
  buildClassNames();

const RowWrapper: React.FunctionComponent<Omit<RowWrapperProps, 'onResize'>> = (
  props
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { trRef, className, rowProps, row, ...rest } = props;
  if (!row) {
    return <></>;
  }

  return (
    <tr
      {...rest}
      ref={
        trRef as any /* eslint-disable-line @typescript-eslint/no-explicit-any */
      }
      className={css(
        className,
        row.isExpanded === true
          ? rowExpandedContentClassName
          : rowWrapperClassName,
        row.isExpanded !== undefined && styles.tableExpandableRow,
        row.isExpanded && styles.modifiers.expanded
      )}
      hidden={row?.isExpanded !== undefined && !row.isExpanded}
    >
      {props.children}
    </tr>
  );
};

export const IntegrationsTable: React.FunctionComponent<
  IntegrationsTableProps
> = (props) => {
  const intl = useIntl();
  const onCollapseHandler = React.useCallback(
    (_event, _index: number, isOpen: boolean, data: IRowData) => {
      const integrations = props.integrations;
      const onCollapse = props.onCollapse;
      const index = integrations.findIndex(
        (integration) => integration.id === data.id
      );
      if (onCollapse && index !== -1) {
        const integration = integrations[index];
        onCollapse(integration, index, isOpen);
      }
    },
    [props.integrations, props.onCollapse]
  );

  const onSort = React.useCallback(
    (event, column: number, direction: SortByDirection) => {
      const propsOnSort = props.onSort;
      const mapping = sortMapper.find((p) => p.index === column);
      if (propsOnSort && mapping) {
        propsOnSort(
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
    const propsSortBy = props.sortBy;
    if (propsSortBy) {
      const mapping = sortMapper.find((p) => p.name === propsSortBy.column);
      if (mapping) {
        return {
          index: mapping.index,
          direction:
            propsSortBy.direction === Direction.ASCENDING
              ? SortByDirection.asc
              : SortByDirection.desc,
        };
      }
    }

    return {
      defaultDirection: SortByDirection.asc,
    };
  }, [props.sortBy]);

  const rows = React.useMemo(() => {
    return toTableRows(props.integrations, props.onEnable);
  }, [props.integrations, props.onEnable]);

  const actionsResolverCallback: IActionsResolver = React.useCallback(
    (rowData) => {
      const actionResolver = props.actionResolver;

      if (rowData.parent === undefined && rowData && props.integrations) {
        const integrationIndex = props.integrations.findIndex(
          (i) => i.id === rowData.id
        );
        const integrationRow = props.integrations[integrationIndex];
        if (integrationRow) {
          return actionResolver(integrationRow, integrationIndex);
        }
      }

      return [];
    },
    [props.actionResolver, props.integrations]
  );

  if (props.isLoading) {
    return (
      <div
        {...getOuiaProps('Integrations/Table', { ...props, ouiaSafe: false })}
      >
        <SkeletonTable
          rowSize={
            props.loadingCount && props.loadingCount > 0
              ? props.loadingCount
              : 10
          }
          columns={columns}
          paddingColumnSize={0}
          sortBy={undefined}
        />
      </div>
    );
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
    <div {...getOuiaProps('Integrations/Table', props)}>
      <Table
        className={tableClassName}
        aria-label={Messages.components.integrations.table.title}
        rows={rows}
        cells={columns}
        onCollapse={onCollapseHandler}
        rowWrapper={
          RowWrapper as (props: RowWrapperProps) => React.ReactElement
        }
        actionResolver={actionsResolverCallback}
        isStickyHeader={true}
        onSort={onSort}
        sortBy={sortBy}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </div>
  );
};
