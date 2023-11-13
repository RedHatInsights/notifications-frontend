import { Skeleton, Tooltip } from '@patternfly/react-core';
import { BanIcon, LockIcon } from '@patternfly/react-icons';
import {
  global_disabled_color_100,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import { join } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { Action, NotificationType } from '../../types/Notification';
import {
  NotificationRbacGroupRecipient,
  NotificationUserRecipient,
} from '../../types/Recipient';
import { GroupNotFound } from './Rbac/GroupNotFound';

interface RecipientProps {
  action: Action;
  hasOutline?: boolean;
}

const disabledLabelClassName = style({
  marginLeft: global_spacer_sm.var,
  color: global_disabled_color_100.value,
});

const greyColorName = style({
  color: global_disabled_color_100.value,
});

const CommaSeparator = () => <span>, </span>;

export const Recipient: React.FunctionComponent<RecipientProps> = (props) => {
  if (props.action.type === NotificationType.INTEGRATION) {
    return (
      <>
        {!props.action.integration.isEnabled ? (
          <span className={greyColorName}>
            {' '}
            {props.action.integration.name}
            <Tooltip
              content="This integration has been disabled. This action wil not fire until it is enabled."
              position="bottom"
            >
              <BanIcon className={disabledLabelClassName} />
            </Tooltip>
          </span>
        ) : (
          props.action.integration.name
        )}
      </>
    );
  }

  const users = props.action.recipient.filter(
    (a) => a instanceof NotificationUserRecipient
  ) as unknown as ReadonlyArray<NotificationUserRecipient>;

  const groups = props.action.recipient.filter(
    (a) => a instanceof NotificationRbacGroupRecipient
  ) as unknown as ReadonlyArray<NotificationRbacGroupRecipient>;

  return (
    <span>
      {users.length > 0 && (
        <div>
          Users:{' '}
          {join(
            users.map((u) => (
              <>
                {u.displayName}
                {u.ignorePreferences && (
                  <span>
                    <Tooltip
                      content="You may still receive forced notifications for this service"
                      position="bottom"
                    >
                      <LockIcon className={disabledLabelClassName} />
                    </Tooltip>
                  </span>
                )}{' '}
              </>
            )),
            CommaSeparator
          )}
        </div>
      )}
      {groups.length > 0 && (
        <div>
          User Access Groups:{' '}
          {join(
            groups.map((g) => {
              if (g.hasError) {
                return <GroupNotFound key={g.groupId} />;
              }

              if (g.isLoading) {
                return <Skeleton width="40px" key={g.groupId} />;
              }

              return g.displayName;
            }),
            CommaSeparator
          )}
        </div>
      )}
    </span>
  );
};
