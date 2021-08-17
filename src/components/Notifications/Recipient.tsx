import { Label, Tooltip } from '@patternfly/react-core';
import { global_spacer_sm } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { Action, NotificationType } from '../../types/Notification';

interface RecipientProps {
    action: Action;
    hasOutline?: boolean;
}

const disabledLabelClassName = style({
    marginLeft: global_spacer_sm.var
});

export const Recipient: React.FunctionComponent<RecipientProps> = (props) => {
    if (props.action.type === NotificationType.INTEGRATION) {
        return (
            <>
                <span>{ props.action.integration.name }</span>
                { !props.action.integration.isEnabled && (
                    <>
                        <Tooltip content="This integration has been disabled. This action wil not fire until it is enabled." position="bottom">
                            <Label variant={ props.hasOutline ? 'outline' : 'filled' } className={ disabledLabelClassName }>Disabled</Label>
                        </Tooltip>
                    </>
                )}
            </>
        );
    }

    return <span>{ props.action.recipient.map(r => r.displayName).join(', ') }</span>;
};
