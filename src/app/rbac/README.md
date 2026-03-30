# RBAC in the notifications app

## V1 access API (`/api/rbac/v1/access/`)

[`useApp`](../useApp.ts) calls [`fetchRBAC`](../../utils/insights-common-typescript/RbacUtils.ts) to populate [`AppContext`](../AppContext.tsx): notifications, integrations, and events permissions (`canReadNotifications`, `canWriteIntegrationsEndpoints`, etc.). This path is unchanged.

## Kessel + default workspace

[`KesselRbacAccessProvider`](./KesselRbacAccessProvider.tsx) runs beside that flow (wired in [`App.tsx`](../App.tsx), [`IntegrationsApp.tsx`](../IntegrationsApp.tsx), and the default export wrapper in [`IntegrationWizard.tsx`](../../pages/Integrations/Create/IntegrationWizard.tsx)):

1. Resolves the org **default workspace** via `GET /api/rbac/v2/workspaces/?type=default` (`fetchDefaultWorkspace` from `@project-kessel/react-kessel-access-check`).
2. Calls **Kessel** `POST /api/kessel/v1beta2/checkselfbulk` through `useSelfAccessCheck` for workspace relations `rbac_groups_read` and `rbac_principal_read` (resource `type: workspace`, `reporter: { type: 'rbac' }`).

The app is wrapped with `AccessCheck.Provider` (`apiPath: /api/kessel/v1beta2`) in [`App.tsx`](../App.tsx), outside this file.

## Consumers

- [`RbacGroupContextProvider`](./RbacGroupContextProvider.tsx) lists groups with **V1** `GET /api/rbac/v1/groups/` only when `canReadRbacGroups` is true.
- [`UserAccessGroupsDataView`](../../pages/Integrations/Create/CustomComponents/UserAccessGroupsDataView.tsx) loads group principals only when `canReadRbacPrincipals` is true.

## Tests

Jest tests that mount the full app should mock the default-workspace and Kessel bulk-check endpoints (see `src/app/__tests__/App.test.tsx`).

### Storybook

- Stories: [`UserAccessGroupsDataView.stories.tsx`](../../pages/Integrations/Create/CustomComponents/UserAccessGroupsDataView.stories.tsx) — **Stub** stories inject `KesselRbacAccessContext` + `RbacGroupContext` for fast permission states; **MSW** stories mount `AccessCheck.Provider` + `KesselRbacAccessProvider` + `RbacGroupContextProvider` with handlers from [`msw/kesselRbacStoryHandlers.ts`](./msw/kesselRbacStoryHandlers.ts).
- Run `npm run storybook`, then open **Integrations → UserAccessGroupsDataView**. Interaction `play` functions use `storybook/test` for component checks.
