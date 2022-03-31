import { Skeleton, Tooltip } from '@patternfly/react-core';
import { BanIcon } from '@patternfly/react-icons';
import { global_disabled_color_100, global_spacer_sm } from '@patternfly/react-tokens';
import { join } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { Action, NotificationType } from '../../types/Notification';
import { NotificationRbacGroupRecipient, NotificationUserRecipient } from '../../types/Recipient';
import { GroupNotFound } from './Rbac/GroupNotFound';

interface RecipientProps {
    action: Action;
    hasOutline?: boolean;
}

const disabledLabelClassName = style({
    marginLeft: global_spacer_sm.var,
    color: global_disabled_color_100.value

});

const CommaSeparator = () => <span>, </span>;

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

    const users = props.action.recipient
    .filter(a => a instanceof NotificationUserRecipient) as unknown as ReadonlyArray<NotificationUserRecipient>;

    const groups = props.action.recipient
    .filter(a => a instanceof NotificationRbacGroupRecipient) as unknown as ReadonlyArray<NotificationRbacGroupRecipient>;

    return (
        <span>
            <div>
                Users: { join(users.map(u => u.displayName), CommaSeparator) }
            </div>
            <div>
                User Access Groups: { join(groups.map(g => {
                    if (g.hasError) {
                        return <GroupNotFound />;
                    }

                    if (g.isLoading) {
                        return <Skeleton width="40px" />;
                    }

                    return g.displayName;
                }), CommaSeparator)}
            </div>
        </span>
    );
};
