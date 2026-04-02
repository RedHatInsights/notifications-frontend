# Notifications Frontend

A React-based frontend application for Red Hat Console notification management.

## Project Overview

This application provides a user interface for managing notifications in the Red Hat Hybrid Cloud Console. Built with PatternFly React components and TypeScript.

## Architecture

- **Framework**: React 18 with TypeScript (strict mode)
- **UI Components**: PatternFly 6 (v6.4.0)
- **State Management**: React Context + Redux (minimal - one reducer)
- **Build Tool**: Webpack with Module Federation (micro-frontend)
- **Testing**: Jest + React Testing Library, Cypress, Playwright
- **Storybook**: Component documentation and visual testing
- **Feature Flags**: Unleash for feature toggles
- **Internationalization**: React Intl

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Run Storybook
npm run storybook

# Lint
npm run lint
npm run lint:ts:fix  # Auto-fix linting issues

# Regenerate API clients from OpenAPI specs
npm run schema
```

## Project Structure

```
src/
├── api/              # API integration layer (axios + factories)
├── app/              # Core app components
│   ├── App.tsx       # Main app with providers
│   └── rbac/         # RBAC/Kessel integration
├── components/       # Reusable UI components
│   ├── Integrations/ # Integration forms, tables, modals
│   ├── Notifications/# Notification UI components
│   └── Widgets/      # Dashboard widgets (EventsWidget)
├── generated/        # Auto-generated OpenAPI clients (DO NOT EDIT)
│   ├── OpenapiNotifications.ts (1,466 lines)
│   ├── OpenapiIntegrations.ts  (933 lines)
│   ├── OpenapiRbac.ts          (2,857 lines)
│   └── OpenapiPrivate.ts       (962 lines)
├── hooks/            # Custom React hooks
├── pages/            # Page-level components
│   ├── Integrations/ # Integration pages (Create, List, Delete)
│   └── Notifications/# Notification pages (List, EventLog, Form)
├── services/         # API service hooks
│   ├── Integrations/ # GetEndpoint, ListIntegrations
│   ├── Notifications/# GetBehaviorGroups, GetBundles
│   └── Rbac/         # GetGroups
├── store/            # Redux state (minimal usage)
├── types/            # TypeScript type definitions
│   ├── Integration.ts # Integration types + adapters
│   ├── Notification.ts
│   └── adapters/     # API response transformers
└── utils/            # Utility functions
    └── insights-common-typescript/ # Red Hat Insights utilities
