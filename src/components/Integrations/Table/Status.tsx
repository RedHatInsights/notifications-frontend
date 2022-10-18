import { HelperText, HelperTextItem } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, InProgressIcon, UnknownIcon } from '@patternfly/react-icons';
import { global_danger_color_100, global_spacer_sm, global_success_color_100 } from '@patternfly/react-tokens';
import React from 'react';
import { style } from 'typestyle';

const smallMarginLeft = style({
    marginLeft: global_spacer_sm.var
});

const degradedClassName = style({
    fontWeight: 600
});

interface StatusProps {
    text: string;
    isDegraded?: boolean;
}

interface SpecificStatusProps {
    isDegraded?: boolean;
}

const Status: React.FunctionComponent<StatusProps> = (props) => (
    <span>
        { props.children }
        <span className={ smallMarginLeft }>{ props.text }</span>
        { props.isDegraded && <HelperText>
            <HelperTextItem className={ degradedClassName } variant="warning">Degraded connection</HelperTextItem>
        </HelperText> }
    </span>
);

export const StatusSuccess: React.FunctionComponent<SpecificStatusProps> = props =>
    <Status text="Success" isDegraded={ props.isDegraded }>
        <CheckCircleIcon data-testid="success-icon" color={ global_success_color_100.value } />
    </Status>;

export const StatusEventFailure: React.FunctionComponent<SpecificStatusProps> = props =>
    <Status text="Event failure" isDegraded={ props.isDegraded }>
        <ExclamationCircleIcon data-testid="fail-icon" color={ global_danger_color_100.value } />
    </Status>;

export const StatusReady: React.FunctionComponent<unknown> = () =>
    <Status text="Ready">
        <CheckCircleIcon data-testid="success-icon" color={ global_success_color_100.value } />
    </Status>;

export const StatusCreationFailure: React.FunctionComponent<unknown> = () =>
    <Status text="Creation failure">
        <ExclamationCircleIcon data-testid="fail-icon" color={ global_danger_color_100.value } />
    </Status>;

export const StatusProcessing: React.FunctionComponent<unknown> = () =>
    <Status text="Processing">
        <InProgressIcon data-testid="in-progress-icon" />
    </Status>;

export const StatusUnknown: React.FunctionComponent<unknown> = () =>
    <Status text="Error loading status">
        <UnknownIcon data-testid="unknown-icon" />
    </Status>;
