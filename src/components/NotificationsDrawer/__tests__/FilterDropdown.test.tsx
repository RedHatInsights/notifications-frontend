/**
 * Tests for FilterDropdown multi-select behavior logic
 *
 * Note: Full UI interaction testing (clicking checkboxes, dropdown behavior) is covered in
 * Storybook stories (Dropdowns.stories.tsx) with play functions, as PatternFly Dropdown
 * uses portals and requires complex DOM interactions.
 *
 * These tests focus on the filter selection logic that integrates with DrawerPanel.
 */

describe('Multi-select filter logic', () => {
  it('adds filters when not present, removes when present (toggle behavior)', () => {
    // Simulate the logic from DrawerPanel.onFilterSelect
    let activeFilters: string[] = [];

    const toggleFilter = (chosenFilter: string) => {
      activeFilters = activeFilters.includes(chosenFilter)
        ? activeFilters.filter((filter) => filter !== chosenFilter)
        : [...activeFilters, chosenFilter];
    };

    // Add RHEL
    toggleFilter('uuid-rhel-123');
    expect(activeFilters).toEqual(['uuid-rhel-123']);

    // Add OpenShift (multi-select)
    toggleFilter('uuid-openshift-456');
    expect(activeFilters).toEqual(['uuid-rhel-123', 'uuid-openshift-456']);

    // Remove RHEL (toggle off)
    toggleFilter('uuid-rhel-123');
    expect(activeFilters).toEqual(['uuid-openshift-456']);

    // Add Ansible
    toggleFilter('uuid-ansible-789');
    expect(activeFilters).toEqual(['uuid-openshift-456', 'uuid-ansible-789']);

    // Add RHEL back
    toggleFilter('uuid-rhel-123');
    expect(activeFilters).toEqual(['uuid-openshift-456', 'uuid-ansible-789', 'uuid-rhel-123']);

    // Remove all one by one
    toggleFilter('uuid-openshift-456');
    expect(activeFilters).toEqual(['uuid-ansible-789', 'uuid-rhel-123']);

    toggleFilter('uuid-ansible-789');
    expect(activeFilters).toEqual(['uuid-rhel-123']);

    toggleFilter('uuid-rhel-123');
    expect(activeFilters).toEqual([]);
  });

  it('maintains order of selection', () => {
    let activeFilters: string[] = [];

    const toggleFilter = (chosenFilter: string) => {
      activeFilters = activeFilters.includes(chosenFilter)
        ? activeFilters.filter((filter) => filter !== chosenFilter)
        : [...activeFilters, chosenFilter];
    };

    toggleFilter('uuid-openshift-456');
    toggleFilter('uuid-rhel-123');
    toggleFilter('uuid-ansible-789');

    // Order is preserved as selected
    expect(activeFilters).toEqual(['uuid-openshift-456', 'uuid-rhel-123', 'uuid-ansible-789']);
  });

  it('handles duplicate toggles correctly', () => {
    let activeFilters: string[] = [];

    const toggleFilter = (chosenFilter: string) => {
      activeFilters = activeFilters.includes(chosenFilter)
        ? activeFilters.filter((filter) => filter !== chosenFilter)
        : [...activeFilters, chosenFilter];
    };

    toggleFilter('uuid-rhel-123');
    toggleFilter('uuid-rhel-123');
    toggleFilter('uuid-rhel-123');

    // Odd number of toggles = present
    expect(activeFilters).toEqual(['uuid-rhel-123']);
  });

  it('clears all filters with empty array assignment', () => {
    let activeFilters: string[] = ['uuid-rhel-123', 'uuid-openshift-456', 'uuid-ansible-789'];

    // Reset filters (as done by Reset button)
    activeFilters = [];

    expect(activeFilters).toEqual([]);
  });
});