```

## Common Patterns & File Locations

### Adding a New Integration Type

- **Form components**: `src/components/Integrations/Form/IntegrationType{Name}Form.tsx`
- **Type definitions**: `src/types/Integration.ts` (IntegrationType enum)
- **API helpers**: `src/api/helpers/integrations/endpoints-helper.ts`
- **Wizard flow**: `src/pages/Integrations/Create/IntegrationWizard.tsx`
- **Example**: See `IntegrationTypeSlackForm.tsx` or `IntegrationTypeHttpForm.tsx`

### Working with Notifications

- **List page**: `src/pages/Notifications/List/Page.tsx`
- **Event log**: `src/pages/Notifications/EventLog/EventLogPage.tsx`
- **Behavior groups**: `src/components/Notifications/BehaviorGroup/`
- **API services**: `src/services/Notifications/`
- **Types**: `src/types/Notification.ts` + `src/generated/OpenapiNotifications.ts`

### Using PatternFly 6 DataView

- **Primary example**: `src/pages/Integrations/Create/CustomComponents/UserAccessGroupsDataView.tsx`
- **Widget example**: `src/components/Widgets/EventsWidget.tsx`
- **Integrations table**: `src/components/Integrations/IntegrationsTable.tsx`
- **Key imports**: `@patternfly/react-data-view` (DataView, DataViewTable, DataViewToolbar)

### RBAC/Permissions

- **Context provider**: `src/app/rbac/RbacGroupContextProvider.tsx`
- **Kessel workspace**: `src/app/rbac/KesselRbacAccessProvider.tsx`
- **Workspace relations**: `src/app/rbac/kesselWorkspaceRelations.ts`
- **Permission checks**: `src/components/CheckReadPermissions.tsx` (wraps routes)
- **Service**: `src/services/Rbac/GetGroups.ts`

## Decision Trees

### "I need to display tabular data"

1. **Simple read-only table?** → Use `DataViewTable` from `@patternfly/react-data-view`
2. **Need filtering/pagination?** → Add `DataViewToolbar` with `DataViewTextFilter`
3. **Need row selection?** → Use `useDataViewSelection` hook
4. **Complex interactions?** → Check `UserAccessGroupsDataView.tsx` for complete example

### "I need to call the backend API"

1. **Is it in OpenAPI spec?** → Use types from `src/generated/OpenapiNotifications.ts` or `OpenapiIntegrations.ts`
2. **Need to add new endpoint?** → Update OpenAPI spec, then run `npm run schema` to regenerate
3. **Integration endpoint?** → Use helpers in `src/api/helpers/integrations/endpoints-helper.ts`
4. **Need a service hook?** → Create in `src/services/` following existing patterns (useListIntegrations.ts)

### "I need to add internationalization"

1. **User-facing text?** → Use `<FormattedMessage>` from `react-intl`
2. **Dynamic text?** → Use `useIntl()` hook with `formatMessage()`
3. **Adding new translations?** → Run `npm run translations:extract` then `npm run translations:compile`

### "I need to add a form"

1. **Simple form?** → Use Formik + PatternFly form components
2. **Multi-step wizard?** → Use `@data-driven-forms/react-form-renderer` (see IntegrationWizard.tsx)
3. **Form validation?** → Use yup schema with Formik
4. **PatternFly form wrappers?** → Import from `src/utils/insights-common-typescript/Formik.tsx`

### "I need to add routing"

1. **Add route to**: `src/Routes.tsx`
2. **Feature flagged route?** → Check `notificationsOverhaul` flag pattern
3. **Protected route?** → Wrap in `<CheckReadPermissions>` component
4. **Generate route URLs?** → Use `linkTo` helper object

## Known Gotchas

### PatternFly 6 Migration

- ❌ **Don't** import from `@patternfly/react-table` for new code (legacy PF5)
- ✅ **Do** use `@patternfly/react-data-view` for tables (PF6)
- ❌ **Don't** use legacy CSS class names (e.g., `pf-c-table`)
- ✅ **Do** run `/pf-class-migration-scanner` skill if migrating old code
- ⚠️ **Note**: Some components may still use react-table - migration in progress

### Generated API Clients (CRITICAL)

- ❌ **NEVER** manually edit files in `src/generated/`
- ✅ **ALWAYS** regenerate with `npm run schema` after OpenAPI spec changes
- ⚠️ **4 separate OpenAPI files**:
  - `OpenapiNotifications.ts` - Notifications API (1,466 lines)
  - `OpenapiIntegrations.ts` - Integrations API (933 lines)
  - `OpenapiRbac.ts` - RBAC API (2,857 lines)
  - `OpenapiPrivate.ts` - Private API (962 lines)
- ⚠️ **Large file sizes expected** - these are auto-generated, not code smells

### RBAC/Kessel Integration

- **Auto-sync**: RBAC groups sync every 2 minutes via `useSyncInterval`
- **Pagination**: Groups fetched 100 at a time
- **Context usage**: Access via `useRbacGroups()` hook
- **Workspace relations**: Defined in `kesselWorkspaceRelations.ts`
- **Permission checks**: Route-level with `CheckReadPermissions` wrapper

### Feature Flags

- **Uses Unleash**: `@unleash/proxy-client-react`
- **Key flag**: `platform.notifications.overhaul` - switches between legacy and new routes
- **Storybook mocking**: Check `.storybook/preview.tsx` for Unleash mock setup

### Module Federation (Micro-Frontend)

- **Exposes**: RootApp, IntegrationsTable, TimeConfig, DashboardWidget, IntegrationWizard
- **Shares**: react-router-dom (singleton)
- **Config**: `fec.config.js`
- ⚠️ **Shared dependencies** - be careful with version conflicts

### Environment & Development

- **Local dev requires**: `/etc/hosts` configuration for prod.foo and stage.foo
- **Dev server**: Uses `insights-proxy` via `fec dev` command
- **Hot reload**: Enabled with `HOT=true` environment variable
- **API routes**: Configured in `config/api-routes.ts`

### Testing Gotchas

- **Test wrapper**: Use `appWrapperSetup()` from test utils for components needing routing/context
- **MSW mocking**: Storybook uses MSW addon for API mocking
- **Coverage**: Only 29 test suites currently - not comprehensive
- **E2E**: Both Cypress AND Playwright configured (Cypress is primary)

## Testing Patterns

### Unit/Component Tests (Jest)

```tsx
import { render, screen } from '@testing-library/react';
import { appWrapperSetup } from '@redhat-cloud-services/frontend-components-testing';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { wrapper } = appWrapperSetup();
    render(<MyComponent />, { wrapper });
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### E2E Tests

- **Cypress**: Primary E2E framework
  - Config: `cypress.config.ts`
  - Tests: `cypress/e2e/`
  - Run: `npm run cypress:open`
- **Playwright**: Secondary framework
  - Config: `playwright/`
  - Example: `playwright/example.spec.ts`

### Storybook Tests

- **Test runner**: `npm run test-storybook`
- **Stories location**: Co-located with components (`*.stories.tsx`)
- **MSW integration**: API mocking in `.storybook/preview.tsx`

## File Navigation Map

