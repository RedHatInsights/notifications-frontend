import * as React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../properties/Messages';
import { ClearIntegrationFilters, IntegrationFilterColumn, IntegrationFilters, SetIntegrationFilters } from './Filters';
import { style } from 'typestyle';
import { DisabledIntegrationIcon, EnabledIntegrationIcon } from '../Icons';
import { ColumnsMetada, usePrimaryToolbarFilterConfig } from '@redhat-cloud-services/insights-common-typescript';

interface IntegrationsToolbarProps {
    onAddIntegration: () => void;
    onExport: (type: string) => void;
    filters: IntegrationFilters;
    setFilters: SetIntegrationFilters;
    clearFilters: ClearIntegrationFilters;
}

const enabledTextClassName = style({
    marginLeft: 4
});

const filterMetadata: ColumnsMetada<typeof IntegrationFilterColumn> = {
    [IntegrationFilterColumn.NAME]: {
        label: 'Name',
        placeholder: 'Filter by name'
    },
    [IntegrationFilterColumn.TYPE]: {
        label: 'Type',
        placeholder: 'Filter by type'
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
