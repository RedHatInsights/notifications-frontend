import { Spinner } from '@patternfly/react-core';
import { EnvelopeIcon } from '@patternfly/react-icons';
import BellIcon from '@patternfly/react-icons/dist/js/icons/bell-icon';
import { global_spacer_sm } from '@patternfly/react-tokens';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';
import * as React from 'react';
import { style } from 'typestyle';

import Config from '../../config/Config';
import { Action, NotificationType } from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { WebhookIcon } from '../Icons/WebhookIcon';

export interface ActionComponentText extends OuiaComponentProps{
    isDefault: boolean;
    action: Action | undefined;
    loading?: boolean;
    hasError?: boolean;
}

interface ActionTypeToIconProps {
    actionType: NotificationType;
}

const marginLeftClassName = style({
    marginLeft: global_spacer_sm.var
});

const grayFontClassName = style({
    color: '#888'
});

const ActionTypeToIcon: React.FunctionComponent<ActionTypeToIconProps> = (props) => {
    switch (props.actionType) {
        case NotificationType.DRAWER:
            return <BellIcon />;
        case NotificationType.EMAIL_SUBSCRIPTION:
            return <EnvelopeIcon />;
        case NotificationType.INTEGRATION:
            return <WebhookIcon />;
        default:
            assertNever(props.actionType);
    }
};

const ActionComponentWrapper: React.FunctionComponent<ActionComponentText> = (props) => (
    <div { ...getOuiaProps('Notifications/ActionComponent', props) }>
        { props.children }
    </div>
);

export const ActionComponent: React.FunctionComponent<ActionComponentText> = (props) => {

    if (props.loading) {
        return (
            <ActionComponentWrapper { ...props }>
                <Spinner size="md" />
            </ActionComponentWrapper>
        );
    }

    if (props.hasError) {
        return (
            <ActionComponentWrapper { ...props }>
                <span>Error loading actions</span>
            </ActionComponentWrapper>
        );
    }

    if (props.isDefault) {
        return (
            <ActionComponentWrapper { ...props }>
                <span>Default behavior</span>
            </ActionComponentWrapper>
        );
    }

    if (!props.action) {
        return (
            <ActionComponentWrapper { ...props }>
                <span className={ grayFontClassName }>
                    <div>No actions.</div>
                    <div>Users will not be notified.</div>
                </span>
            </ActionComponentWrapper>
        );
    }

    return (
        <ActionComponentWrapper { ...props }>
            <ActionTypeToIcon actionType={ props.action.type } />
            <span className={ marginLeftClassName }>{ Config.notifications.types[props.action.type].name }</span>
            { props.action.type === NotificationType.INTEGRATION && (
                <span>: { Config.integrations.types[props.action.integration.type].name }</span>
            ) }
        </ActionComponentWrapper>
    );
};
