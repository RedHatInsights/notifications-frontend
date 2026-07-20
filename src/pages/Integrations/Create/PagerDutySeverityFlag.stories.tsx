import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import { expect, waitFor, within } from 'storybook/test';
import { detailSteps } from './detailSteps';
import { PAGERDUTY_DETAILS } from './helpers';
import { useIntl } from 'react-intl';

const PagerDutyFormWrapper: React.FC<{ hideSeverity: boolean }> = ({ hideSeverity }) => {
  const intl = useIntl();
  const steps = detailSteps(false, false, intl, hideSeverity);
  const pagerDutyStep = steps.find((s) => s.name === PAGERDUTY_DETAILS);

  if (!pagerDutyStep) {
    return null;
  }

  const schema = {
    fields: [
      {
        component: 'sub-form',
        name: PAGERDUTY_DETAILS,
        fields: pagerDutyStep.fields,
      },
    ],
  };

  return (
    <FormRenderer
      schema={schema}
      componentMapper={componentMapper}
      onSubmit={() => {}}
      onCancel={() => {}}
      initialValues={{}}
    >
      {(props) => <Pf4FormTemplate {...props} showFormControls={false} />}
    </FormRenderer>
  );
};

const meta: Meta<typeof PagerDutyFormWrapper> = {
  title: 'Integrations/PagerDutySeverityFlag',
  component: PagerDutyFormWrapper,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof PagerDutyFormWrapper>;

export const SeverityFieldVisible: Story = {
  parameters: {
    featureFlags: {
      'platform.integrations.pager-duty.hide-severity': false,
    },
  },
  render: () => <PagerDutyFormWrapper hideSeverity={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText('Severity')).toBeVisible();
    });
    expect(canvas.getByText('Integration name')).toBeVisible();
    expect(canvas.getByText('Integration key')).toBeVisible();
  },
};

export const SeverityFieldHidden: Story = {
  parameters: {
    featureFlags: {
      'platform.integrations.pager-duty.hide-severity': true,
    },
  },
  render: () => <PagerDutyFormWrapper hideSeverity={true} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText('Integration name')).toBeVisible();
    });
    expect(canvas.getByText('Integration key')).toBeVisible();
    expect(canvas.queryByText('Severity')).not.toBeInTheDocument();
  },
};
