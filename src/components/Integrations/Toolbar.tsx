import * as React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../properties/Messages';
import { ClearIntegrationFilters, IntegrationFilterColumn, IntegrationFilters, SetIntegrationFilters } from './Filters';
import { style } from 'typestyle';
import { DisabledIntegrationIcon, EnabledIntegrationIcon } from '../Icons';
import {
    ColumnsMetada, ExporterType,
    OuiaComponentProps,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { useTableExportConfig } from '../../hooks/useTableExportConfig';

interface IntegrationsToolbarProps extends OuiaComponentProps {
    onAddIntegration: () => void;
    onExport: (type: ExporterType) => void;
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

    const exportConfig = useTableExportConfig(props.onExport);

    return (
        <div { ...getOuiaProps('Integrations/DualToolbar', props) }>
            <PrimaryToolbar
                actionsConfig={ actionsConfig }
                exportConfig={ exportConfig }
                filterConfig={ primaryToolbarFilterConfig.filterConfig }
                activeFiltersConfig={ primaryToolbarFilterConfig.activeFiltersConfig }
                id="integrations-top-toolbar"
            />
            { props.children }
            <PrimaryToolbar id="integrations-bottom-toolbar" />
        </div>
    );
};