| What You Need              | Where to Look                                         |
| -------------------------- | ----------------------------------------------------- |
| Notification pages         | `src/pages/Notifications/`                            |
| Integration forms          | `src/components/Integrations/Form/`                   |
| Integration wizard         | `src/pages/Integrations/Create/IntegrationWizard.tsx` |
| API types (auto-generated) | `src/generated/Openapi*.ts`                           |
| API service hooks          | `src/services/`                                       |
| Type definitions           | `src/types/`                                          |
| Type adapters              | `src/types/adapters/`                                 |
| RBAC logic                 | `src/app/rbac/`                                       |
| Redux store                | `src/store/` (minimal - one reducer)                  |
| Custom hooks               | `src/hooks/`                                          |
| Utilities                  | `src/utils/insights-common-typescript/`               |
| E2E tests (Cypress)        | `cypress/e2e/`                                        |
| E2E tests (Playwright)     | `playwright/`                                         |
| Storybook config           | `.storybook/`                                         |
| Build config               | `fec.config.js`, `config/`                            |
| CI/CD pipelines            | `.github/workflows/`, `.travis.yml`, `.tekton/`       |
| Frontend Operator config   | `.rhcicd/frontend.yaml`                               |

## Coding Standards

- **TypeScript**: Strict mode enabled, use explicit types
- **React**: Functional components with hooks (no class components)
- **Styling**: Use PatternFly components and utilities
- **Testing**: Test all components with React Testing Library
- **Linting**: ESLint configuration in `.eslintrc.js`
- **Formatting**: Prettier (auto-runs on commit via husky)
- **Commits**: Conventional commits enforced via commitlint

## Agent Guidelines

1. **Generated Code**: Never manually edit files in `src/generated/` - regenerate with `npm run schema`
2. **PatternFly First**: Use PatternFly 6 components (`@patternfly/react-data-view` for tables)
3. **Type Safety**: Maintain strict TypeScript types, avoid `any`
4. **Type Adapters**: Use adapters in `src/types/adapters/` for API response transformation
5. **Test Coverage**: Write tests for new components (currently low coverage - 29 test suites)
6. **Feature Flags**: Check Unleash flags before implementing route changes
7. **RBAC**: Always wrap protected routes in `CheckReadPermissions`
8. **Internationalization**: All user-facing text must use `react-intl`

## PatternFly Skills

The following PatternFly React skills are available via the `pf-react` plugin:

### Component Development

- **/patternfly-component-structure** - Audit component hierarchy, fix nesting violations, debug layout issues
- **/pf-project-scaffolder** - Bootstrap new PatternFly projects with PF6-safe dependencies
- **/pf-import-checker** - Fix PatternFly import path issues (charts, chatbot, component-groups)

### Code Quality

- **/pf-unit-test-generator** - Generate comprehensive unit tests for PatternFly components
- **/pf-library-test-writer** - Write unit tests for PatternFly library contributors (not for consumers)
- **/pf-class-migration-scanner** - Scan for legacy PatternFly classes and suggest PF6 replacements

### Documentation

- **/write-example-description** - Write/refine example descriptions for PatternFly.org
- **/icon-finder** - Find Red Hat Design System icons by use case with visual preview

### Maintenance

- **/pf-bug-triage** - Triage bug reports, suggest fixes, tag maintainers

### When to Use These Skills

- **After adding PatternFly imports**: Run `/pf-import-checker` to verify import paths
- **When building new components**: Use `/patternfly-component-structure` to audit hierarchy
- **When writing tests**: Use `/pf-unit-test-generator` for comprehensive test coverage
- **When migrating code**: Use `/pf-class-migration-scanner` to find legacy patterns
- **When searching for icons**: Use `/icon-finder` to browse Red Hat Design System icons

## Recent Changes

### PatternFly 6 Upgrade (Current)

- Upgraded from PF5 → PF6.4.0
- Main breaking change: `@patternfly/react-data-view` replaces `@patternfly/react-table`
- Migration in progress - some components still use legacy react-table
- Examples: `UserAccessGroupsDataView.tsx`, `EventsWidget.tsx`

### Kessel RBAC Integration

- New workspace-based permissions model
- Auto-sync every 2 minutes
- Files: `src/app/rbac/KesselRbacAccessProvider.tsx`, `kesselWorkspaceRelations.ts`

### Feature Flag Routing

- Unleash flag `platform.notifications.overhaul` controls route sets
- Legacy vs new notification UI

### Module Federation

- Micro-frontend architecture
- Exposes: RootApp, IntegrationsTable, TimeConfig, DashboardWidget, IntegrationWizard
- Config: `fec.config.js`

## CI/CD

- **Platform**: GitHub Actions + Travis CI
- **Build Pipeline**: `.github/workflows/` and `.travis.yml`
- **Deployment**: Automated via Konflux/Tekton (`.tekton/`)
- **Frontend Operator**: Configuration in `.rhcicd/frontend.yaml`

## Known Issues

- ✅ `tsconfig.json` syntax fixed (trailing comma removed)
- ⚠️ Large generated files (4 files, largest is 2,857 lines) - expected, not code smells
- ⚠️ Low test coverage (29 test suites for entire codebase)
- ⚠️ Limited Storybook stories (only 3 story files)
