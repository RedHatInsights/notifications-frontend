import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ColumnsMetada, ExporterType, getInsights,
    OuiaComponentProps, useInsightsEnvironmentFlag,
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
                    label: <><EnabledIntegrationIcon /> <span className={ enabledTextClassName }>Enabled</span></>
                },
                {
                    value: 'Disabled',
                    label: <><DisabledIntegrationIcon /> <span className={ enabledTextClassName }>Disabled</span></>
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

    return (
        <div { ...getOuiaProps('Integrations/DualToolbar', props) }>
            <PrimaryToolbar
                actionsConfig={ actionsConfig }
                exportConfig={ exportConfig }
                filterConfig={ filterConfig }
                activeFiltersConfig={ activeFiltersConfig }
                id="integrations-top-toolbar"
            />
            { props.children }
            <PrimaryToolbar id="integrations-bottom-toolbar" />
        </div>
    );
};
