import {
  Divider,
  Icon,
  MenuToggle,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Pagination } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import React, { Dispatch, SetStateAction } from 'react';

import { EventPeriod } from '../../../types/Event';
import {
  NotificationsLogDateFilter,
  NotificationsLogDateFilterValue,
} from './NotificationsLogDateFilter';

const NotificationsLogToolbar: React.FC<{
  retentionDays: number;
  period: EventPeriod;
  setPeriod: Dispatch<SetStateAction<EventPeriod>>;
  onPagination: (pagination: { limit: number; offset: number }) => void;
  pagination: { limit: number; offset: number; count: number };
  dateFilter: NotificationsLogDateFilterValue;
  setDateFilter: (value: NotificationsLogDateFilterValue) => void;
}> = ({ onPagination, pagination, ...props }) => {
  return (
    <React.Fragment>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <MenuToggle
              icon={
                <Icon>
                  <FilterIcon />
                </Icon>
              }
            >
              Event
            </MenuToggle>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Divider />
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <NotificationsLogDateFilter
              value={props.dateFilter}
              setValue={props.setDateFilter}
              retentionDays={props.retentionDays}
              setPeriod={props.setPeriod}
              period={props.period}
            />
          </ToolbarItem>
          <ToolbarItem className="pf-v5-u-ml-auto">
            <Pagination
              itemCount={pagination.count}
              perPage={pagination.limit}
              page={pagination.offset / pagination.limit + 1}
              onSetPage={(_ev, newPage, perPage) => {
                onPagination({
                  limit: perPage ?? pagination.limit,
                  offset: (newPage - 1) * (perPage ?? pagination.limit),
                });
              }}
              widgetId="pagination-id"
              onPerPageSelect={(_ev, perPage) => {
                onPagination({
                  limit: perPage ?? pagination.limit,
                  offset: 0,
                });
              }}
              isCompact
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    </React.Fragment>
  );
};

export default NotificationsLogToolbar;
