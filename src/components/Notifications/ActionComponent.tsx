import * as React from 'react';
import { BellIcon, EnvelopeIcon, SlackHashIcon } from '@patternfly/react-icons';
import { assertNever, OuiaComponentProps, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { Action, ActionType } from '../../types/Notification';
import { Messages } from '../../properties/Messages';
import { style } from 'typestyle';
import { getOuiaProps } from '../../utils/getOuiaProps';

export interface ActionComponentText extends OuiaComponentProps{
    action: Action;
}

interface ActionTypeToIconProps {
    actionType: ActionType;
}

const marginLeftClassName = style({
    marginLeft: Spacer.SM
});

const ActionTypeToIcon: React.FunctionComponent<ActionTypeToIconProps> = (props) => {
    switch (props.actionType) {
        case ActionType.DRAWER:
        case ActionType.PLATFORM_ALERT:
            return <BellIcon/>;
        case ActionType.EMAIL:
            return <EnvelopeIcon/>;
        case ActionType.INTEGRATION:
            return <SlackHashIcon/>;
        default:
            assertNever(props.actionType);
    }
};

export const ActionComponent: React.FunctionComponent<ActionComponentText> = (props) => {
    return (
        <div { ...getOuiaProps('ActionComponent', props) }>
            <ActionTypeToIcon actionType={ props.action.type }/>
            <span className={ marginLeftClassName }>{ Messages.components.notifications.types[props.action.type] }</span>
        </div>
    );
};
