import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ColumnsMetada,
    OuiaComponentProps
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

import { EventPeriod } from '../../../types/Event';
import { Facet } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { EventLogDateFilter, EventLogDateFilterValue } from './EventLogDateFilter';
import { ClearEventLogFilters, EventLogFilterColumn, EventLogFilters, SetEventLogFilters } from './EventLogFilter';
import { usePrimaryToolbarFilterConfigWrapper } from './usePrimaryToolbarFilterConfigWrapper';

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
    const filterMetadata = React.useMemo<ColumnsMetada<any>>(() => {
        const metaData: ColumnsMetada<any> = {
            [EventLogFilterColumn.EVENT]: {
                label: 'Event',
                placeholder: 'Filter by event'
            }
        };

        return metaData;
    }, []);

    const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfigWrapper(
        props.bundleOptions,
        props.applicationOptions,
        props.filters,
        props.setFilters,
        props.clearFilter,
        filterMetadata
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
