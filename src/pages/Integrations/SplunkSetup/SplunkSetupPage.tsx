import {
  Button,
  Card,
  CardBody,
  Divider,
  Popover,
  ProgressStep,
  ProgressStepProps,
  ProgressStepper,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon, HelpIcon, InProgressIcon } from '@patternfly/react-icons';
import PageHeaderTitle from '@redhat-cloud-services/frontend-components/PageHeader/PageHeaderTitle';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader/PageHeader';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { DOCUMENTATION_URL } from './Constants';
import { SplunkSetupFinished } from './SplunkSetupFinished';
import { SplunkSetupForm } from './SplunkSetupForm';

const messages = defineMessages({
  title: {
    id: 'integrations.splunkSetupPage.title',
    defaultMessage: 'Red Hat Insights integration for Splunk',
  },
  helpPopoverBody: {
    id: 'integrations.splunkSetupPage.helpPopover.body',
    defaultMessage:
      'Configure the integration between your Splunk instance and Red Hat Insights to allow you to receive events from Insights.',
  },
  learnMore: {
    id: 'integrations.splunkSetupPage.learnMore',
    defaultMessage: 'Learn more',
  },
  helpAria: {
    id: 'integrations.splunkSetupPage.helpAria',
    defaultMessage: 'Help description',
  },
  description: {
    id: 'integrations.splunkSetupPage.description',
    defaultMessage:
      'To finish the Splunk configuration, follow the instructions to start the automation process.',
  },
  step1Title: {
    id: 'integrations.splunkSetupPage.step1.title',
    defaultMessage: 'Step 1',
  },
  step1Description: {
    id: 'integrations.splunkSetupPage.step1.description',
    defaultMessage: 'Create Index and HEC',
  },
  step1Aria: {
    id: 'integrations.splunkSetupPage.step1.aria',
    defaultMessage: 'completed Splunk app step (step 1)',
  },
  step2Title: {
    id: 'integrations.splunkSetupPage.step2.title',
    defaultMessage: 'Step 2',
  },
  step2Description: {
    id: 'integrations.splunkSetupPage.step2.description',
    defaultMessage: 'Configure Splunk integration in Insights',
  },
  step2Aria: {
    id: 'integrations.splunkSetupPage.step2.aria',
    defaultMessage: 'setup step (step 2)',
  },
  step3Title: {
    id: 'integrations.splunkSetupPage.step3.title',
    defaultMessage: 'Step 3',
  },
  step3Description: {
    id: 'integrations.splunkSetupPage.step3.description',
    defaultMessage: 'Review',
  },
  step3Aria: {
    id: 'integrations.splunkSetupPage.step3.aria',
    defaultMessage: 'review step (step 3)',
  },
});

const SplunkSetupTitle: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <>
      <PageHeaderTitle
        title={
          <>
            {intl.formatMessage(messages.title)}
            <Popover
              bodyContent={intl.formatMessage(messages.helpPopoverBody)}
              footerContent={
                <a target="_blank" rel="noopener noreferrer" href={DOCUMENTATION_URL}>
                  {intl.formatMessage(messages.learnMore)} <ExternalLinkSquareAltIcon />
                </a>
              }
            >
              <Button
                icon={<HelpIcon />}
                variant="plain"
                aria-label={intl.formatMessage(messages.helpAria)}
                className="title-help-label"
              />
            </Popover>
          </>
        }
      />
      {intl.formatMessage(messages.description)}
    </>
  );
};

export const SplunkSetupPage: React.FunctionComponent = () => {
  const [step, setStep] = useState(2);
  const [stepIsInProgress, setStepIsInProgress] = useState(false);
  const [stepVariant, setStepVariant] = useState<ProgressStepProps['variant']>('info');

  const [hecToken, setHecToken] = useState('');
  const [splunkServerHostName, setHostName] = useState('');
  const [automationLogs, setAutomationLogs] = useState<React.ReactChild[]>([
    `Logs from the automation would appear here\n`,
  ]);
  const [error, setError] = useState<Error | undefined>();
  const intl = useIntl();

  return (
    <>
      <PageHeader>
        <SplunkSetupTitle />
      </PageHeader>
      <Card>
        <CardBody>
          <Split hasGutter>
            <SplitItem>
              <ProgressStepper isVertical>
                <ProgressStep
                  isCurrent={step === 1}
                  variant="success"
                  description={intl.formatMessage(messages.step1Description)}
                  id="step1-splunk-app-step"
                  titleId="step1-splunk-app-step"
                  aria-label={intl.formatMessage(messages.step1Aria)}
                >
                  {intl.formatMessage(messages.step1Title)}
                </ProgressStep>
                <ProgressStep
                  isCurrent={step === 2}
                  icon={step === 2 && stepIsInProgress ? <InProgressIcon /> : undefined}
                  variant={step < 2 ? 'info' : stepVariant}
                  description={intl.formatMessage(messages.step2Description)}
                  id="step2-setup-step"
                  titleId="step2-setup-step"
                  aria-label={intl.formatMessage(messages.step2Aria)}
                >
                  {intl.formatMessage(messages.step2Title)}
                </ProgressStep>
                <ProgressStep
                  isCurrent={step === 3}
                  variant={step < 3 ? 'pending' : stepVariant}
                  description={intl.formatMessage(messages.step3Description)}
                  id="step3-review-step"
                  titleId="step3-review-step"
                  aria-label={intl.formatMessage(messages.step3Aria)}
                >
                  {intl.formatMessage(messages.step3Title)}
                </ProgressStep>
              </ProgressStepper>
            </SplitItem>
            <Divider orientation={{ default: 'vertical' }} />
            <SplitItem isFilled>
              {step === 2 && (
                <SplunkSetupForm
                  {...{
                    setStep,
                    stepIsInProgress,
                    setStepIsInProgress,
                    stepVariant,
                    setStepVariant,
                    hecToken,
                    setHecToken,
                    splunkServerHostName,
                    setHostName,
                    automationLogs,
                    setAutomationLogs,
                    setError,
                  }}
                />
              )}
              {step === 3 && (
                <SplunkSetupFinished isSuccess={stepVariant === 'success'} error={error} />
              )}
            </SplitItem>
          </Split>
        </CardBody>
      </Card>
    </>
  );
};
