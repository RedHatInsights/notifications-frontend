import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InProgressIcon, UnknownIcon } from '@patternfly/react-icons';
import { c_alert_m_warning__icon_Color, global_danger_color_100, global_success_color_100 } from '@patternfly/react-tokens';
import { assertNever } from 'assert-never';
import * as React from 'react';

import { Schemas } from '../../generated/OpenapiNotifications';
import { Status } from '../Status/Status';

interface NotificationStatusProps {
    status: Schemas.EventLogEntryActionStatus;
}

export const NotificationStatus: React.FunctionComponent<NotificationStatusProps> = props => {
    switch (props.status) {
        case 'FAILED':
            return <NotificationStatusFailed />;
        case 'PROCESSING':
            return <NotificationStatusProcessing />;
        case 'SENT':
            return <NotificationStatusSent />;
        case 'SUCCESS':
            return <NotificationStatusSuccess />;
        case 'UNKNOWN':
            return <NotificationStatusUnknown />;
        default:
            assertNever(props.status);
    }
};

export const NotificationStatusFailed: React.FunctionComponent = () =>
    <Status text="Failure">
        <ExclamationCircleIcon data-testid="fail-icon" color={ global_danger_color_100.value } />
    </Status>;

export const NotificationStatusUnknown: React.FunctionComponent = () =>
    <Status text="Unknown">
        <UnknownIcon data-testid="unknown-icon" />
    </Status>;

export const NotificationStatusProcessing: React.FunctionComponent = () =>
    <Status text="Processing">
        <InProgressIcon data-testid="in-progress-icon" />
    </Status>;

export const NotificationStatusSent: React.FunctionComponent = () =>
    <Status text="Sent">
        <CheckCircleIcon data-testid="success-icon" color={ global_success_color_100.value } />
    </Status>;

export const NotificationStatusSuccess: React.FunctionComponent = () =>
    <Status text="Success">
        <CheckCircleIcon data-testid="success-icon" color={ global_success_color_100.value } />
    </Status>;

export const NotificationStatusWarning: React.FunctionComponent = () =>
    <Status text="Warning">
        <ExclamationTriangleIcon color={ c_alert_m_warning__icon_Color.value } />
    </Status>;
