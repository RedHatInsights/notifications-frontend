# Test Coverage Analysis - notifications-frontend

Generated: 2026-04-24T14:23:11.567Z

---

## 🧪 Existing Cypress Tests (3)

**Found Cypress tests that can be migrated:**

- `cypress/components/NotificationsDrawer.cy.tsx`
- `cypress/components/UserAccessGroupsDataView.cy.tsx`
- `cypress/e2e/spec.cy.ts`

---

## ⚠️ Important Notes

**Icon Components**: Icon components (e.g., `*Icon.tsx`) do NOT require tests. Icons are purely presentational and testing them provides minimal value. The analysis below may list icon components in coverage gaps - these can be safely ignored.

---

# Repository Structure Analysis

## Summary

- **Total Components**: 147
- **Components with Tests**: 18 (12.2%)
- **Components without Tests**: 129 (87.8%)

## Test Coverage by Type

- **Jest Unit Tests**: 18 (12.2%)
- **Storybook Stories**: 0 (0.0%)
- **Playwright E2E**: 0 (0.0%)
- **Cypress (Legacy)**: 0 (0.0%)

## Coverage Gaps

### High Priority (81)

- **ButtonLink**: Missing jest, storybook
- **CheckReadPermissions**: Missing jest, storybook
- **EmptyStateSearch**: Missing jest, storybook
- **DisabledIntegrationIcon**: Missing jest, storybook
- **EnabledIntegrationIcon**: Missing jest, storybook
- **WebhookIcon**: Missing jest, storybook
- **AddNotificationBody**: Missing jest, storybook
- **DopeBox**: Missing jest, storybook
- **EmptyState**: Missing jest, storybook
- **EventTypes**: Missing jest, storybook
- **IntegrationTypeCamelExtrasForm**: Missing jest, storybook
- **IntegrationTypeCamelForm**: Missing jest, storybook
- **IntegrationTypeForm**: Missing jest, storybook
- **IntegrationTypeGoogleChatForm**: Missing jest, storybook
- **IntegrationTypeHttpForm**: Missing jest, storybook
- **IntegrationTypeSlackForm**: Missing jest, storybook
- **IntegrationTypeTeamsForm**: Missing jest, storybook
- **Form**: Missing jest, storybook
- **IntegrationDetails**: Missing jest, storybook
- **IntegrationDetailsContent**: Missing jest, storybook
- **IntegrationEventDetails**: Missing jest, storybook
- **IntegrationsDrawer**: Missing jest, storybook
- **ConnectionAlert**: Missing jest, storybook
- **ConnectionAttempt**: Missing jest, storybook
- **ConnectionDegraded**: Missing jest, storybook
- **ConnectionFailed**: Missing jest, storybook
- **GoogleChatExpandedContent**: Missing jest, storybook
- **IntegrationExpandedContent**: Missing jest, storybook
- **SlackExpandedContent**: Missing jest, storybook
- **TeamsExpandedContent**: Missing jest, storybook
- **ExpandedContent**: Missing jest, storybook
- **IntegrationStatus**: Missing jest, storybook
- **IntegrationTest**: Missing jest, storybook
- **IntegrationTestProvider**: Missing jest, storybook
- **LastConnectionHelpTable**: Missing jest, storybook
- **Table**: Missing jest, storybook
- **Toolbar**: Missing jest, storybook
- **NotAuthorized**: Missing jest, storybook
- **ActionComponent**: Missing jest, storybook
- **BehaviorGroupActionsSummary**: Missing jest, storybook
- **BehaviorGroupCard**: Missing jest, storybook
- **BehaviorGroupForm**: Missing jest, storybook
- **BehaviorGroupFormActionsTable**: Missing jest, storybook
- **BehaviorGroupSaveModal**: Missing jest, storybook
- **BehaviorGroupWizard**: Missing jest, storybook
- **BehaviorGroupWizardFooter**: Missing jest, storybook
- **RecipientForm**: Missing jest, storybook
- **EmptyTableState**: Missing jest, storybook
- **ActionsHelpPopover**: Missing jest, storybook
- **EventLogActionPopoverContent**: Missing jest, storybook
- **EventLogToolbar**: Missing jest, storybook
- **EventLogTreeFilter**: Missing jest, storybook
- **usePrimaryToolbarFilterConfigWrapper**: Missing jest, storybook
- **RecipientTypeahead**: Missing jest, storybook
- **useRecipientOptionMemo**: Missing jest, storybook
- **NotificationStatus**: Missing jest, storybook
- **NotificationsBehaviorGroupRow**: Missing jest, storybook
- **NotificationsBehaviorGroupTable**: Missing jest, storybook
- **EventTypeFilter**: Missing jest, storybook
- **NotificationsLogDateFilter**: Missing jest, storybook
- **NotificationsLogEmptyState**: Missing jest, storybook
- **NotificationsLogTable**: Missing jest, storybook
- **NotificationsLogToolbar**: Missing jest, storybook
- **GroupNotFound**: Missing jest, storybook
- **Recipient**: Missing jest, storybook
- **TabComponent**: Missing jest, storybook
- **BehaviorGroupCell**: Missing jest, storybook
- **TimeConfig**: Missing jest, storybook
- **Toolbar**: Missing jest, storybook
- **DrawerSingleton**: Missing jest, storybook
- **Dropdowns**: Missing jest, storybook
- **NotificationItem**: Missing jest, storybook
- **initNotificationScope**: Missing jest, storybook
- **PageHeader**: Missing jest, storybook
- **Degraded**: Missing jest, storybook
- **Status**: Missing jest, storybook
- **NotificationsPortal**: Missing jest, storybook
- **TableHelp**: Missing jest, storybook
- **TableHelpPopover**: Missing jest, storybook
- **UtcDate**: Missing jest, storybook
- **EventsWidget**: Missing jest, storybook

