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
import { Spinner, Switch } from '@patternfly/react-core';
import { Messages } from '../../properties/Messages';
import { Integration } from '../../types/Integration';
import { ExpandedContent } from './Table/ExpandedContent';
import { style } from 'typestyle';
import { OuiaComponentProps, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { css } from '@patternfly/react-styles';
import { important } from 'csx';
import { getOuiaProps } from '../../utils/getOuiaProps';

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
}

const expandedContentClassName = style({
    paddingLeft: Spacer.LG,
    paddingBottom: Spacer.LG
});

const isEnabledLoadingClassName = style({
    marginLeft: 10
});

const toTableRows = (integrations: Array<IntegrationRow>, onEnable?: OnEnable): Array<IRow> => {
    return integrations.reduce((rows, integration, idx) => {
        rows.push({
            id: integration.id,
            key: integration.id,
            isOpen: integration.isOpen,
            selected: integration.isSelected,
            cells: [
                integration.name,
                Messages.components.integrations.integrationType[integration.type],
                <>
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
            ]
        });
        rows.push({
            parent: idx * 2,
            fullWidth: true,
            showSelect: false,
            noPadding: false,
            cells: [
                <>
                    <div className={ expandedContentClassName }>
                        <ExpandedContent integration={ integration } ouiaId={ integration.id } />
                    </div>
                </>
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
