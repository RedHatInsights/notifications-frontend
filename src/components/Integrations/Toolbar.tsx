import * as React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../properties/Messages';
import { ClearIntegrationFilters, IntegrationFilterColumn, IntegrationFilters, SetIntegrationFilters } from './Filters';
import { style } from 'typestyle';
import { DisabledIntegrationIcon, EnabledIntegrationIcon } from '../Icons';
import {
    ColumnsMetada,
    OuiaComponentProps,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { Pager } from '../../hooks/usePager';
import { PaginationProps, PaginationVariant } from '@patternfly/react-core';

interface IntegrationsToolbarProps extends OuiaComponentProps {
    onAddIntegration: () => void;
    onExport: (type: string) => void;
    filters: IntegrationFilters;
    setFilters: SetIntegrationFilters;
    clearFilters: ClearIntegrationFilters;

    pager: Pager;
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
            exclusive: true,
            items: [
                {
                    value: 'all',
                    label: <>All</>
                },
                {
                    value: 'Enabled',
                    label: <><EnabledIntegrationIcon/> <span className={ enabledTextClassName }>Enabled</span></>
                },
                {
                    value: 'Disabled',
                    label: <><DisabledIntegrationIcon/> <span className={ enabledTextClassName }>Disabled</span></>
                }
            ],
            default: 'all',
            exclude: [ 'all' ]
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

    const exportConfig = React.useMemo(() => {
        const onExport = props.onExport;
        if (onExport) {
            return {
                extraItems: [],
                onSelect: (_event, type: string) => onExport(type)
            };
        }

        return undefined;
    }, [ props.onExport ]);

    const changePage = React.useCallback((_event: unknown, page: number) => {
        props.pager.changePage(page);
    }, [ props.pager ]);

    const changePerPage = React.useCallback((_event: unknown, perPage: number) => {
        props.pager.changeItemsPerPage(perPage);
    }, [ props.pager ]);

    const topPaginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: 1,
        page: props.pager.page.index,
        perPage: props.pager.page.size,
        onSetPage: changePage,
        onFirstClick: changePage,
        onPreviousClick: changePage,
        onNextClick: changePage,
        onLastClick: changePage,
        onPageInput: changePage,
        onPerPageSelect: changePerPage,
        isCompact: true,
        variant: PaginationVariant.top
    }), [ props.pager, changePage, changePerPage ]);

    const bottomPaginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: 1,
        page: props.pager.page.index,
        perPage: props.pager.page.size,
        onSetPage: changePage,
        onFirstClick: changePage,
        onPreviousClick: changePage,
        onNextClick: changePage,
        onLastClick: changePage,
        onPageInput: changePage,
        onPerPageSelect: changePerPage,
        isCompact: true,
        variant: PaginationVariant.top
    }), [ props.pager, changePage, changePerPage ]);

    return (
        <div { ...getOuiaProps('Integrations/DualToolbar', props) }>
            <PrimaryToolbar
                actionsConfig={ actionsConfig }
                exportConfig={ exportConfig }
                filterConfig={ primaryToolbarFilterConfig.filterConfig }
                activeFiltersConfig={ primaryToolbarFilterConfig.activeFiltersConfig }
                id="integrations-top-toolbar"
                pagination={ topPaginationProps }
            />
            { props.children }
            <PrimaryToolbar id="integrations-bottom-toolbar"
                pagination={ bottomPaginationProps }
            />
        </div>
    );
};
