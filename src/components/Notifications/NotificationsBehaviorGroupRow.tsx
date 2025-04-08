import {
  Button,
  ButtonVariant,
  Icon,
  Skeleton,
  Text,
} from '@patternfly/react-core';
import { CheckIcon, CloseIcon, PencilAltIcon } from '@patternfly/react-icons';
import {
  CustomActionsToggleProps,
  IActions,
  Td,
  Tr,
} from '@patternfly/react-table/dist/dynamic/components/Table';
import {
  global_active_color_100,
  global_disabled_color_100,
  global_palette_black_600,
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
import {
  DropdownDirection,
  DropdownPosition,
} from '@patternfly/react-core/dist/dynamic/deprecated/components/Dropdown';

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

export interface TdActionsType {
  /** The row index */
  rowIndex?: number;
  /** Cell actions */
  items: IActions;
  /** Whether the actions are disabled */
  isDisabled?: boolean;
  /** Actions dropdown position */
  dropdownPosition?: DropdownPosition;
  /** Actions dropdown direction */
  dropdownDirection?: DropdownDirection;
  /** The container to append the dropdown menu to. Defaults to 'inline'.
   * If your menu is being cut off you can append it to an element higher up the DOM tree.
   * Some examples:
   * menuAppendTo="parent"
   * menuAppendTo={() => document.body}
   * menuAppendTo={document.getElementById('target')}
   */
  menuAppendTo?: HTMLElement | (() => HTMLElement) | 'inline' | 'parent';
  /** Custom toggle for the actions menu */
  actionsToggle?: (props: CustomActionsToggleProps) => React.ReactNode;
}

const HiddenActionsToggle = () => <React.Fragment />;

const getActions = (
  notification: BehaviorGroupNotificationRow,
  callbacks?: Callbacks
): TdActionsType => {
  const isDisabled = notification.loadingActionStatus !== 'done';

  if (!notification.isEditMode) {
    return {
      actionsToggle: HiddenActionsToggle,
      items: [
        {
          key: 'edit',
          title: (
            <Button
              aria-label="edit"
              variant={ButtonVariant.plain}
              isDisabled={isDisabled}
            >
              <PencilAltIcon />
            </Button>
          ),
          isOutsideDropdown: true,
          onClick: () => callbacks?.onStartEditing(notification.id),
          isDisabled: isDisabled || !callbacks,
        },
      ],
    };
  }

  return {
    actionsToggle: HiddenActionsToggle,
    items: [
      {
        key: 'done',
        title: (
          <Button
            aria-label="done"
            variant={ButtonVariant.plain}
            isDisabled={isDisabled}
          >
            <Icon
              color={
                isDisabled
                  ? global_disabled_color_100.value
                  : global_active_color_100.value
              }
            >
              <CheckIcon />
            </Icon>
          </Button>
        ),
        isOutsideDropdown: true,
        onClick: () => callbacks?.onFinishEditing(notification.id),
        isDisabled: isDisabled || !callbacks,
      },
      {
        key: 'cancel',
        title: (
          <Button
            aria-label="cancel"
            variant={ButtonVariant.plain}
            isDisabled={isDisabled}
          >
            <CloseIcon
              color={
                isDisabled
                  ? global_disabled_color_100.value
                  : global_palette_black_600.value
              }
            />
          </Button>
        ),
        isOutsideDropdown: true,
        onClick: () => callbacks?.onCancelEditing(notification.id),
        isDisabled: isDisabled || !callbacks,
      },
    ],
  };
};

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
        <Td actions={getActions(notification, callbacks)} />
      </Tr>
      {notification.description && isExpanded && (
        <Tr>
          <Td />
          <Td colSpan={4}>
            <Text className="pf-v5-u-color-200 pf-v5-u-p-0">
              {notification.description}
            </Text>
          </Td>
        </Tr>
      )}
    </>
  );
};
