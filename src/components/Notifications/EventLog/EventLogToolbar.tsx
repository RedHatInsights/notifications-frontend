import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ColumnsMetada,
    OuiaComponentProps,
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { usePrimaryToolbarFilterConfigWrapper } from '../../../hooks/usePrimaryToolbarFilterConfigWrapper';

import { EventPeriod } from '../../../types/Event';
import { Facet } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { EventLogDateFilter, EventLogDateFilterValue } from './EventLogDateFilter';
import { ClearEventLogFilters, EventLogFilterColumn, EventLogFilters, SetEventLogFilters } from './EventLogFilter';

interface EventLogToolbarProps extends OuiaComponentProps {
    filters: EventLogFilters,
    setFilters: SetEventLogFilters,
    clearFilter: ClearEventLogFilters

    bundleOptions: ReadonlyArray<Facet>;
    applicationOptions: ReadonlyArray<Facet>;

    pageCount: number;
    count: number;
    page: number;
    perPage: number;
    pageChanged: (page: number) => void;
    perPageChanged: (page: number) => void;

    dateFilter: EventLogDateFilterValue;
    setDateFilter: (value: EventLogDateFilterValue) => void;

    retentionDays: number;
    period: EventPeriod;
    setPeriod: Dispatch<SetStateAction<EventPeriod>>;
}

export const EventLogToolbar: React.FunctionComponent<EventLogToolbarProps> = (props) => {
    // const testRef = React.useRef<any>(<TreeDropdownFilter groups={props.bundleOptions} items={props.applicationOptions} placeholder={"Filter by Application"}/>)
    const filterMetadata = React.useMemo<ColumnsMetada<any>>(() => {
        // const bundleOptions = props.bundleOptions;
        // const applicationOptions = props.applicationOptions;
        return {
            [EventLogFilterColumn.EVENT]: {
                label: 'Event',
                placeholder: 'Filter by event'
            },
            // [EventLogFilterColumn.BUNDLE]: {
            //     label: 'Bundle',
            //     placeholder: 'Filter by bundle',
            //     options: {
            //         exclusive: false,
            //         items: bundleOptions.map(b => ({
            //             value: b.name,
            //             chipValue: b.displayName,
            //             label: b.displayName
            //         }))
            //     }
            // },
            // [EventLogFilterColumn.APPLICATION]: {
            //     label: 'Application',
            //     placeholder: 'Filter by application',
            //     options: {
            //         exclusive: false,
            //         items: applicationOptions.map(a => ({
            //             value: a.name,
            //             chipValue: a.displayName,
            //             label: a.displayName
            //         }))
            //     }
            // }
        };
    }, [ props.bundleOptions, props.applicationOptions ]);

    // const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfig(
    //     EventLogFilterColumn,
    //     props.filters,
    //     props.setFilters,
    //     props.clearFilter,
    //     filterMetadata
    // );

    const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfigWrapper(
        props.bundleOptions,
        props.applicationOptions,
        props.filters,
        props.setFilters,
        props.clearFilter,
        filterMetadata,
        // testRef,
    )
    console.log(primaryToolbarFilterConfig)

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
        <div { ...getOuiaProps('Notifications/EventLog/DualToolbar', props) }>
            <PrimaryToolbar
                { ...primaryToolbarFilterConfig }
                dedicatedAction={ <EventLogDateFilter
                    value={ props.dateFilter }
                    setValue={ props.setDateFilter }
                    retentionDays={ props.retentionDays }
                    setPeriod={ props.setPeriod }
                    period={ props.period }
                /> }
                pagination={ topPaginationProps }
            />
            { props.children }
            <PrimaryToolbar
                pagination={ bottomPaginationProps }
            />
        </div>
    );
};
