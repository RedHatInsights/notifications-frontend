import * as React from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    IRow,
    IRowData,
    expandable,
    ICell,
    RowWrapperProps,
    IActions, IActionsResolver
} from '@patternfly/react-table';
import styles from '@patternfly/react-styles/css/components/Table/table';
import { Spinner, Switch, Text } from '@patternfly/react-core';
import { Messages } from '../../properties/Messages';
import { IntegrationConnectionAttempt, Integration } from '../../types/Integration';
import { ExpandedContent } from './Table/ExpandedContent';
import { style } from 'typestyle';
import { assertNever, OuiaComponentProps, Spacer, PFColors } from '@redhat-cloud-services/insights-common-typescript';
import { css } from '@patternfly/react-styles';
import { important } from 'csx';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { ConnectionDegraded } from './Table/ConnectionDegraded';
import { ConnectionFailed } from './Table/ConnectionFailed';
import { OffIcon, ExclamationCircleIcon, CheckCircleIcon } from '@patternfly/react-icons';

type OnEnable = (integration: IntegrationRow, index: number, isChecked: boolean) => void;

interface IntegrationsTableProps extends OuiaComponentProps {
    integrations: Array<IntegrationRow>;
    onCollapse?: (integration: IntegrationRow, index: number, isOpen: boolean) => void;
    onEnable?: OnEnable;
    actionResolver: (row: IntegrationRow) => IActions;
}

export type IntegrationRow = Integration & {
    isOpen: boolean;
    isSelected: boolean;
    isEnabledLoading: boolean;
    isConnectionAttemptLoading: boolean;
    lastConnectionAttempts?: Array<IntegrationConnectionAttempt>;
}

enum LastConnectionAttemptStatus {
    UNKNOWN,
    SUCCESS,
    WARNING,
    ERROR
}

const connectionAlertClassName = style({
    paddingBottom: Spacer.MD
});

const expandedContentClassName = style({
    paddingLeft: Spacer.MD,
    paddingBottom: Spacer.LG
});

const isEnabledLoadingClassName = style({
    marginLeft: 10
});

const smallMarginLeft = style({
    marginLeft: Spacer.SM
});

const degradedClassName = style({
    fontWeight: 600,
    color: PFColors.GlobalWarningColor200,
    fontSize: 'var(--pf-global--FontSize--sm)'
});

const getLastConnectionAttemptStatus = (attempts: Array<IntegrationConnectionAttempt>): LastConnectionAttemptStatus => {
    if (attempts.length === 0) {
        return LastConnectionAttemptStatus.UNKNOWN;
    }

    const failures = attempts.filter(a => !a.isSuccess).length;

    if (failures === attempts.length) {
        return LastConnectionAttemptStatus.ERROR;
    } else if (failures > 0) {
        return LastConnectionAttemptStatus.WARNING;
    }

    return LastConnectionAttemptStatus.SUCCESS;
};

const getConnectionAlert = (attempts: Array<IntegrationConnectionAttempt>) => {
    const status = getLastConnectionAttemptStatus(attempts);
    switch (status) {
        case LastConnectionAttemptStatus.UNKNOWN:
        case LastConnectionAttemptStatus.SUCCESS:
            return null;
        case LastConnectionAttemptStatus.ERROR:
            return (
                <div className={ connectionAlertClassName }>
                    <ConnectionFailed attempts={ attempts }/>
                </div>
            );
        case LastConnectionAttemptStatus.WARNING:
            return (
                <div className={ connectionAlertClassName }>
                    <ConnectionDegraded attempts={ attempts }/>
                </div>
            );
        default:
            assertNever(status);
    }
};

const LastConnectionAttemptSuccess: React.FunctionComponent = () => (
    <>
        <CheckCircleIcon color={ PFColors.GlobalSuccessColor200 } data-testid="success-icon"/>
        <span className={ smallMarginLeft }>Success</span>
    </>
);

const LastConnectionAttemptError: React.FunctionComponent = () => (
    <>
        <ExclamationCircleIcon color={ PFColors.GlobalDangerColor100 } data-testid="fail-icon"/>
        <span className={ smallMarginLeft }>Fail</span>
    </>
);

const getConnectionAttemptCell = (attempts: Array<IntegrationConnectionAttempt> | undefined, isLoading: boolean) => {
    if (attempts === undefined) {
        return 'Error fetching connection attempts';
    }

    if (isLoading) {
        return <Spinner size="md" />;
    }

    const status = getLastConnectionAttemptStatus(attempts);
    switch (status) {
        case LastConnectionAttemptStatus.UNKNOWN:
            return <>
                <OffIcon data-testid="off-icon" />
                <span className={ smallMarginLeft }>Unknown</span>
            </>;
        case LastConnectionAttemptStatus.SUCCESS:
            return <><LastConnectionAttemptSuccess/></>;
        case LastConnectionAttemptStatus.ERROR:
            return <><LastConnectionAttemptError/></>;
        case LastConnectionAttemptStatus.WARNING:
            return <>
                { attempts[0].isSuccess ? <LastConnectionAttemptSuccess/> : <LastConnectionAttemptError/> }
                <br/>
                <Text className={ degradedClassName }>Degraded connection</Text>
            </>;
        default:
            assertNever(status);
    }
};

