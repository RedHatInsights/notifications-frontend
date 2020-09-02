import * as React from 'react';
import { assertNever, PFColors, Spacer, toUtc } from '@redhat-cloud-services/insights-common-typescript';
import format from 'date-fns/format';
import { ExclamationCircleIcon, CheckCircleIcon } from '@patternfly/react-icons';
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
    marginLeft: Spacer.XS
});

const dateFormatString = 'MMM d, HH:mm:ss';

const getIcon = (type: ConnectionAttemptType) => {
    switch (type) {
        case ConnectionAttemptType.SUCCESS:
            return <CheckCircleIcon color={ PFColors.GlobalSuccessColor200 } />;
        case ConnectionAttemptType.FAILED:
            return <ExclamationCircleIcon color={ PFColors.GlobalDangerColor100 } />;
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
