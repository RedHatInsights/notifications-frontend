import {
  IExtraColumnData,
  SortByDirection,
  Table as TableComposable,
  TableVariant,
  Tbody,
  Th,
  ThProps,
  Thead,
  Tr,
} from '@patternfly/react-table/dist/dynamic/components/Table';
import * as React from 'react';

import { BehaviorGroupContent } from '../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroupNotificationRow } from '../../pages/Notifications/List/useBehaviorGroupNotificationRows';
import {
  SortDirection,
  sortDirectionFromString,
} from '../../types/SortDirection';
import { ouia } from '../Ouia';
import EmptyTableState from './EmptyTableState';
import {
  Callbacks,
  NotificationsBehaviorGroupRow,
  OnBehaviorGroupLinkUpdated,
  OnNotificationIdHandler,
} from './NotificationsBehaviorGroupRow';

// The value has to be the order on which the columns appear on the table
export enum NotificationsTableColumns {
  EVENT,
  APPLICATION,
  BEHAVIOR,
}

export interface NotificationsBehaviorGroupTableProps {
  behaviorGroupContent: BehaviorGroupContent;
  notifications: Array<BehaviorGroupNotificationRow>;
  onBehaviorGroupLinkUpdated: OnBehaviorGroupLinkUpdated;
  onStartEditing?: OnNotificationIdHandler;
  onFinishEditing?: OnNotificationIdHandler;
  onCancelEditing?: OnNotificationIdHandler;
  sortBy: NotificationsTableColumns;
  sortDirection: SortDirection;

  onSort: (column: NotificationsTableColumns, direction: SortDirection) => void;
}

export const NotificationsBehaviorGroupTable =
  ouia<NotificationsBehaviorGroupTableProps>((props) => {
    const callbacks: Callbacks | undefined = React.useMemo(() => {
      if (
        props.onStartEditing &&
        props.onFinishEditing &&
        props.onCancelEditing
      ) {
        return {
          onStartEditing: props.onStartEditing,
          onFinishEditing: props.onFinishEditing,
          onCancelEditing: props.onCancelEditing,
          onBehaviorGroupLinkUpdated: props.onBehaviorGroupLinkUpdated,
        };
      }

      return undefined;
    }, [
      props.onStartEditing,
      props.onFinishEditing,
      props.onCancelEditing,
      props.onBehaviorGroupLinkUpdated,
    ]);

    const onSort = React.useCallback(
      (
        _event: React.MouseEvent,
        columnIndex: number,
        sortByDirection: SortByDirection,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _extraData: IExtraColumnData
      ) => {
        const externalOnSort = props.onSort;
        externalOnSort(columnIndex, sortDirectionFromString(sortByDirection));
      },
      [props.onSort]
    );

    const sortOptions: Record<
      NotificationsTableColumns,
      undefined | ThProps['sort']
    > = React.useMemo(() => {
      const sortBy = {
        direction: props.sortDirection,
        index: props.sortBy,
      };

      return {
        [NotificationsTableColumns.EVENT]: {
          sortBy,
          columnIndex: NotificationsTableColumns.EVENT,
          onSort,
        },
        [NotificationsTableColumns.APPLICATION]: {
          sortBy,
          columnIndex: NotificationsTableColumns.APPLICATION,
          onSort,
        },
        [NotificationsTableColumns.BEHAVIOR]: undefined,
      };
    }, [props.sortDirection, props.sortBy, onSort]);

    const rows = React.useMemo(() => {
      const notifications = props.notifications;
      const behaviorGroupContent = props.behaviorGroupContent;
      return notifications.map((notification, rowIndex) => (
        <NotificationsBehaviorGroupRow
          key={notification.id}
          rowIndex={rowIndex}
          notification={notification}
          behaviorGroupContent={behaviorGroupContent}
          onSelect={callbacks?.onBehaviorGroupLinkUpdated}
          isEditMode={notification.isEditMode}
          callbacks={callbacks}
        />
      ));
    }, [props.notifications, props.behaviorGroupContent, callbacks]);

    return (
      <TableComposable
        aria-label="Notifications"
        isStickyHeader={true}
        variant={TableVariant.compact}
        id="configure-events-table"
      >
        <Thead>
          <Tr>
            <Th />
            <Th sort={sortOptions[NotificationsTableColumns.EVENT]}>
              Event Type
            </Th>
            <Th sort={sortOptions[NotificationsTableColumns.APPLICATION]}>
              Service
            </Th>
            <Th
              sort={sortOptions[NotificationsTableColumns.BEHAVIOR]}
              width={35}
            >
              Configuration
            </Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {props.notifications.length === 0 ? <EmptyTableState /> : rows}
        </Tbody>
      </TableComposable>
    );
  }, 'Notifications/Table');
