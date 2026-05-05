import React from 'react';

import {
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import {
  Dropdown,
  DropdownGroup,
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

import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/dynamic/icons/ellipsis-v-icon';

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
  isDisabled,
  onUpdateSelectedStatus,
  onNavigateTo,
  isOrgAdmin,
  hasNotificationsPermissions,
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
        isDisabled={isDisabled}
        onUpdateSelectedStatus={onUpdateSelectedStatus}
        onNavigateTo={onNavigateTo}
        isOrgAdmin={isOrgAdmin}
        hasNotificationsPermissions={hasNotificationsPermissions}
      />
    </Dropdown>
  );
};

const ActionDropdownItems = ({
  isDisabled,
  onUpdateSelectedStatus,
  onNavigateTo,
  isOrgAdmin,
  hasNotificationsPermissions,
}) => {
  return (
    <>
      <DropdownGroup label="Actions">
        <DropdownList>
          <DropdownItem
            key="read selected"
            onClick={() => onUpdateSelectedStatus(true)}
            isDisabled={isDisabled}
          >
            Mark selected as read
          </DropdownItem>
          <DropdownItem
            key="unread selected"
            onClick={() => onUpdateSelectedStatus(false)}
            isDisabled={isDisabled}
          >
            Mark selected as unread
          </DropdownItem>
        </DropdownList>
      </DropdownGroup>
      <Divider />
      <DropdownGroup label="Quick links">
        <DropdownList>
          <DropdownItem
            key="notifications log"
            onClick={() => onNavigateTo('/settings/notifications/notificationslog')}
          >
            View notifications log
          </DropdownItem>
          {(isOrgAdmin || hasNotificationsPermissions) && (
            <DropdownItem
              key="notification settings"
              onClick={() => onNavigateTo('/settings/notifications/configure-events')}
            >
              Configure notification settings
            </DropdownItem>
          )}
          <DropdownItem
            key="notification preferences"
            onClick={() => onNavigateTo('/settings/notifications/user-preferences')}
          >
            Manage my notification preferences
          </DropdownItem>
        </DropdownList>
      </DropdownGroup>
    </>
  );
};
