import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ColumnsMetada,
    ExporterType,
    getInsights,
    OuiaComponentProps,
    useInsightsEnvironmentFlag,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useCallback } from 'react';
import { style } from 'typestyle';

import { useTableExportConfig } from '../../hooks/useTableExportConfig';
import { Messages } from '../../properties/Messages';
import { stagingBetaAndProdBetaEnvironment } from '../../types/Environments';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { DisabledIntegrationIcon, EnabledIntegrationIcon } from '../Icons';
import { ClearIntegrationFilters, IntegrationFilterColumn, IntegrationFilters, SetIntegrationFilters } from './Filters';

interface IntegrationsToolbarProps extends OuiaComponentProps {
    onAddIntegration?: () => void;
    onExport: (type: ExporterType) => void;
    filters: IntegrationFilters;
    setFilters: SetIntegrationFilters;
    clearFilters: ClearIntegrationFilters;
    pageCount: number;
    count: number;
    page: number;
    perPage: number;
    pageChanged: (page: number) => void;
    perPageChanged: (page: number) => void;
}

const enabledTextClassName = style({
    marginLeft: 4
});

const filterMetadata: ColumnsMetada<typeof IntegrationFilterColumn> = {
    [IntegrationFilterColumn.NAME]: {
        label: 'Name',
        placeholder: 'Filter by name'
    },
    [IntegrationFilterColumn.ENABLED]: {
        label: 'Enabled',
        placeholder: 'Filter by enabled',
        options: {
            exclusive: false,
            items: [
                {
                    value: 'Enabled',
                    label: <><EnabledIntegrationIcon /> <span className={ enabledTextClassName }>Enabled</span></>
                },
                {
                    value: 'Disabled',
                    label: <><DisabledIntegrationIcon /> <span className={ enabledTextClassName }>Disabled</span></>
                }
            ]
        }
    }
};

export const IntegrationsToolbar: React.FunctionComponent<IntegrationsToolbarProps> = (props) => {

    const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfig(
        IntegrationFilterColumn,
        props.filters,
        props.setFilters,
        props.clearFilters,
        filterMetadata
    );

    const actionsConfig = React.useMemo(() => {
        const actions = [
            {
                key: 'add-integration',
                label: Messages.components.integrations.toolbar.actions.addIntegration,
                onClick: props.onAddIntegration,
                props: {
                    isDisabled: !props.onAddIntegration
                }
            }
        ];

        return {
            actions,
            kebabToggleProps: {
                isDisabled: false
            }
        };
    }, [ props.onAddIntegration ]);

    const exportConfig = useTableExportConfig(props.onExport);

    const filterConfig = useInsightsEnvironmentFlag(
        getInsights(),
        stagingBetaAndProdBetaEnvironment,
        undefined,
        useCallback(() => primaryToolbarFilterConfig.filterConfig, [ primaryToolbarFilterConfig ])
    );

    const activeFiltersConfig = useInsightsEnvironmentFlag(
        getInsights(),
        stagingBetaAndProdBetaEnvironment,
        undefined,
        useCallback(() => primaryToolbarFilterConfig.activeFiltersConfig, [ primaryToolbarFilterConfig ])
    );

    const pageChanged = React.useCallback((_event: unknown, page: number) => {
        const inner = props.pageChanged;
        inner(page);
    }, [ props.pageChanged ]);

    const perPageChanged = React.useCallback((_event: unknown, perPage: number) => {
        const inner = props.perPageChanged;
        inner(perPage);
    }, [ props.perPageChanged ]);

    const topPaginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: props.count,
        page: props.page,
        perPage: props.perPage,
        isCompact: true,
        variant: PaginationVariant.top,
        onSetPage: pageChanged,
        onFirstClick: pageChanged,
        onPreviousClick: pageChanged,
        onNextClick: pageChanged,
        onLastClick: pageChanged,
        onPageInput: pageChanged,
        onPerPageSelect: perPageChanged
    }), [ props.count, props.page, props.perPage, pageChanged, perPageChanged ]);

    const bottomPaginationProps = React.useMemo<PaginationProps>(() => ({
        ...topPaginationProps,
        isCompact: false,
        variant: PaginationVariant.bottom
    }), [ topPaginationProps ]);

    return (
        <div { ...getOuiaProps('Integrations/DualToolbar', props) }>
            <PrimaryToolbar
                actionsConfig={ actionsConfig }
                exportConfig={ exportConfig }
                filterConfig={ filterConfig }
                activeFiltersConfig={ activeFiltersConfig }
                pagination={ topPaginationProps }
                id="integrations-top-toolbar"
            />
            { props.children }
            <PrimaryToolbar id="integrations-bottom-toolbar" pagination={ bottomPaginationProps } />
        </div>
    );
};
