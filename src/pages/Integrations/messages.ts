import { defineMessages } from 'react-intl';

export default defineMessages({
  // Column labels
  nameColumnLabel: {
    id: 'integrations.userAccessGroups.nameColumn',
    description: 'Name column label in User Access Groups table',
    defaultMessage: 'Name',
  },
  usersColumnLabel: {
    id: 'integrations.userAccessGroups.usersColumn',
    description: 'Users column label in User Access Groups table',
    defaultMessage: 'Users',
  },

  // Empty state messages
  noMatchingUserAccessGroups: {
    id: 'integrations.userAccessGroups.noMatchingGroups',
    description: 'Title when no groups match search criteria',
    defaultMessage: 'No matching User Access Groups',
  },
  noUserAccessGroups: {
    id: 'integrations.userAccessGroups.noGroups',
    description: 'Title when no groups are available',
    defaultMessage: 'No User Access Groups',
  },
  noMatchingGroupsMessage: {
    id: 'integrations.userAccessGroups.noMatchingGroupsMessage',
    description: 'Message when no groups match search criteria',
    defaultMessage:
      'No User Access Groups match the current search criteria. Try adjusting your search term.',
  },
  noGroupsAvailableMessage: {
    id: 'integrations.userAccessGroups.noGroupsAvailableMessage',
    description: 'Message when no groups are available',
    defaultMessage:
      'No User Access Groups are available. Contact your administrator to set up access groups.',
  },

  // Popover messages
  adminDefaultGroupDescription: {
    id: 'integrations.userAccessGroups.adminDefaultGroupDescription',
    description: 'Description for admin default groups in popover',
    defaultMessage:
      'This is a system default group for admin access. All organization administrators are automatically included in this group.',
  },
  platformDefaultGroupDescription: {
    id: 'integrations.userAccessGroups.platformDefaultGroupDescription',
    description: 'Description for platform default groups in popover',
    defaultMessage:
      'This is a custom default access group created by your organization. Members are managed separately.',
  },

  // Group user count labels
  allOrgAdmins: {
    id: 'integrations.userAccessGroups.allOrgAdmins',
    description: 'Label for admin default groups user count',
    defaultMessage: 'All org admins',
  },
  allUsers: {
    id: 'integrations.userAccessGroups.allUsers',
    description: 'Label for platform default groups user count',
    defaultMessage: 'All',
  },
  viewUsers: {
    id: 'integrations.userAccessGroups.viewUsers',
    description: 'Button text to view users in a group',
    defaultMessage: 'View',
  },
  userSingular: {
    id: 'integrations.userAccessGroups.userSingular',
    description: 'Singular form of user',
    defaultMessage: 'user',
  },
  userPlural: {
    id: 'integrations.userAccessGroups.userPlural',
    description: 'Plural form of user',
    defaultMessage: 'users',
  },

  // Drawer messages
  usersDrawerTitle: {
    id: 'integrations.userAccessGroups.usersDrawerTitle',
    description: 'Title for the users drawer',
    defaultMessage: 'Users',
  },
  loadingUsers: {
    id: 'integrations.userAccessGroups.loadingUsers',
    description: 'Loading message when fetching group users',
    defaultMessage: 'Loading users...',
  },
  noUsersFound: {
    id: 'integrations.userAccessGroups.noUsersFound',
    description: 'Title when no users are found in a group',
    defaultMessage: 'No users found',
  },
  noUsersAssigned: {
    id: 'integrations.userAccessGroups.noUsersAssigned',
    description: 'Message when no users are assigned to a group',
    defaultMessage: 'This group currently has no users assigned.',
  },

  // Selection and filtering
  selectedGroups: {
    id: 'integrations.userAccessGroups.selectedGroups',
    description: 'Label for selected groups',
    defaultMessage: 'Selected groups',
  },
  removeGroup: {
    id: 'integrations.userAccessGroups.removeGroup',
    description: 'Aria label for removing a selected group',
    defaultMessage: 'Remove {groupName}',
  },
  selectGroup: {
    id: 'integrations.userAccessGroups.selectGroup',
    description: 'Aria label for selecting a group',
    defaultMessage: 'Select {groupName}',
  },
  userAccessGroupsTableLabel: {
    id: 'integrations.userAccessGroups.tableLabel',
    description: 'Aria label for the User Access Groups table',
    defaultMessage: 'User Access Groups',
  },
  groupNameFilter: {
    id: 'integrations.userAccessGroups.groupNameFilter',
    description: 'Title for group name filter',
    defaultMessage: 'Group name',
  },
  filterByGroupNamePlaceholder: {
    id: 'integrations.userAccessGroups.filterPlaceholder',
    description: 'Placeholder text for group name filter',
    defaultMessage: 'Filter by group name...',
  },
});
