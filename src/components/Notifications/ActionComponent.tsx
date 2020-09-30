import * as React from 'react';
import { BellIcon, EnvelopeIcon, SlackHashIcon } from '@patternfly/react-icons';
import { assertNever, OuiaComponentProps, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { Action, NotificationType } from '../../types/Notification';
import { Messages } from '../../properties/Messages';
import { style } from 'typestyle';
import { getOuiaProps } from '../../utils/getOuiaProps';

export interface ActionComponentText extends OuiaComponentProps{
    action: Action;
}

interface ActionTypeToIconProps {
    actionType: NotificationType;
}

const marginLeftClassName = style({
    marginLeft: Spacer.SM
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

export const ActionComponent: React.FunctionComponent<ActionComponentText> = (props) => {
    return (
        <div { ...getOuiaProps('Notifications/ActionComponent', props) }>
            <ActionTypeToIcon actionType={ props.action.type }/>
            <span className={ marginLeftClassName }>{ Messages.components.notifications.types[props.action.type] }</span>
        </div>
    );
};
