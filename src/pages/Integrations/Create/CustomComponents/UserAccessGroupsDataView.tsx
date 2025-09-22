import React, { useRef } from 'react';
import {
  DataView,
  DataViewTextFilter,
  DataViewToolbar,
  useDataViewPagination,
  useDataViewSelection,
} from '@patternfly/react-data-view';
import { DataViewTable } from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import {
  Button,
  Checkbox,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  EmptyState,
  EmptyStateBody,
  Label,
  LabelGroup,
  List,
  ListItem,
  Pagination,
  Popover,
  Spinner,
  Title,
} from '@patternfly/react-core';
import {
  SkeletonTableBody,
  SkeletonTableHead,
} from '@patternfly/react-component-groups';
import { useFieldApi } from '@data-driven-forms/react-form-renderer';
import { useClient } from 'react-fetching-library';
import { perPageOptions } from '../../../../config/Config';
import { useRbacGroups } from '../../../../app/rbac/RbacGroupContext';
import { NotificationRbacGroupRecipient } from '../../../../types/Recipient';
import { OutlinedQuestionCircleIcon, UsersIcon } from '@patternfly/react-icons';
import { Operations } from '../../../../generated/OpenapiRbac';

const columns = [
  { label: '', key: 'select' }, // Checkbox column
  { label: 'Name', key: 'name' },
  { label: 'Users', key: 'users' },
];

interface UserAccessGroupsDataViewProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

