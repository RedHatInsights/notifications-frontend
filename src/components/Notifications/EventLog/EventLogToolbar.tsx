import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ColumnsMetada,
    OuiaComponentProps
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

import { useIntegrations } from '../../../hooks/useIntegrations';
import { useNotifications } from '../../../hooks/useNotifications';
import { EventPeriod } from '../../../types/Event';
import { IntegrationType } from '../../../types/Integration';
import { Facet, NotificationType } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { EventLogDateFilter, EventLogDateFilterValue } from './EventLogDateFilter';
import { ClearEventLogFilters, EventLogFilterColumn, EventLogFilters, SetEventLogFilters } from './EventLogFilter';
import { usePrimaryToolbarFilterConfigWrapper } from './usePrimaryToolbarFilterConfigWrapper';

interface EventLogToolbarProps extends OuiaComponentProps {
    filters: EventLogFilters,
    setFilters: SetEventLogFilters,
    clearFilter: ClearEventLogFilters

    bundleOptions: ReadonlyArray<Facet>;

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

const notificationTypes: Record<NotificationType, { name: string }> = {
    [NotificationType.EMAIL_SUBSCRIPTION]: {
        name: 'Email'
    },
    [NotificationType.DRAWER]: {
        name: 'Drawer'
    },
    [NotificationType.INTEGRATION]: {
        name: 'Integration'
    }
};

const integrationTypes: Record<IntegrationType, { name: string }> = {
    [IntegrationType.SPLUNK]: {
        name: 'Integration: Splunk'
    },
    [IntegrationType.SLACK]: {
        name: 'Integration: Slack'
    },
    [IntegrationType.WEBHOOK]: {
        name: 'Integration: Webhook'
    },
    [IntegrationType.EMAIL_SUBSCRIPTION]: {
        name: 'Email'
    }
};

const actionStatusMetadata = [
    {
        value: 'true',
        chipValue: 'Success',
        label: <span><CheckCircleIcon color='green' /> Success</span>
    },
    {
        value: 'false',
        chipValue: 'Failure',
        label: <span><ExclamationCircleIcon color='red' /> Failure</span>
    }
];

export const EventLogToolbar: React.FunctionComponent<EventLogToolbarProps> = (props) => {
    const notifications = useNotifications();
    const integrations = useIntegrations();

    const actionTypeMetadata = React.useMemo(() => {
        return notifications.map(notification => ({
            value: notification.toUpperCase(),
            chipValue: notificationTypes[notification].name,
            label: notificationTypes[notification].name
        })).concat(
            integrations.map(integration => ({
                value: integration.toUpperCase(),
                chipValue: integrationTypes[integration].name,
                label: integrationTypes[integration].name
            })));
    }, [ notifications, integrations ]);

    const filterMetadata = React.useMemo<Partial<ColumnsMetada<typeof EventLogFilterColumn>>>(() => {
        return {
            [EventLogFilterColumn.EVENT]: {
                label: 'Event',
                placeholder: 'Filter by event'
            },
            [EventLogFilterColumn.APPLICATION]: {
                label: 'Application',
                placeholder: 'Filter by application'
            },
            [EventLogFilterColumn.ACTION_TYPE]: {
                label: 'Action Type',
                placeholder: 'Filter by action type',
                options: {
                    exclusive: false,
                    items: actionTypeMetadata
                }
            },
            [EventLogFilterColumn.ACTION_STATUS]: {
                label: 'Action Status',
                placeholder: 'Filter by action status',
                options: {
                    exclusive: false,
                    items: actionStatusMetadata
                }
            }
        };
    }, [ actionTypeMetadata ]);

    const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfigWrapper(
        props.bundleOptions,
        props.filters,
        props.setFilters,
        props.clearFilter,
        filterMetadata as ColumnsMetada<typeof EventLogFilterColumn>
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
