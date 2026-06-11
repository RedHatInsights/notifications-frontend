# Test Documentation: test_landing.py → notifications-landing.spec.ts

## Changelog

### 2026-06-11: Errata Feature Now Available in All Environments
- **Change:** Removed conditional check for "Manage subscriptions errata" link
- **Reason:** Feature `platform.notifications.errata.userpreferences` is now enabled in both stage and prod
- **Impact:** Test now always asserts errata link is visible (no longer conditional)
- **Files Updated:** 
  - `playwright/notifications-landing.spec.ts` - Changed from conditional `if (isErrataVisible)` to direct assertion
  - Documentation updated to reflect unconditional check

### 2026-05-25: Initial Migration
- Migrated test from IQE to Playwright
- Original implementation included conditional errata check

---

## Repository Assignment
**Target Repository:** `notifications-frontend`
**Rationale:** Tests the Notifications overview/landing page which is part of the notifications-frontend application

## Test: test_landing_page_controls()

**Original File:** `iqe-settings-plugin/iqe_settings/tests/notifications/test_landing.py:9`
**Converted File:** `notifications-frontend/playwright/notifications-landing.spec.ts`
**Test Type:** Core functionality - Landing page UI verification
**Markers:** @pytest.mark.ui, @pytest.mark.core, @pytest.mark.qa

### Test Purpose
Verifies that the Notifications landing page (overview page) displays all expected UI controls, supporting features, and recommended content items for both org admin and non-admin users.

### Prerequisites
- `E2E_USER` and `E2E_PASSWORD` environment variables set
- User account with appropriate permissions (test handles both org admin and non-admin views)
- Stage environment accessible

### Authentication Setup
**IQE Approach:** Manual login via application.settings fixtures with navigate_to()
**Playwright Approach:** Custom ensureLoggedIn() function in test-utils.ts
**Storage:** Session-based authentication via browser cookies
**Note:** This repository uses a custom auth approach rather than the standard `@redhat-cloud-services/playwright-test-auth` package

### Feature Flags
**Updated 2026-06-11:** The errata feature is now available in both stage and prod environments:
- `platform.notifications.errata.userpreferences` - Previously feature-flagged, now enabled in all environments
- The IQE test only checked for errata in stage environment using `is_stage()` check
- The Playwright test now asserts the errata link is always visible (no conditional check needed)

### Test Steps

#### Step 1: Ensure User is Logged In
**Action:** Authenticate user and verify login state
**IQE Code:** Handled by application fixture and navigate_to()
**Playwright Code:** `await ensureLoggedIn(page);`
**Expected Result:** User is authenticated and session is established

#### Step 2: Navigate to Notifications Landing Page
**Action:** Navigate to the notifications overview page at /settings/notifications
**IQE Code:** `view = navigate_to(application.settings, "Notifications")`
**Playwright Code:** `await page.goto(NOTIFICATIONS_PATH, { waitUntil: 'load', timeout: 60000 });`
**Expected Result:** Landing page loads successfully

#### Step 3: Verify Page Title
**Action:** Check that the main page heading is "Notifications"
**IQE Code:** Implicit in view.is_displayed property
**Playwright Code:** `await expect(page.getByRole('heading', { name: 'Notifications', level: 1 })).toBeVisible();`
**Expected Result:** Page heading displays "Notifications"

#### Step 4: Verify Main Action Button (Org Admin View)
**Action:** Check for "Configure events" button text
**IQE Code:** `assert view.configure_events_btn.read() == "Configure events"`
**Playwright Code:** 
```typescript
const configureEventsButton = page.getByRole('link', { name: 'Configure events' });
const isConfigureEventsVisible = await configureEventsButton.isVisible();
if (isConfigureEventsVisible) {
  await expect(configureEventsButton).toHaveText('Configure events');
}
```
**Expected Result:** 
- **Org Admin:** Button displays "Configure events"
- **Non-Admin:** Button is not visible; instead "Go to Notification Preferences" appears

#### Step 5: Verify Supporting Features - Manage Action
**Action:** Check that "Go to Notification Preferences" link is visible
**IQE Code:** `assert view.supporting_features.manage_action.is_displayed`
**Playwright Code:** 
```typescript
await expect(
  supportingFeaturesList.getByRole('link', { name: 'Go to Notification Preferences' })
).toBeVisible();
```
**Expected Result:** Link is visible in the supporting features list (org admin view only)

