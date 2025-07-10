import {
  Button,
  ButtonVariant,
  Content,
  Icon,
  Skeleton,
} from '@patternfly/react-core';
import { CheckIcon, CloseIcon, PencilAltIcon } from '@patternfly/react-icons';
import { Td, Tr } from '@patternfly/react-table/dist/dynamic/components/Table';
import {
  t_temp_dev_tbd as global_active_color_100,
  t_temp_dev_tbd as global_disabled_color_100,
  t_temp_dev_tbd as global_palette_black_600,
} from '@patternfly/react-tokens';
import * as React from 'react';

import { BehaviorGroupContent } from '../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroupNotificationRow } from '../../pages/Notifications/List/useBehaviorGroupNotificationRows';
import {
  BehaviorGroup,
  NotificationBehaviorGroup,
  UUID,
} from '../../types/Notification';
import { emptyImmutableArray } from '../../utils/Immutable';
import { BehaviorGroupCell } from './Table/BehaviorGroupCell';

// These types remain the same
export type OnNotificationIdHandler = (notificationId: UUID) => void;

export type Callbacks = {
  onStartEditing: OnNotificationIdHandler;
  onFinishEditing: OnNotificationIdHandler;
  onCancelEditing: OnNotificationIdHandler;
  onBehaviorGroupLinkUpdated: OnBehaviorGroupLinkUpdated;
};

export type OnBehaviorGroupLinkUpdated = (
  notification: NotificationBehaviorGroup,
  behaviorGroup: BehaviorGroup,
  isLinked: boolean
) => void;

export interface NotificationsBehaviorGroupRowProps {
  rowIndex: number;
  notification: BehaviorGroupNotificationRow;
  behaviorGroupContent: BehaviorGroupContent;
  onSelect?: OnBehaviorGroupLinkUpdated;
  isEditMode: boolean;
  callbacks?: Callbacks;
}

export const NotificationsBehaviorGroupRow: React.FunctionComponent<
  NotificationsBehaviorGroupRowProps
> = ({
  rowIndex,
  notification,
  behaviorGroupContent,
  onSelect,
  isEditMode,
  callbacks,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isDisabled = notification.loadingActionStatus !== 'done';

  return (
    <>
      <Tr key={notification.id}>
        {notification.description ? (
          <Td
            expand={{
              rowIndex: rowIndex,
              isExpanded: isExpanded,
              onToggle: () => setIsExpanded(!isExpanded),
              expandId: `expandable-toggle-${notification.id}`,
            }}
          />
        ) : (
          <Td />
        )}
        <Td>{notification.eventTypeDisplayName}</Td>
        <Td>{notification.applicationDisplayName}</Td>
        <Td>
          {notification.loadingActionStatus === 'loading' ? (
            <Skeleton width="90%" />
          ) : (
            <BehaviorGroupCell
              id={`behavior-group-cell-${notification.id}`}
              notification={notification}
              behaviorGroupContent={behaviorGroupContent}
              selected={notification.behaviors ?? emptyImmutableArray}
              onSelect={onSelect}
              isEditMode={isEditMode}
            />
          )}
        </Td>
        <Td isActionCell>
          {isEditMode ? (
            <>
              <Button
                icon={
                  <Icon
                    color={
                      isDisabled
                        ? global_disabled_color_100.value
                        : global_active_color_100.value
                    }
                  >
                    <CheckIcon />
                  </Icon>
                }
                aria-label="done"
                variant={ButtonVariant.plain}
                isDisabled={isDisabled}
                onClick={() => callbacks?.onFinishEditing(notification.id)}
              />
              <Button
                icon={
                  <CloseIcon
                    color={
                      isDisabled
                        ? global_disabled_color_100.value
                        : global_palette_black_600.value
                    }
                  />
                }
                aria-label="cancel"
                variant={ButtonVariant.plain}
                isDisabled={isDisabled}
                onClick={() => callbacks?.onCancelEditing(notification.id)}
              />
            </>
          ) : (
            <Button
              icon={<PencilAltIcon />}
              aria-label="edit"
              variant={ButtonVariant.plain}
              isDisabled={isDisabled}
              onClick={() => callbacks?.onStartEditing(notification.id)}
            />
          )}
        </Td>
      </Tr>
      {notification.description && isExpanded && (
        <Tr>
          <Td />
          <Td colSpan={4}>
            <Content component="p" className="pf-v6-u-color-200 pf-v6-u-p-0">
              {notification.description}
            </Content>
          </Td>
        </Tr>
      )}
    </>
  );
};
