import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { EnabledIntegrationIcon } from './EnabledIntegrationIcon';
import { DisabledIntegrationIcon } from './DisabledIntegrationIcon';
import { Split, SplitItem, Text, TextContent } from '@patternfly/react-core';

const meta: Meta<typeof EnabledIntegrationIcon> = {
  title: 'Components/Icons/EnabledIntegrationIcon',
  component: EnabledIntegrationIcon,
  parameters: {
    docs: {
      description: {
        component: `
**EnabledIntegrationIcon** displays a success check icon indicating an enabled integration.

## Usage
Used in integration tables and cards to visually indicate the enabled/disabled status of integrations.

### Related Components
- \`DisabledIntegrationIcon\` - Shows a disabled/inactive state
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EnabledIntegrationIcon>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The enabled integration icon with success styling.',
      },
    },
  },
};

export const WithLabel: Story = {
  render: () => (
    <Split hasGutter>
      <SplitItem>
        <EnabledIntegrationIcon />
      </SplitItem>
      <SplitItem>
        <TextContent>
          <Text>Integration Enabled</Text>
        </TextContent>
      </SplitItem>
    </Split>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon displayed alongside a text label.',
      },
    },
  },
};

export const ComparisonWithDisabled: Story = {
  render: () => (
    <Split hasGutter>
      <SplitItem>
        <Split hasGutter>
          <SplitItem>
            <EnabledIntegrationIcon />
          </SplitItem>
          <SplitItem>
            <TextContent>
              <Text>Enabled</Text>
            </TextContent>
          </SplitItem>
        </Split>
      </SplitItem>
      <SplitItem>
        <Split hasGutter>
          <SplitItem>
            <DisabledIntegrationIcon />
          </SplitItem>
          <SplitItem>
            <TextContent>
              <Text>Disabled</Text>
            </TextContent>
          </SplitItem>
        </Split>
      </SplitItem>
    </Split>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of enabled and disabled states.',
      },
    },
  },
};