const UserAccessGroupsDataView: React.FC<UserAccessGroupsDataViewProps> = ({
  name,
  label,
  isRequired = true,
}) => {
  const { input, meta } = useFieldApi({ name });
  const { groups, isLoading } = useRbacGroups();
  const { query } = useClient();
  const [isPopoverVisible, setPopoverVisible] = React.useState(false);
  const popoverRootRef = useRef<HTMLSpanElement>(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState<
    (typeof userAccessGroups)[0] | null
  >(null);
  const [groupUsers, setGroupUsers] = React.useState<
    Array<{ username: string }>
  >([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);

  // Function to fetch and open drawer with user list
  const handleViewUsers = React.useCallback(
    async (group: (typeof userAccessGroups)[0]) => {
      setSelectedGroup(group);
      setIsDrawerOpen(true);
      setIsLoadingUsers(true);
      setGroupUsers([]);

      try {
        const response = await query(
          Operations.GetPrincipalsFromGroup.actionCreator({ uuid: group.id })
        );

        if (response.payload?.type === 'PrincipalPagination') {
          const principals = response.payload.value.data;
          setGroupUsers(
            principals.map((principal) => ({ username: principal.username }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch group users:', error);
        // Handle error - could set an error state here if needed
      } finally {
        setIsLoadingUsers(false);
      }
    },
    [query]
  );

  const handleCloseDrawer = React.useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedGroup(null);
    setGroupUsers([]);
  }, []);

  // Convert RBAC groups to enhanced format with user count and sort by priority
  const userAccessGroups = React.useMemo(() => {
    const enhancedGroups = groups.map((group) => ({
      id: group.id,
      name: group.name,
      userCount: group.principalCount ?? 0,
      admin_default: group.admin_default,
      platform_default: group.platform_default,
      system: group.system,
      // Create NotificationRbacGroupRecipient for compatibility
      recipient: new NotificationRbacGroupRecipient(
        undefined,
        group.id,
        group.name
      ),
    }));

    // Sort groups: admin_default first, then platform_default, then regular groups
    return enhancedGroups.sort((a, b) => {
      // Admin default groups go first
      if (a.admin_default && !b.admin_default) return -1;
      if (!a.admin_default && b.admin_default) return 1;

      // Platform default groups go second
      if (a.platform_default && !b.platform_default) return -1;
      if (!a.platform_default && b.platform_default) return 1;

      // System groups go third
      if (a.system && !b.system) return -1;
      if (!a.system && b.system) return 1;

      // Then sort by name alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [groups]);

  const [searchTerm, setSearchTerm] = React.useState('');

  const pagination = useDataViewPagination({ perPage: 10 });
  const { page, perPage } = pagination;

  const selection = useDataViewSelection({
    matchOption: (a, b) => a.id === b.id,
  });

  const { selected, isSelected, onSelect } = selection;

  // Handle selection changes and trigger validation
  React.useEffect(() => {
    const selectedIds = selected.map((group) => group.id);
    input.onChange(selectedIds);

    // Trigger field validation by calling onBlur
    if (input.onBlur) {
      input.onBlur();
    }
  }, [selected, input]);

  // Initialize selected items from form value
  React.useEffect(() => {
    if (
      input.value &&
      Array.isArray(input.value) &&
      userAccessGroups.length > 0 &&
      selected.length === 0
    ) {
      const selectedGroups = userAccessGroups.filter((group) =>
        input.value.includes(group.id)
      );
      if (selectedGroups.length > 0) {
        onSelect(true, selectedGroups);
      }
    }
  }, [input.value, userAccessGroups, selected.length, onSelect]);

  // Filter data by search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return userAccessGroups;
    }

    return userAccessGroups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userAccessGroups, searchTerm]);

  // Paginate filtered data
  const paginatedData = React.useMemo(() => {
    const startIdx = (page - 1) * perPage;
    return filteredData.slice(startIdx, startIdx + perPage);
  }, [filteredData, page, perPage]);

  const rows = React.useMemo(() => {
    return paginatedData.map((group) => {
      // Add visual indicator for default groups
      const getGroupDisplayName = (group) => {
        if (group.admin_default) {
          return `${group.name}`;
        }
        if (group.platform_default) {
          return `${group.name}`;
        }
        return group.name;
      };

      // Determine if this is a default group that should have a popover
      const isDefaultGroup = group.admin_default || group.platform_default;

      return {
        row: [
          // First column: Checkbox for all groups
          <Checkbox
            key={`checkbox-${group.id}`}
            id={`group-${group.id}`}
            isChecked={isSelected(group)}
            onChange={(event, checked) => {
              onSelect(checked, group);
            }}
            aria-label={`Select ${getGroupDisplayName(group)}`}
          />,
          // Second column: Group name with popover for default groups
          <div
            key={`name-${group.id}`}
            className="pf-v6-u-display-flex pf-v6-u-align-items-center"
          >
            <span
              className={
                isDefaultGroup ? 'pf-v6-u-font-weight-bold pf-v6-u-mr-sm' : ''
              }
            >
              {getGroupDisplayName(group)}
            </span>
            {isDefaultGroup && (
              <Popover
                position="right"
                isVisible={isPopoverVisible}
                shouldClose={() => setPopoverVisible(false)}
                bodyContent={
                  group.admin_default
                    ? 'This is a system default group for admin access. All organization administrators are automatically included in this group.'
                    : 'This is a custom default access group created by your organization. Members are managed separately.'
                }
                aria-label="user-group-popover"
                hideOnOutsideClick
                appendTo={popoverRootRef.current || undefined}
              >
                <OutlinedQuestionCircleIcon
                  onClick={() => setPopoverVisible(!isPopoverVisible)}
                />
              </Popover>
            )}
          </div>,
          // Third column: User count with icon or special text for default groups
          group.admin_default ? (
            'All org admins'
          ) : group.platform_default ? (
            'All'
          ) : (
            <Button
              variant="link"
              isInline
              className="pf-v6-u-display-flex pf-v6-u-align-items-center"
              onClick={() => handleViewUsers(group)}
              icon={<UsersIcon />}
            >
              View ({group.userCount}) user{group.userCount !== 1 ? 's' : ''}
            </Button>
          ),
        ],
        props: {
          key: group.id,
        },
      };
    });
  }, [paginatedData, isSelected, isPopoverVisible, onSelect, handleViewUsers]);

  const emptyState = (
    <EmptyState>
      <Title headingLevel="h4">
        {searchTerm.trim()
          ? 'No matching User Access Groups'
          : 'No User Access Groups'}
      </Title>
      <EmptyStateBody>
        {searchTerm.trim()
          ? 'No User Access Groups match the current search criteria. Try adjusting your search term.'
          : 'No User Access Groups are available. Contact your administrator to set up access groups.'}
      </EmptyStateBody>
    </EmptyState>
  );

  const loadingStateHeader = (
    <SkeletonTableHead columns={columns.map((c) => c.label)} />
  );
  const loadingStateBody = (
    <SkeletonTableBody rowsCount={5} columnsCount={columns.length} />
  );

  return (
    <div>
      <Drawer isExpanded={isDrawerOpen} onExpand={() => setIsDrawerOpen(true)}>
        <DrawerContent
          panelContent={
            <DrawerPanelContent>
              <DrawerHead>
                <Title headingLevel="h2" size="lg">
                  {selectedGroup?.name}
                </Title>
                <DrawerActions>
                  <DrawerCloseButton onClick={handleCloseDrawer} />
                </DrawerActions>
              </DrawerHead>
              <div className="pf-v6-u-p-md">
                <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">
                  Users
                </Title>
                {isLoadingUsers ? (
                  <div className="pf-v6-u-text-align-center pf-v6-u-p-lg">
                    <Spinner size="lg" />
                    <div className="pf-v6-u-mt-sm">Loading users...</div>
                  </div>
                ) : groupUsers.length > 0 ? (
                  <List isBordered isPlain>
                    {groupUsers.map((user, index) => (
                      <ListItem key={index}>{user.username}</ListItem>
                    ))}
                  </List>
                ) : (
                  <EmptyState>
                    <Title headingLevel="h4">No users found</Title>
                    <EmptyStateBody>
                      This group currently has no users assigned.
                    </EmptyStateBody>
                  </EmptyState>
                )}
              </div>
            </DrawerPanelContent>
          }
        >
          <DrawerContentBody>
            <div className="pf-v6-c-form__group">
              <div className="pf-v6-c-form__label">
                <label className="pf-v6-c-form__label-text">
                  {label}
                  {isRequired && (
                    <span className="pf-v6-c-form__label-required"> *</span>
                  )}
                </label>
              </div>
              <DataView
                activeState={
                  isLoading
                    ? 'loading'
                    : filteredData.length === 0
                    ? 'empty'
                    : undefined
                }
              >
                <DataViewToolbar
                  clearAllFilters={
                    searchTerm ? () => setSearchTerm('') : undefined
                  }
                  filters={
                    <DataViewTextFilter
                      filterId="filterGroupName"
                      title="Group name"
                      placeholder="Filter by group name..."
                      value={searchTerm}
                      onChange={(_event, value) => setSearchTerm(value)}
                      onClear={() => setSearchTerm('')}
                    />
                  }
                  pagination={
                    <Pagination
                      perPageOptions={perPageOptions}
                      itemCount={filteredData.length}
                      {...pagination}
                    />
                  }
                  actions={undefined}
                />

                {selected.length > 0 && (
                  <div className="pf-v6-u-mb-md pf-v6-u-mt-sm">
                    <LabelGroup
                      categoryName="Selected groups"
                      numLabels={10}
                      isClosable
                      className="pf-v6-u-mb-sm"
                    >
                      {selected.map((group) => (
                        <Label
                          key={group.id}
                          onClose={() => onSelect(false, group)}
                          closeBtnAriaLabel={`Remove ${group.name}`}
                          variant="filled"
                          color="grey"
                          isCompact
                        >
                          {group.name}
                        </Label>
                      ))}
                    </LabelGroup>
                  </div>
                )}

                <DataViewTable
                  aria-label="User Access Groups"
                  variant="compact"
                  columns={columns.map((column, index) => ({
                    cell: column.label,
                    props: {
                      width: index === 0 ? 10 : index === 1 ? 60 : 30,
                      ...(index === 0 && { modifier: 'fitContent' }),
                    },
                  }))}
                  rows={rows}
                  headStates={{ loading: loadingStateHeader }}
                  bodyStates={{
                    loading: loadingStateBody,
                    empty: emptyState,
                  }}
                />

                <DataViewToolbar
                  pagination={
                    <Pagination
                      isCompact
                      perPageOptions={perPageOptions}
                      itemCount={filteredData.length}
                      {...pagination}
                    />
                  }
                />
              </DataView>

              {meta.error && (
                <div className="pf-v6-c-form__helper-text pf-m-error">
                  {meta.error}
                </div>
              )}
            </div>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default UserAccessGroupsDataView;
