# RBAC Implementation

This directory contains the Role-Based Access Control (RBAC) implementation for the notifications-frontend application.

## Overview

The notifications-frontend application manages permissions for two main functional areas:

1. **Notifications** - Event viewing, notification management, and behavior groups
2. **Integrations** - Endpoint creation, configuration, and testing

RBAC is implemented using a **hybrid approach** that combines:

- **Kessel v2** workspace-based permission checks for authorization decisions
- **V1 RBAC API** for fetching user groups and principals (access gated by Kessel permissions)

## Core Concepts

### User Access Groups

User access groups allow administrators to control who receives email notifications:

- **Admin Default Group**: Automatically includes all organization administrators
- **Platform Default Group**: Custom default group that includes all users in the organization
- **Custom Groups**: User-defined groups with specific members

Access to view and manage these groups is controlled by the `rbac_groups_read` and `rbac_principal_read` permissions.

### Permission Model

Permissions are checked at the **workspace level** and control:

- **Viewing** notifications, events, and integrations
- **Editing** notifications and integrations
- **Managing** user access groups

## Files in this Directory

- **`RbacGroupContext.ts`** - React context type definitions for RBAC groups
- **`RbacGroupContextProvider.tsx`** - Provider that fetches and caches RBAC groups (auto-syncs every 2 minutes)
- **`KesselRbacAccessContext.ts`** - React context for Kessel permission state
- **`KesselRbacAccessProvider.tsx`** - Provider that fetches workspace and checks all permissions
- **`kesselWorkspaceRelations.ts`** - Permission mapping definitions (v1 → v2 relations)
- **`hooks/useDefaultWorkspace.ts`** - Hook to fetch the default workspace ID
- **`msw/kesselRbacStoryHandlers.ts`** - MSW mocking utilities for Storybook testing

## Quick Start

### Checking Permissions in Components

```tsx
import { useKesselRbacAccess } from './app/rbac/KesselRbacAccessContext';

function MyComponent() {
  const { permissions, isLoading } = useKesselRbacAccess();

  if (isLoading) {
    return <Spinner />;
  }

  if (!permissions.canEditNotifications) {
    return <NotAuthorized />;
  }

  return <EditForm />;
}
```

### Available Permissions

```typescript
permissions: {
  // Integrations
  canEditIntegrationsEndpoints: boolean;
  canViewIntegrationsEndpoints: boolean;

  // Notifications
  canViewNotificationsEvents: boolean;
  canEditNotifications: boolean;
  canViewNotifications: boolean;

  // RBAC
  canReadRbacGroups: boolean;
  canReadRbacPrincipal: boolean;
}
```

### Accessing RBAC Groups

```tsx
import { useRbacGroups } from './app/rbac/RbacGroupContext';

function MyComponent() {
  const { groups, isLoading } = useRbacGroups();

  // groups will be empty if canReadRbacGroups permission is denied
  return (
    <ul>
      {groups.map((group) => (
        <li key={group.id}>
          {group.name} ({group.principalCount} users)
        </li>
      ))}
    </ul>
  );
}
```

## Testing with Storybook

Use the provided MSW handler presets:

```tsx
import {
  kesselRbacGrantedHandlers,
  kesselRbacNoRbacHandlers,
} from './app/rbac/msw/kesselRbacStoryHandlers';

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [...kesselRbacGrantedHandlers],
    },
  },
};

export const NoPermissions: Story = {
  parameters: {
    msw: {
      handlers: [...kesselRbacNoRbacHandlers],
    },
  },
};
```

**Available Presets**:

- `kesselRbacGrantedHandlers` - All permissions granted
- `kesselRbacDeniedHandlers` - All permissions denied
- `kesselRbacReadOnlyHandlers` - Read-only access
- `kesselRbacNoRbacHandlers` - RBAC group/principal permissions denied

## Common Patterns

### Conditionally Showing UI Based on Permissions

```tsx
function IntegrationsList() {
  const { permissions } = useKesselRbacAccess();

  return (
    <>
      <IntegrationsTable />
      {permissions.canEditIntegrationsEndpoints && (
        <Button onClick={handleCreate}>Create Integration</Button>
      )}
    </>
  );
}
```

### Gating API Calls

```tsx
function useNotificationGroups() {
  const { permissions } = useKesselRbacAccess();

  if (!permissions.canReadRbacGroups) {
    return { groups: [], isLoading: false };
  }

  // Fetch groups only if permission granted
  return useQuery(...);
}
```

