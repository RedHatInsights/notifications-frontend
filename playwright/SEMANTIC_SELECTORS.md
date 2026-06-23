# Semantic Selectors - Ideal Usage Guide

## What Are Semantic Selectors?

Semantic selectors in Playwright use the accessibility tree and ARIA roles to locate elements, testing the application the same way screen readers and assistive technologies interact with it.

**Playwright's semantic selector methods:**

- `getByRole()` - Buttons, links, tabs, textboxes, etc.
- `getByLabel()` - Form inputs with associated labels
- `getByPlaceholder()` - Inputs with placeholder text
- `getByText()` - Text content (less preferred, still better than CSS selectors)
- `getByTestId()` - `data-testid` attributes (fallback when semantics aren't available)

## Why Semantic Selectors Are Better

1. **Accessibility-first testing** - If tests pass with semantic selectors, the UI is accessible
2. **More stable** - Less likely to break with CSS/styling changes
3. **Self-documenting** - `getByRole('button', { name: 'Submit' })` is clearer than `.locator('button.pf-v6-c-button')`
4. **Resilient to refactoring** - Component structure can change without breaking tests

## Current State: Why We Can't Use Them

### Missing Roles

**Integrations Table Rows**

```typescript
// What we want:
const webhookRow = page.getByRole('row', { name: webhookPayload.name });

// Reality: <tr> elements don't have role="row"
// DOM: <tr class="pf-v6-c-table__tr">
// Current workaround: page.locator(`text="${webhookPayload.name}"`).first()
```

**Tabs**

```typescript
// What we want:
const webhooksTab = page.getByRole('tab', { name: 'Webhooks' });

// Reality: Tabs are sometimes <button>, sometimes <a>, no consistent role
// DOM: <button class="pf-v6-c-tabs__link">Webhooks</button>
// Current workaround: page.locator('button:has-text("Webhooks")').first()
```

**Kebab Menu Buttons**

```typescript
// What we want:
const actionsMenu = page.getByRole('button', { name: 'Actions' });

// Reality: aria-label is "PF6/MenuToggle", not descriptive
// DOM: <button aria-label="PF6/MenuToggle" class="pf-v6-c-menu-toggle">
// Current workaround: button.pf-v6-c-menu-toggle
```

### Missing Labels

**Form Fields in Wizards**

```typescript
// What we want:
await page.getByLabel('Integration name').fill('My Webhook');

// Reality: No <label> or aria-label on input
// DOM: <input name="name" placeholder="Enter name">
// Current workaround: page.locator('input[name="name"]')
```

**Event Type Checkboxes**

```typescript
// What we want:
await page.getByLabel('New recommendation').check();

// Reality: No accessible label association
// DOM: <input type="checkbox" value="New recommendation">
// Current workaround: page.locator('input[type="checkbox"][value="..."]')
```

### Missing OUIA IDs

**PatternFly components support OUIA (Open UI Automation) IDs:**

```typescript
// What OUIA enables:
<Table ouiaId="integrations-table">
<Button ouiaId="create-integration-button">

// Tests could use:
page.getByTestId('integrations-table')
page.getByTestId('create-integration-button')

// Reality: Components don't have ouiaId props set
// Current workaround: CSS classes and text matching
```

## Where Semantic Selectors WOULD Be Used

### ✅ Currently Working

**Headings**

```typescript
// This works because headings have implicit roles:
await expect(page.getByRole('heading', { name: 'Integrations' })).toBeVisible();
```

**Create Integration Button**

```typescript
// This works because it's a proper button with text:
const createButton = page.getByRole('button', { name: 'Create Integration' });
```

**Menu Items**

```typescript
// This works because dropdown items have role="menuitem":
await page.getByRole('menuitem', { name: 'Webhooks' }).click();
```

### ❌ Would Work If Accessibility Improved

**Table Rows with Accessible Names**

```html
<!-- If the table had proper ARIA: -->
<table role="table">
  <tbody role="rowgroup">
    <tr role="row" aria-label="Webhook: PW_INT_123">
      <td role="cell">PW_INT_123</td>
      <td role="cell">Webhook</td>
    </tr>
  </tbody>
</table>

<!-- Test would use: -->
<script>
  const webhookRow = page.getByRole('row', { name: /PW_INT_123/ });
</script>
```

**Tabs with Proper Roles**

```html
<!-- If tabs had proper ARIA: -->
<div role="tablist">
  <button role="tab" aria-selected="true">Webhooks</button>
  <button role="tab" aria-selected="false">Communications</button>
</div>

<!-- Test would use: -->
<script>
  const webhooksTab = page.getByRole('tab', { name: 'Webhooks' });
  await expect(webhooksTab).toHaveAttribute('aria-selected', 'true');
</script>
```

**Form Fields with Labels**

```html
<!-- If inputs had proper labels: -->
<label for="webhook-name">Integration name</label>
<input id="webhook-name" name="name" />

<!-- Or with aria-label: -->
<input name="name" aria-label="Integration name" />

<!-- Test would use: -->
<script>
  await page.getByLabel('Integration name').fill('My Webhook');
</script>
```

**Buttons with Descriptive Labels**

```html
<!-- If kebab menu had descriptive aria-label: -->
<button aria-label="Actions for PW_INT_123" class="pf-v6-c-menu-toggle">
  <MoreVertIcon />
</button>

<!-- Test would use: -->
<script>
  const actionsButton = webhookRow.getByRole('button', { name: /Actions for/ });
</script>
```

**OUIA-Enabled Components**

```html
<!-- If components used OUIA IDs: -->
<DataViewTable ouiaId="webhooks-table">
  <button ouiaId="create-webhook-btn">
    <MenuToggle ouiaId="{`actions-${integration.id}`}">
      <!-- Tests would use: -->
      <script>
        await page.getByTestId('webhooks-table').waitFor({ state: 'visible' });
        await page.getByTestId('create-webhook-btn').click();
        await page.getByTestId(`actions-${integrationId}`).click();
      </script></MenuToggle
    >
  </button></DataViewTable
>
```

## Recommendations for Product Team

To enable semantic selectors in tests, the following improvements would be needed:

### High Impact, Low Effort

1. **Add OUIA IDs to key components**

   ```tsx
   <DataViewTable ouiaId="integrations-table" />
   <Button ouiaId="create-integration" />
   <MenuToggle ouiaId={`actions-menu-${integration.id}`} />
   ```

2. **Add aria-labels to form inputs**

   ```tsx
   <TextInput aria-label="Integration name" />
   <TextInput aria-label="Webhook URL" />
   ```

3. **Use descriptive aria-labels for icon buttons**
   ```tsx
   <MenuToggle aria-label={`Actions for ${integration.name}`} />
   <Button aria-label="Delete integration" />
   ```

### Medium Impact, Medium Effort

4. **Ensure PatternFly Tabs use proper roles**

   - Verify `<Tabs>` component renders with `role="tablist"`
   - Verify `<Tab>` renders with `role="tab"`
   - This should be automatic with PF6, may need to verify implementation

5. **Associate labels with form fields**
   ```tsx
   <FormGroup label="Integration name" fieldId="integration-name">
     <TextInput id="integration-name" />
   </FormGroup>
   ```

### Low Impact, High Effort

6. **Add ARIA to table rows** (DataView may not support this)
   - Would require customization of PatternFly DataView
   - May not be worth the effort vs. using OUIA IDs

## Migration Path

When accessibility improvements are made, tests can be migrated incrementally:

```typescript
// Phase 1: Current state (CSS selectors + text)
const webhookRow = page.locator('tr', {
  has: page.locator(`text="${name}"`),
});

// Phase 2: OUIA IDs added
const webhooksTable = page.getByTestId('webhooks-table');
const webhookRow = webhooksTable.getByTestId(`integration-row-${id}`);

// Phase 3: Full semantic selectors (ideal)
const webhookRow = page.getByRole('row', { name: new RegExp(name) });
```

## Current Testing Strategy

**Until accessibility improvements are made, our tests use:**

1. **Role-based selectors** - Where roles exist (headings, buttons with text, menuitems)
2. **Text matching** - For unique text content (integration names, tab labels)
3. **CSS classes** - For PatternFly components without better selectors (`.pf-v6-c-menu-toggle`)
4. **Name/ID attributes** - For form inputs (`input[name="name"]`)
5. **OUIA attributes** - Where available (`[data-ouia-component-type="PF6/Table"]`)

This is **pragmatic** given current limitations, but semantic selectors should be the goal as the product's accessibility improves.
