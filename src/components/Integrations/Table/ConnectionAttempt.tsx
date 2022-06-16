import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100, global_spacer_xs, global_success_color_100 } from '@patternfly/react-tokens';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import { assertNever } from 'assert-never';
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
    return (
        <>
            { getIcon(props.type) }
            <span className={ dateClassName }>
                <DateFormat type="relative" date={ props.date } />
            </span>
        </>
    );
};