---

## Kessel v2 Integration Details

### Architecture

The Kessel v2 integration uses workspace-based permissions via `@project-kessel/react-kessel-access-check`.

**Provider Hierarchy**:

```
AccessCheck.Provider (from @project-kessel/react-kessel-access-check)
  └─ KesselRbacAccessProvider
      └─ AppContext.Provider
          └─ RbacGroupContextProvider
              └─ Application components
```

### Permission Schema

Permission mappings are defined in the `notifications.ksl` schema:

| v1 Permission                       | v2 Relation                        |
| ----------------------------------- | ---------------------------------- |
| `integrations:endpoints:write`      | `integrations_endpoints_edit`      |
| `integrations:endpoints:read`       | `integrations_endpoints_view`      |
| `notifications:events:read`         | `notifications_events_view`        |
| `notifications:notifications:write` | `notifications_notifications_edit` |
| `notifications:notifications:read`  | `notifications_notifications_view` |
| `rbac:groups:read`                  | `rbac_groups_read`                 |
| `rbac:principal:read`               | `rbac_principal_read`              |

**Note**: The wildcard v1 permission `notifications:*:*` expands to three v2 relations:

- `notifications_events_view`
- `notifications_notifications_edit`
- `notifications_notifications_view`

**Schema Source**: https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl

### Component Details

#### `KesselRbacAccessProvider.tsx`

Main provider that:

- Fetches the default workspace ID from `/api/rbac/v2/workspaces/?type=default`
- Checks all workspace relations using `useSelfAccessCheck` hook
- Exposes permission results via `KesselRbacAccessContext`

#### `KesselRbacAccessContext.ts`

React context providing:

- `workspaceId`: Default workspace ID
- `isLoading`: Loading state for workspace and permissions
- `permissions`: Object with all permission check results
- `errors`: Any errors encountered during fetching

Access via: `useKesselRbacAccess()` hook

#### `kesselWorkspaceRelations.ts`

Constants and types for v2 relation names. Maps v1 permissions to v2 relations based on the notifications.ksl schema.

#### `RbacGroupContextProvider.tsx`

Provides RBAC groups list, gated by `canReadRbacGroups` permission:

- If permission granted: Fetches groups from `/api/rbac/v1/groups/`
- If permission denied: Returns empty array
- Auto-syncs every 2 minutes via `useSyncInterval`

### API Endpoints

#### Kessel v2 Endpoints

- `GET /api/rbac/v2/workspaces/?type=default` - Fetch default workspace
- `POST /api/rbac/v2/check/self` - Bulk permission check

#### V1 RBAC Endpoints (still in use)

- `GET /api/rbac/v1/groups/` - List RBAC groups (gated by `rbac_groups_read`)
- `GET /api/rbac/v1/groups/:uuid/principals/` - Get group principals (gated by `rbac_principal_read`)

### Migration from V1 to V2

**Before (V1 RBAC)**:

```tsx
// Direct API call, no permission check
const groups = await query(getRbacGroupsAction({ limit: 100 }));
```

**After (Kessel V2)**:

```tsx
// Gated by Kessel permission
const { permissions } = useKesselRbacAccess();
if (!permissions.canReadRbacGroups) {
  return []; // Permission denied
}
const groups = await query(getRbacGroupsAction({ limit: 100 }));
```

### Custom MSW Handlers

For specific permission scenarios in Storybook:

```tsx
import { createKesselRbacHandlers } from './app/rbac/msw/kesselRbacStoryHandlers';

const customHandlers = createKesselRbacHandlers({
  notifications_notifications_view: true,
  notifications_notifications_edit: false,
  integrations_endpoints_view: true,
  integrations_endpoints_edit: false,
  // ... other permissions
});
```

### Troubleshooting

#### "useKesselRbacAccess must be used within KesselRbacAccessProvider"

Ensure `AccessCheck.Provider` and `KesselRbacAccessProvider` are in the provider tree above your component.

#### Permissions not loading

Check the console for errors from workspace or permission check endpoints. Verify the workspace ID is being fetched correctly.

#### Groups not appearing

Verify `canReadRbacGroups` permission is granted. If denied, `RbacGroupContextProvider` will return an empty array.

### Future Work

- Migrate remaining V1 RBAC calls to V2
- Add permission-based route guards
- Implement notification-level permission checks (currently workspace-scoped)
