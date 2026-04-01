# RBAC in the notifications app

## Kessel workspace checks (V2)

[`KesselRbacAccessProvider`](./KesselRbacAccessProvider.tsx) resolves the org **default workspace** (`GET /api/rbac/v2/workspaces/?type=default` via `fetchDefaultWorkspace` from `@project-kessel/react-kessel-access-check`), then calls **Kessel** `POST /api/kessel/v1beta2/checkselfbulk` with workspace relations defined in [rbac-config `notifications.ksl`](https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl):

| V1 permission (legacy) | Kessel relation (`v2_perm`) |
| --- | --- |
| `integrations:endpoints:write` | `integrations_endpoints_edit` |
| `integrations:endpoints:read` | `integrations_endpoints_view` |
| `notifications:events:read` | `notifications_events_view` |
| `notifications:notifications:write` | `notifications_notifications_edit` |
| `notifications:notifications:read` | `notifications_notifications_view` |

Additional relations on the same workspace resource: `rbac_groups_read`, `rbac_principal_read`.

[`AppKesselContextBridge`](../AppKesselContextBridge.tsx) maps these into [`AppContext`](../AppContext.tsx) (`canReadNotifications`, `canWriteIntegrationsEndpoints`, etc.). The app is wrapped with `AccessCheck.Provider` (`apiPath: /api/kessel/v1beta2`) in [`App.tsx`](../App.tsx), [`IntegrationsApp.tsx`](../IntegrationsApp.tsx), and the integration wizard entry.

## V1 access API

[`fetchRBAC`](../../utils/insights-common-typescript/RbacUtils.ts) (`GET /api/rbac/v1/access/`) is no longer used for app-level notifications/integrations permissions; those come from Kessel as above. V1 **group** APIs remain for listing groups and principals when allowed.

## Consumers

- [`RbacGroupContextProvider`](./RbacGroupContextProvider.tsx) lists groups with **V1** `GET /api/rbac/v1/groups/` only when `canReadRbacGroups` is true.
- [`UserAccessGroupsDataView`](../../pages/Integrations/Create/CustomComponents/UserAccessGroupsDataView.tsx) loads group principals only when `canReadRbacPrincipals` is true.

## Tests

Jest tests that mount the full app should mock the default-workspace and Kessel bulk-check endpoints (see `src/app/__tests__/App.test.tsx`). Response `pairs` must align with [`kesselWorkspaceRelations.ts`](./kesselWorkspaceRelations.ts) order.

### Storybook

- [`UserAccessGroupsDataView.stories.tsx`](../../pages/Integrations/Create/CustomComponents/UserAccessGroupsDataView.stories.tsx) — **Stub** stories inject `KesselRbacAccessContext` + `RbacGroupContext`; **MSW** stories use handlers from [`msw/kesselRbacStoryHandlers.ts`](./msw/kesselRbacStoryHandlers.ts).
- [`CheckReadPermissions.stories.tsx`](../../components/CheckReadPermissions.stories.tsx) — **Stub** `AppContext.rbac` + `parameters.chrome` to assert notifications vs integrations vs event-log read gates (maps to Kessel `*_view` / `notifications_events_view`).
- [`AppKesselContextBridge.stories.tsx`](../AppKesselContextBridge.stories.tsx) — **MSW** full stack (`AccessCheck` → `KesselRbacAccessProvider` → bridge) with `play` checks on dumped `AppContext` flags.
- Run `npm run storybook`, then browse **App → CheckReadPermissions**, **App → AppKesselContextBridge (MSW)**, **Integrations → UserAccessGroupsDataView**. `play` functions use `storybook/test`.
