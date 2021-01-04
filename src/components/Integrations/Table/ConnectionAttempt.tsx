import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100, global_spacer_xs, global_success_color_100 } from '@patternfly/react-tokens';
import { toUtc } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';
import format from 'date-fns/format';
import * as React from 'react';
import { style } from 'typestyle';

export interface ConnectionAttemptProps {
    type: ConnectionAttemptType;
    date: Date;
}

export enum ConnectionAttemptType {
    SUCCESS,
    FAILED
}

const dateClassName = style({
    marginLeft: global_spacer_xs.var
});

const dateFormatString = 'MMM d, HH:mm:ss';

const getIcon = (type: ConnectionAttemptType) => {
    switch (type) {
        case ConnectionAttemptType.SUCCESS:
            return <CheckCircleIcon color={ global_success_color_100.value } />;
        case ConnectionAttemptType.FAILED:
            return <ExclamationCircleIcon color={ global_danger_color_100.value } />;
        default:
            assertNever(type);
    }
};

export const ConnectionAttempt: React.FunctionComponent<ConnectionAttemptProps> = (props) => {
    const formattedDate = format(toUtc(props.date), dateFormatString);
    return (
        <>
            { getIcon(props.type) } <span className={ dateClassName }> { formattedDate } UTC </span>
        </>
    );
};
