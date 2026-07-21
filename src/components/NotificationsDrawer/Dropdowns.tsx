import React from 'react';
import { useIntl } from 'react-intl';

import {
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
} from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { Menu } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuList } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuItem } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuGroup } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuFooter } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { PopoverPosition } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';

import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/dynamic/icons/ellipsis-v-icon';
import messages from '../../properties/DefinedMessages';

export const FilterDropdown = ({
  isFilterDropdownOpen,
  setIsFilterDropdownOpen,
  filterConfig,
  isDisabled,
  activeFilters,
  setActiveFilters,
  onFilterSelect,
}) => {
  return (
    <Dropdown
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          id="notifications-filter-toggle"
          variant="plain"
          aria-label="Notifications filter"
        >
          <FilterIcon />
        </MenuToggle>
      )}
      isOpen={isFilterDropdownOpen}
      onOpenChange={setIsFilterDropdownOpen}
      popperProps={{
        position: PopoverPosition.right,
      }}
      id="notifications-filter-dropdown"
    >
      <Menu onSelect={(_event, itemId) => onFilterSelect(itemId as string)}>
        <MenuList>
          <MenuGroup key="filter-label" label="Show notifications for...">
            {filterConfig.map((source: { value: string; title: string }) => (
              <MenuItem
                key={source.value}
                itemId={source.value}
                hasCheckbox
                isSelected={activeFilters.includes(source.value)}
                isDisabled={isDisabled}
              >
                {source.title}
              </MenuItem>
            ))}
          </MenuGroup>
        </MenuList>
        <Divider />
        <MenuFooter>
          <Button
            variant="link"
            isInline
            isDisabled={activeFilters.length === 0}
            onClick={() => setActiveFilters([])}
          >
            Reset filters
          </Button>
        </MenuFooter>
      </Menu>
    </Dropdown>
  );
};

export const ActionDropdown = ({
  isDropdownOpen,
  setIsDropdownOpen,
  selectedCount,
  onUpdateSelectedStatus,
  onNavigateTo,
  isOrgAdmin,
}) => {
  return (
    <Dropdown
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          variant="plain"
          id="notifications-actions-toggle"
          aria-label="Notifications actions dropdown"
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      isOpen={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
      popperProps={{
        position: PopoverPosition.right,
      }}
      id="notifications-actions-dropdown"
    >
      <ActionDropdownItems
        selectedCount={selectedCount}
        onUpdateSelectedStatus={onUpdateSelectedStatus}
        onNavigateTo={onNavigateTo}
        isOrgAdmin={isOrgAdmin}
      />
    </Dropdown>
  );
};

const ActionDropdownItems = ({
  selectedCount,
  onUpdateSelectedStatus,
  onNavigateTo,
  isOrgAdmin,
}) => {
  const intl = useIntl();
  const isBulkActionDisabled = selectedCount === 0;

  return (
    <>
      <DropdownList>
        <DropdownItem
          key="read selected"
          onClick={() => onUpdateSelectedStatus(true)}
          isDisabled={isBulkActionDisabled}
          data-selected-count={selectedCount}
        >
          {intl.formatMessage(messages.markSelectedAsRead, { count: selectedCount })}
        </DropdownItem>
        <DropdownItem
          key="unread selected"
          onClick={() => onUpdateSelectedStatus(false)}
          isDisabled={isBulkActionDisabled}
          data-selected-count={selectedCount}
        >
          {intl.formatMessage(messages.markSelectedAsUnread, { count: selectedCount })}
        </DropdownItem>
      </DropdownList>
      <Divider />
      <DropdownList>
        <DropdownItem
          key="event log"
          onClick={() => onNavigateTo('/settings/notifications/eventlog')}
        >
          {intl.formatMessage(messages.viewEventLog)}
        </DropdownItem>
        <DropdownItem
          key="event notifications"
          onClick={() => onNavigateTo('/settings/notifications/user-preferences')}
        >
          {intl.formatMessage(messages.manageMyEventNotifications)}
        </DropdownItem>
        {!isOrgAdmin ? (
          <Tooltip content={intl.formatMessage(messages.adminAccessRequired)}>
            <span>
              <DropdownItem
                key="event configuration"
                onClick={() => onNavigateTo('/settings/notifications/configure-events')}
                isDisabled={true}
              >
                {intl.formatMessage(messages.manageEventConfiguration)}
              </DropdownItem>
            </span>
          </Tooltip>
        ) : (
          <DropdownItem
            key="event configuration"
            onClick={() => onNavigateTo('/settings/notifications/configure-events')}
          >
            {intl.formatMessage(messages.manageEventConfiguration)}
          </DropdownItem>
        )}
      </DropdownList>
    </>
  );
};
