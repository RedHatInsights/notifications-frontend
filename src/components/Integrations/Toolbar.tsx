import * as React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../properties/Messages';
import { ClearIntegrationFilters, IntegrationFilterColumn, IntegrationFilters, SetIntegrationFilters } from './Filters';
import { FilterColumnMetadata, usePrimaryToolbarFilterConfig } from '../../hooks/usePrimaryToolbarFilterConfig';

interface IntegrationsToolbarProps {
    onAddIntegration: () => void;
    onExport: (type: string) => void;
    filters: IntegrationFilters;
    setFilters: SetIntegrationFilters;
    clearFilters: ClearIntegrationFilters;
}

const filterMetadata: Record<IntegrationFilterColumn, FilterColumnMetadata> = {
    [IntegrationFilterColumn.NAME]: {
        label: 'Name',
        placeholder: 'Filter by name'
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

    return (
        <>
            <PrimaryToolbar
                actionsConfig={ actionsConfig }
                exportConfig={ exportConfig }
                filterConfig={ primaryToolbarFilterConfig.filterConfig }
                activeFiltersConfig={ primaryToolbarFilterConfig.activeFiltersConfig }
            />
            { props.children }
            <PrimaryToolbar/>
        </>
    );
};
