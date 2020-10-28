import * as React from 'react';
import { Action, NotificationType } from '../../types/Notification';
import { Label, Tooltip } from '@patternfly/react-core';
import { style } from 'typestyle';
import { global_spacer_sm } from '@patternfly/react-tokens';

interface RecipientProps {
    action: Action;
    hasOutline?: boolean;
}

const disabledLabelClassName = style({
    marginRight: global_spacer_sm.var
});

export const Recipient: React.FunctionComponent<RecipientProps> = (props) => {
    if (props.action.type === NotificationType.INTEGRATION) {
        return (
            <>
                { !props.action.integration.isEnabled && (
                    <>
                        <Tooltip content="This integration has been disabled. This action wil not fire until it is enabled." position="bottom">
                            <Label variant={ props.hasOutline ? 'outline' : 'filled' } className={ disabledLabelClassName }>Disabled</Label>
                        </Tooltip>
                    </>
                )}
                <span>{ props.action.integration.name }</span>
            </>
        );
    }

    if (props.action.recipient.length === 0) {
        return <span>Default user access</span>;
    }

    return <span>{ props.action.recipient.join(', ') }</span>;
};