### Medium Priority (48)

- **App**: Missing jest, storybook
- **AppContext**: Missing jest, storybook
- **AppSkeleton**: Missing jest, storybook
- **IntegrationsApp**: Missing jest, storybook
- **KesselRbacAccessProvider**: Missing jest, storybook
- **RbacGroupContextProvider**: Missing jest, storybook
- **bootstrap-dev**: Missing jest, storybook
- **bootstrap**: Missing jest, storybook
- **Page**: Missing jest, storybook
- **CreatePage**: Missing jest, storybook

_...and 38 more_

### Low Priority (18)

_18 components with minor coverage gaps_

## Legacy Cypress Tests

Found **0** Cypress test files that should be migrated:

## Recommendations

1. **Migrate Cypress Tests**: 0 components have legacy Cypress tests that should be converted
2. **Add Storybook Stories**: 147 components lack component-level tests
3. **Add Unit Tests**: 129 components lack unit test coverage
4. **Prioritize High-Value Components**: Focus on 81 high-priority components first

## Detailed Component List

### AppEntry

- **Path**: src/AppEntry.tsx
- **Jest**: ✅
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### IntegrationsEntry

- **Path**: src/IntegrationsEntry.tsx
- **Jest**: ✅
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### Routes

- **Path**: src/Routes.tsx
- **Jest**: ✅
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### App

- **Path**: src/app/App.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### AppContext

- **Path**: src/app/AppContext.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### AppSkeleton

- **Path**: src/app/AppSkeleton.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### IntegrationsApp

- **Path**: src/app/IntegrationsApp.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### KesselRbacAccessProvider

- **Path**: src/app/rbac/KesselRbacAccessProvider.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### RbacGroupContextProvider

- **Path**: src/app/rbac/RbacGroupContextProvider.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### bootstrap-dev

- **Path**: src/bootstrap-dev.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### bootstrap

- **Path**: src/bootstrap.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### ButtonLink

- **Path**: src/components/ButtonLink.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### CheckReadPermissions

- **Path**: src/components/CheckReadPermissions.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### EmptyStateSearch

- **Path**: src/components/EmptyStateSearch.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### DisabledIntegrationIcon

- **Path**: src/components/Icons/DisabledIntegrationIcon.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### EnabledIntegrationIcon

- **Path**: src/components/Icons/EnabledIntegrationIcon.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### WebhookIcon

- **Path**: src/components/Icons/WebhookIcon.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### AddNotificationBody

- **Path**: src/components/Integrations/AddNotificationBody.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### DeleteModal

- **Path**: src/components/Integrations/DeleteModal.tsx
- **Jest**: ✅
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

### DopeBox

- **Path**: src/components/Integrations/DopeBox.tsx
- **Jest**: ❌
- **Storybook**: ❌
- **Playwright**: ❌
- **Cypress**: ❌

_...and 127 more components_
