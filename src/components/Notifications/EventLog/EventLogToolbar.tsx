import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ColumnsMetada,
    OuiaComponentProps,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { getOuiaProps } from '../../../utils/getOuiaProps';
import { ClearEventLogFilters, EventLogFilterColumn, EventLogFilters, SetEventLogFilters } from './EventLogFilter';
import { Facet } from '../../../types/Notification';

interface EventLogToolbarProps extends OuiaComponentProps {
    filters: EventLogFilters,
    setFilters: SetEventLogFilters,
    clearFilter: ClearEventLogFilters

    bundleOptions: ReadonlyArray<Facet>;
    applicationOptions: ReadonlyArray<Facet>;
}

export const EventLogToolbar: React.FunctionComponent<EventLogToolbarProps> = (props) => {

    const filterMetadata = React.useMemo<ColumnsMetada<typeof EventLogFilterColumn>>(() => {
        const bundleOptions = props.bundleOptions;
        const applicationOptions = props.applicationOptions;
        return {
            [EventLogFilterColumn.EVENT]: {
                label: 'Event',
                placeholder: 'Filter by event'
            },
            [EventLogFilterColumn.BUNDLE]: {
                label: 'Bundle',
                placeholder: 'Filter by bundle',
                options: {
                    exclusive: false,
                    items: bundleOptions.map(b => ({
                        value: b.name,
                        label: b.displayName
                    }))
                }
            },
            [EventLogFilterColumn.APPLICATION]: {
                label: 'Application',
                placeholder: 'Filter by application',
                options: {
                    exclusive: false,
                    items: applicationOptions.map(a => ({
                        value: a.name,
                        label: a.displayName
                    }))
                }
            }
        };
    }, [ props.bundleOptions, props.applicationOptions ]);

    console.log('filterMetadata', filterMetadata);

    const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfig(
        EventLogFilterColumn,
        props.filters,
        props.setFilters,
        props.clearFilter,
        filterMetadata
    );

    return (
        <div { ...getOuiaProps('Notifications/EventLog/DualToolbar', props) }>
            <PrimaryToolbar
                { ...primaryToolbarFilterConfig }
            />
            { props.children }
            <PrimaryToolbar />
        </div>
    );
};
