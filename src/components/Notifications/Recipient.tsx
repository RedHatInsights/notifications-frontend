import { Tooltip } from '@patternfly/react-core';
import { BanIcon } from '@patternfly/react-icons';
import { global_disabled_color_100, global_spacer_sm } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { Action, NotificationType } from '../../types/Notification';

interface RecipientProps {
    action: Action;
    hasOutline?: boolean;
}

const disabledLabelClassName = style({
    marginLeft: global_spacer_sm.var,
    color: global_disabled_color_100.value

});

export const Recipient: React.FunctionComponent<RecipientProps> = (props) => {
    if (props.action.type === NotificationType.INTEGRATION) {
        return (
            <>
                <span>{ props.action.integration.name }</span>
                { !props.action.integration.isEnabled && (
                    <>
                        <Tooltip content="This integration has been disabled. This action wil not fire until it is enabled." position="bottom">
                            <BanIcon className={ disabledLabelClassName } />
                        </Tooltip>
                    </>
                )}
            </>
        );
    }

    return <span>{ props.action.recipient.map(r => r.displayName).join(', ') }</span>;
};
