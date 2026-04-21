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
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { PopoverPosition } from '@patternfly/react-core/dist/dynamic/components/Popover';

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
      <FilterDropdownItems
        filterConfig={filterConfig}
        isDisabled={isDisabled}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        onFilterSelect={onFilterSelect}
      />
    </Dropdown>
  );
};

const FilterDropdownItems = ({
  filterConfig,
  isDisabled,
  activeFilters,
  setActiveFilters,
  onFilterSelect,
}) => {
  return [
    <DropdownGroup key="filter-label" label="Show notifications for...">
      <DropdownList>
        {filterConfig.map((source) => (
          <DropdownItem
            key={source.value}
            onClick={() => onFilterSelect(source.value)}
            isDisabled={isDisabled}
            isSelected={activeFilters.includes(source.value)}
            hasCheckbox
          >
            {source.title}
          </DropdownItem>
        ))}
        <Divider />
        <DropdownItem
          key="reset-filters"
          isDisabled={activeFilters.length === 0}
          onClick={() => setActiveFilters([])}
        >
          Reset filters
        </DropdownItem>
      </DropdownList>
    </DropdownGroup>,
  ];
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
