import * as React from 'react';
import { EnvelopeIcon, SlackHashIcon } from '@patternfly/react-icons';
import BellIcon from '@patternfly/react-icons/dist/js/icons/bell-icon';
import { assertNever, OuiaComponentProps, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { Action, NotificationType } from '../../types/Notification';
import { Messages } from '../../properties/Messages';
import { style } from 'typestyle';
import { getOuiaProps } from '../../utils/getOuiaProps';

export interface ActionComponentText extends OuiaComponentProps{
    isDefault: boolean;
    action: Action | undefined;
}

interface ActionTypeToIconProps {
    actionType: NotificationType;
}

const marginLeftClassName = style({
    marginLeft: Spacer.SM
});

const grayFontClassName = style({
    color: '#888'
});

const ActionTypeToIcon: React.FunctionComponent<ActionTypeToIconProps> = (props) => {
    switch (props.actionType) {
        case NotificationType.DRAWER:
        case NotificationType.PLATFORM_ALERT:
            return <BellIcon/>;
        case NotificationType.EMAIL:
            return <EnvelopeIcon/>;
        case NotificationType.INTEGRATION:
            return <SlackHashIcon/>;
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
            <ActionTypeToIcon actionType={ props.action.type }/>
            <span className={ marginLeftClassName }>{ Messages.components.notifications.types[props.action.type] }</span>
            { props.action.type === NotificationType.INTEGRATION && (
                <span>: { Messages.components.integrations.integrationType[props.action.integration.type] }</span>
            ) }
        </ActionComponentWrapper>
    );
};
