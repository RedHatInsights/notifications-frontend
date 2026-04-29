import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FilterDropdown } from './Dropdowns';
import { FilterConfigItem } from '../../types/Drawer';

const mockFilterConfig: FilterConfigItem[] = [
  { title: 'Red Hat Enterprise Linux', value: 'rhel' },
  { title: 'OpenShift', value: 'openshift' },
  { title: 'Ansible Automation Platform', value: 'ansible' },
  { title: 'Console', value: 'console' },
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
  render: () => <InteractiveFilterDropdown initialFilters={['rhel', 'openshift']} />,
  parameters: {
    docs: {
      description: {
        story:
          'Filter dropdown with filters selected (RHEL, OpenShift). Shows checked checkboxes with grey checkmarks (PatternFly limitation when using hasCheckbox + isSelected). The "Reset filters" link button is enabled.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => <InteractiveFilterDropdown initialFilters={['rhel']} isDisabled={true} />,
  parameters: {
    docs: {
      description: {
        story:
          'Filter dropdown in disabled state (e.g., when there are no notifications). All menu items are disabled and cannot be interacted with.',
      },
    },
  },
};