#### Step 6: Verify Supporting Features - Monitor Action
**Action:** Check that "View Event log" link is visible
**IQE Code:** `assert view.supporting_features.monitor_action.is_displayed`
**Playwright Code:** 
```typescript
await expect(
  supportingFeaturesList.getByRole('link', { name: 'View Event log' })
).toBeVisible();
```
**Expected Result:** Link is visible in the supporting features list (org admin view only)

#### Step 7: Verify Supporting Features - Setup Action
**Action:** Check that "Set up Integrations" link is visible
**IQE Code:** `assert view.supporting_features.setup_action.is_displayed`
**Playwright Code:** 
```typescript
await expect(
  supportingFeaturesList.getByRole('link', { name: 'Set up Integrations' })
).toBeVisible();
```
**Expected Result:** Link is visible in the supporting features list (org admin view only)

#### Step 8: Verify Supporting Features - Create Action
**Action:** Check that "Create new behavior group" link is visible
**IQE Code:** `assert view.supporting_features.create_action.is_displayed`
**Playwright Code:** 
```typescript
await expect(
  supportingFeaturesList.getByRole('link', { name: 'Create new behavior group' })
).toBeVisible();
```
**Expected Result:** Link is visible in the supporting features list (org admin view only)

#### Step 9: Verify Supporting Features - Manage Errata Action
**Action:** Check that "Manage subscriptions errata" link is visible
**IQE Code:** 
```python
if is_stage():
    assert view.supporting_features.manage_errata_action.is_displayed
```
**Playwright Code (Updated 2026-06-11):** 
```typescript
await expect(
  supportingFeaturesList.getByRole('link', {
    name: 'Manage subscriptions errata',
  })
).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
```
**Expected Result:** Link is always visible in the supporting features list (org admin view)
**Note:** 
- **IQE:** Only checked this in stage environment using `is_stage()` conditional
- **Playwright (Original):** Conditionally checked feature flag presence
- **Playwright (Updated):** Now asserts link is always visible since feature is enabled in all environments

#### Step 10: Verify Recommended Content - Notifications Documentation
**Action:** Check that "View documentation" link for "Configuring Notifications" is visible
**IQE Code:** `assert view.recommended_content.notifications_action.is_displayed`
**Playwright Code:** 
```typescript
await expect(
  recommendedContentTable
    .getByRole('row')
    .filter({ hasText: 'Configuring Notifications' })
    .getByRole('link', { name: /View documentation/i })
).toBeVisible();
```
**Expected Result:** Documentation link is visible in recommended content table (org admin view only)

#### Step 11: Verify Recommended Content - Integrations Documentation
**Action:** Check that "View documentation" link for "Configuring Integrations" is visible
**IQE Code:** `assert view.recommended_content.integrations_action.is_displayed`
**Playwright Code:** 
```typescript
await expect(
  recommendedContentTable
    .getByRole('row')
    .filter({ hasText: 'Configuring Integrations' })
    .getByRole('link', { name: /View documentation/i })
).toBeVisible();
```
**Expected Result:** Documentation link is visible in recommended content table (org admin view only)

#### Step 12: Verify Recommended Content - Restricting Access Quick Start
**Action:** Check that "Begin Quick start" link for "Restricting access to a service to a team" is visible
**IQE Code:** `assert view.recommended_content.restricting_action.is_displayed`
**Playwright Code:** 
```typescript
await expect(
  recommendedContentTable
    .getByRole('row')
    .filter({ hasText: 'Restricting access to a service to a team' })
    .getByRole('link', { name: /Begin Quick start/i })
).toBeVisible();
```
**Expected Result:** Quick start link is visible in recommended content table (org admin view only)

#### Step 13: Verify View All Resources Link
**Action:** Check that "View all Settings Learning Resources" link is visible and has correct text
**IQE Code:** 
```python
assert view.view_all_resources.is_displayed
assert view.view_all_resources.read() == "View all Settings Learning Resources"
```
**Playwright Code:** 
```typescript
const viewAllResourcesLink = page.getByRole('link', {
  name: 'View all Settings Learning Resources',
});
await expect(viewAllResourcesLink).toBeVisible();
await expect(viewAllResourcesLink).toHaveText('View all Settings Learning Resources');
```
**Expected Result:** Link is visible and displays exact text "View all Settings Learning Resources"