const toTableRows = (integrations: Array<IntegrationRow>, onEnable?: OnEnable): Array<IRow> => {
    return integrations.reduce((rows, integration, idx) => {
        rows.push({
            id: integration.id,
            key: integration.id,
            isOpen: integration.isOpen,
            selected: integration.isSelected,
            cells: [
                {
                    title: integration.name
                },
                {
                    title: Messages.components.integrations.integrationType[integration.type]
                },
                {
                    title: getConnectionAttemptCell(integration.lastConnectionAttempts, integration.isConnectionAttemptLoading)
                },
                {
                    title: <>
                        { integration.isEnabledLoading ? (
                            <Spinner className={ isEnabledLoadingClassName } size="md"/>
                        ) : (
                            <Switch
                                id={ `table-row-switch-id-${integration.id}` }
                                aria-label="Enabled"
                                isChecked={ integration.isEnabled }
                                onChange={ isChecked => onEnable && onEnable(integration, idx, isChecked) }
                                ouiaId={ `enabled-${integration.id}` }
                            />
                        ) }
                    </>
                }
            ]
        });
        rows.push({
            parent: idx * 2,
            fullWidth: true,
            showSelect: false,
            noPadding: false,
            cells: [
                {
                    title: <>
                        <div className={ expandedContentClassName }>
                            { integration.lastConnectionAttempts !== undefined && getConnectionAlert(integration.lastConnectionAttempts) }
                            <ExpandedContent integration={ integration } ouiaId={ integration.id } />
                        </div>
                    </>
                }
            ]
        });
        return rows;
    }, [] as Array<IRow>);
};

const columns: Array<ICell> = [
    {
        title: Messages.components.integrations.table.columns.name,
        cellFormatters: [ expandable ],
        transforms: []
    },
    {
        title: Messages.components.integrations.table.columns.type,
        transforms: []
    },
    {
        title: Messages.components.integrations.table.columns.lastConnectionAttempt,
        transforms: []
    },
    {
        title: Messages.components.integrations.table.columns.enabled,
        transforms: []
    }
];

const buildClassNames = () => {
    const noneStyle = important('none');
    const borderStyle = important('var(--pf-c-table--border-width--base) solid var(--pf-c-table--BorderColor)');

    const noBorderBottom = {
        borderBottom: noneStyle
    };

    const rowExpandedContentClassName = style(noBorderBottom);
    const rowWrapperClassName = style(noBorderBottom, {
        borderTop: borderStyle
    });
    const tableClassName = style({
        borderBottom: borderStyle
    });

    return {
        rowExpandedContentClassName,
        rowWrapperClassName,
        tableClassName
    };
};

const {
    rowExpandedContentClassName,
    rowWrapperClassName,
    tableClassName
} = buildClassNames();

const RowWrapper: React.FunctionComponent<RowWrapperProps> = (props) => {
    const { trRef, className, rowProps, row, ...rest } = props;
    if (!row) {
        return <></>;
    }

    return (
        <tr
            { ...rest }
            ref={ trRef as any }
            className={ css(
                className,
                row.isExpanded === true ? rowExpandedContentClassName : rowWrapperClassName,
                row.isExpanded !== undefined && styles.tableExpandableRow,
                row.isExpanded && styles.modifiers.expanded
            ) }
            hidden={ row?.isExpanded !== undefined && !row.isExpanded }
        >
            { props.children }
        </tr>
    );
};

export const IntegrationsTable: React.FunctionComponent<IntegrationsTableProps> = (props) => {

    const onCollapseHandler = React.useCallback((_event, _index: number, isOpen: boolean, data: IRowData) => {
        const integrations = props.integrations;
        const onCollapse = props.onCollapse;
        const index = integrations.findIndex(integration => integration.id === data.id);
        if (onCollapse && index !== -1) {
            const integration = integrations[index];
            onCollapse(integration, index, isOpen);
        }
    }, [ props.integrations, props.onCollapse ]);

    const rows = React.useMemo(() => {
        return toTableRows(props.integrations, props.onEnable);
    }, [ props.integrations, props.onEnable ]);

    const actionsResolverCallback: IActionsResolver = React.useCallback(rowData => {
        const actionResolver = props.actionResolver;
        if (rowData.parent === undefined && rowData && props.integrations) {
            const integrationRow = props.integrations.find(i => i.id === rowData.id);
            if (integrationRow) {
                return actionResolver(integrationRow);
            }
        }

        return [];
    }, [ props.actionResolver, props.integrations ]);

    return (
        <div { ...getOuiaProps('Integrations/Table', props) }>
            <Table
                className={ tableClassName }
                aria-label={ Messages.components.integrations.table.title }
                rows={ rows }
                cells={ columns }
                onCollapse={ onCollapseHandler }
                rowWrapper={ RowWrapper as (props: RowWrapperProps) => JSX.Element }
                actionResolver={ actionsResolverCallback }
            >
                <TableHeader/>
                <TableBody/>
            </Table>
        </div>
    );
};
