import { Spinner } from '@patternfly/react-core';
import { CheckCircleIcon, ErrorCircleOIcon, ExclamationCircleIcon, UnknownIcon } from '@patternfly/react-icons';
import { global_danger_color_100, global_spacer_sm, global_success_color_100 } from '@patternfly/react-tokens';
import React from 'react';
import { style } from 'typestyle';

import { Integration } from '../../../types/Integration';

const smallMarginLeft = style({
    marginLeft: global_spacer_sm.var
});

interface StatusProps {
    text: string;
}

const Status: React.FunctionComponent<StatusProps> = (props) => (
    <span>
        { props.children }
        <span className={ smallMarginLeft }>{ props.text }</span>
    </span>
);

export interface IntegrationStatusProps {
    status: Integration['status'];
}

export const IntegrationStatus: React.FunctionComponent<IntegrationStatusProps> = props => {
    switch (props.status ?? 'UNKNOWN') {
        case 'UNKNOWN':
            return <Status text="Unknown"><UnknownIcon /></Status>;
        case 'DELETING':
            return <Status text="Deleting"><ExclamationCircleIcon color={ global_danger_color_100.value } /></Status>;
        case 'FAILED':
            return <Status text="Failed"><ErrorCircleOIcon color={ global_danger_color_100.value } /></Status>;
        case 'PROVISIONING':
            return <Status text="Provisioning"><Spinner size="md" /></Status>;
        case 'READY':
            return <Status text="Ready"><CheckCircleIcon color={ global_success_color_100.value } /></Status>;
        case 'NEW':
            return <Status text="New"><Spinner size="md" /></Status>;
    }
};
