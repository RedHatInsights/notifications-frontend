import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import { FilterDropdown } from './Dropdowns';
import { FilterConfigItem } from '../../types/Drawer';

// Mock bundle UUIDs (production values from backend)
const BUNDLE_UUIDS = {
  rhel: 'b63d98cf-4679-4d59-b7c2-4f5d85f8e5a2',
  openshift: 'a24c7fb1-3eb9-4c7d-9a4f-6e9c8d2b4f1a',
  ansible: 'f3e4d5c6-b7a8-9f0e-1d2c-3b4a5f6e7d8c',
  console: 'e8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b',
};

const mockFilterConfig: FilterConfigItem[] = [
  { title: 'Red Hat Enterprise Linux', value: BUNDLE_UUIDS.rhel },
  { title: 'OpenShift', value: BUNDLE_UUIDS.openshift },
  { title: 'Ansible Automation Platform', value: BUNDLE_UUIDS.ansible },
  { title: 'Console', value: BUNDLE_UUIDS.console },
];

const InteractiveFilterDropdown = ({
  initialFilters = [],
  isDisabled = false,
}: {
  initialFilters?: string[];
  isDisabled?: boolean;
}) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>(initialFilters);

  const onFilterSelect = (chosenFilter: string) => {
    setActiveFilters((prev) =>
      prev.includes(chosenFilter)
        ? prev.filter((filter) => filter !== chosenFilter)
        : [...prev, chosenFilter]
    );
  };

  return (
    <FilterDropdown
      isFilterDropdownOpen={isFilterDropdownOpen}
      setIsFilterDropdownOpen={setIsFilterDropdownOpen}
      filterConfig={mockFilterConfig}
      isDisabled={isDisabled}
      activeFilters={activeFilters}
      setActiveFilters={setActiveFilters}
      onFilterSelect={onFilterSelect}
    />
  );
};

const meta: Meta<typeof FilterDropdown> = {
  title: 'Components/FilterDropdown',
  component: FilterDropdown,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilterDropdown>;

export const NoFiltersSelected: Story = {
  render: () => <InteractiveFilterDropdown />,
  parameters: {
    docs: {
      description: {
        story:
          'Filter dropdown with no filters selected. The "Reset filters" button in the footer is disabled.',
      },
    },
  },
};

export const WithFiltersSelected: Story = {
  render: () => (
    <InteractiveFilterDropdown initialFilters={[BUNDLE_UUIDS.rhel, BUNDLE_UUIDS.openshift]} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Filter dropdown with filters selected (RHEL, OpenShift). Shows checked checkboxes with grey checkmarks (PatternFly limitation when using hasCheckbox + isSelected). The "Reset filters" link button is enabled.',
      },
    },
  },
};

export const MultiSelectBehavior: Story = {
  render: () => <InteractiveFilterDropdown />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates multi-select behavior: clicking multiple filters keeps the dropdown open and accumulates selections. The dropdown remains open to allow selecting multiple bundles.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initially no filters selected
    const rhelCheckbox = canvas.getByRole('menuitemcheckbox', { name: 'Red Hat Enterprise Linux' });
    expect(rhelCheckbox).not.toBeChecked();

    // Click RHEL filter
    await userEvent.click(rhelCheckbox);
    expect(rhelCheckbox).toBeChecked();

    // Click OpenShift filter - dropdown should stay open
    const openshiftCheckbox = canvas.getByRole('menuitemcheckbox', { name: 'OpenShift' });
    await userEvent.click(openshiftCheckbox);

    // Both should be checked
    expect(rhelCheckbox).toBeChecked();
    expect(openshiftCheckbox).toBeChecked();

    // Click Ansible - all three should be checked
    const ansibleCheckbox = canvas.getByRole('menuitemcheckbox', {
      name: 'Ansible Automation Platform',
    });
    await userEvent.click(ansibleCheckbox);

    expect(rhelCheckbox).toBeChecked();
    expect(openshiftCheckbox).toBeChecked();
    expect(ansibleCheckbox).toBeChecked();

    // Uncheck RHEL - others should remain checked
    await userEvent.click(rhelCheckbox);
    expect(rhelCheckbox).not.toBeChecked();
    expect(openshiftCheckbox).toBeChecked();
    expect(ansibleCheckbox).toBeChecked();
  },
};

export const Disabled: Story = {
  render: () => (
    <InteractiveFilterDropdown initialFilters={[BUNDLE_UUIDS.rhel]} isDisabled={true} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Filter dropdown in disabled state (e.g., when there are no notifications). All menu items are disabled and cannot be interacted with.',
      },
    },
  },
};