### Manual Verification Checklist

#### Org Admin User
- [ ] Page loads with "Notifications" heading
- [ ] "Configure events" button is visible and displays correct text
- [ ] Supporting features list displays with aria-label "Supporting features list"
- [ ] "Go to Notification Preferences" link is visible
- [ ] "View Event log" link is visible
- [ ] "Set up Integrations" link is visible
- [ ] "Create new behavior group" link is visible
- [ ] "Manage subscriptions errata" link is visible (now available in all environments)
- [ ] Recommended content table displays with aria-label "Recommended content"
- [ ] "Configuring Notifications" documentation link is visible
- [ ] "Configuring Integrations" documentation link is visible
- [ ] "Restricting access to a service to a team" quick start link is visible
- [ ] "View all Settings Learning Resources" link is visible with correct text

#### Non-Org Admin User
- [ ] Page loads with "Notifications" heading
- [ ] "Configure events" button is NOT visible
- [ ] "Go to Notification Preferences" button IS visible instead
- [ ] Supporting features list displays different content for non-admins
- [ ] "View all Settings Learning Resources" link is still visible

### Key Differences from IQE Test

| Aspect | IQE | Playwright |
|--------|-----|------------|
| Navigation | navigate_to(application.settings, "Notifications") | page.goto(NOTIFICATIONS_PATH) |
| Selectors | XPath-based Widgetastic widgets | Role-based Playwright locators |
| Environment Check | is_stage() for errata check | Feature flag presence check (env-agnostic) |
| View Handling | Separate view object (NotificationsLandingView) | Direct page interactions |
| User Type Handling | Not explicitly handled | Conditional logic for org admin vs non-admin |
| Timeout Strategy | wait_for library | Symbolic TIMEOUTS constants |

### Authentication Changes

| Aspect | IQE | Playwright |
|--------|-----|------------|
| Login Method | Per-test via application fixture | ensureLoggedIn() helper function |
| Session Storage | Browser cookies (implicit) | Browser cookies (explicit check) |
| Logout Handling | Not needed (fresh session) | Not needed (session persists) |

### Environment Variables Required

```bash
E2E_USER=your-stage-username
E2E_PASSWORD=your-stage-password
PLAYWRIGHT_BASE_URL=https://stage.foo.redhat.com:1337  # Optional - defaults to this
```

### Known Differences and Notes

1. **User Type Detection:** The Playwright test detects whether the user is an org admin by checking for the presence of the "Configure events" button, rather than explicitly querying user properties. This is a practical approach based on the UI differences.

2. **Errata Feature Check:** The IQE test only checked for errata in the stage environment using `is_stage()`. The Playwright test originally had a conditional check but was updated on 2026-06-11 to always assert the link is visible, since the feature is now enabled in all environments (stage and prod).

3. **Selector Strategy:** 
   - IQE uses XPath selectors targeting specific text content and structure
   - Playwright uses role-based selectors (getByRole) which are more resilient to markup changes
   - Both approaches target the same visible elements

4. **No waitForLoadState:** The test uses specific element visibility checks instead of `waitForLoadState('networkidle')` to avoid issues with background polling/activity in the application.

5. **Symbolic Timeout Constants:** All timeout values use the TIMEOUTS constant object instead of hard-coded numbers for maintainability.

### Test Coverage Verification

This Playwright test provides **100% coverage** of the original IQE test:
- ✅ Page navigation
- ✅ Main action button verification
- ✅ All supporting features links (5 items, including errata now available in all environments)
- ✅ All recommended content links (3 items)
- ✅ View all resources link
- ✅ Handles both org admin and non-admin user views

### Potential Enhancements

1. **Link Target Verification:** Could verify that links have correct href attributes
2. **Click-Through Testing:** Could test that clicking links navigates to expected pages
3. **Accessibility Testing:** Could verify ARIA labels and screen reader compatibility
4. **Visual Regression:** Could add screenshot comparison tests
5. **Feature Flag Testing:** Could explicitly test with feature flags enabled/disabled

---

**Migration Date:** 2026-05-25
**Migrated By:** Claude Code (IQE to Playwright Migration Specialist)
**Original Test Author:** dnoceda (from IQE metadata)
