import {
  ActionGroup,
  Button,
  CodeBlock,
  CodeBlockCode,
  Form,
  FormGroup,
  FormHelperText,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  List,
  ListItem,
  ListVariant,
  Popover,
  ProgressStepProps,
  TextInput,
  ValidatedOptions,
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, HelpIcon } from '@patternfly/react-icons';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { string } from 'yup';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { DOCUMENTATION_URL, OPEN_CASE_URL, SPLUNK_CLOUD_HEC_DOC } from './Constants';
import { useSplunkSetup } from './useSplunkSetup';
import { useNotification } from '../../../utils/AlertUtils';
import { extractErrorMessage } from '../../../utils/ErrorUtils';

// Rich-text values for popover (eslint-safe: JS strings not checked in jsx-only mode)

const BOLD_HOSTNAME = <b>hostname/IP Address</b>;
const BOLD_PORT = <b>port</b>;

const messages = defineMessages({
  urlLabel: {
    id: 'integrations.splunk.urlLabel',
    defaultMessage: 'Splunk HEC URL',
  },
  urlPopoverHeader: {
    id: 'integrations.splunk.urlPopover.header',
    defaultMessage: 'The server {hostname} and {port} of your splunk HTTP Event Collector',
  },
  urlPopoverBody: {
    id: 'integrations.splunk.urlPopover.body',
    defaultMessage:
      'For Splunk Enterprise the port is by default 8088. For Splunk Cloud Platform see {link}.',
  },
  urlPopoverLink: {
    id: 'integrations.splunk.urlPopover.link',
    defaultMessage: 'documentation',
  },
  urlPopoverAria: {
    id: 'integrations.splunk.urlPopover.aria',
    defaultMessage: 'More info for name field',
  },
  urlValidationError: {
    id: 'integrations.splunk.urlValidationError',
    defaultMessage: 'Invalid URL. Example: https://hostname:8088',
  },
  tokenLabel: {
    id: 'integrations.splunk.tokenLabel',
    defaultMessage: 'Splunk HEC Token',
  },
  tokenValidationError: {
    id: 'integrations.splunk.tokenValidationError',
    defaultMessage: 'Invalid HEC token. Example: 123e4567-e89b-12d3-a456-426614174000',
  },
  configInProgress: {
    id: 'integrations.splunk.configInProgress',
    defaultMessage: 'Configuration in progress',
  },
  nextReview: {
    id: 'integrations.splunk.nextReview',
    defaultMessage: 'Next: Review',
  },
  runConfiguration: {
    id: 'integrations.splunk.runConfiguration',
    defaultMessage: 'Run Configuration',
  },
  setupFailedTitle: {
    id: 'integrations.splunk.setupFailed.title',
    defaultMessage:
      'There was a problem processing the request. Please try again. If the problem persists, contact Red Hat support by opening the ticket.',
  },
  openTicket: {
    id: 'integrations.splunk.openTicket',
    defaultMessage: 'Open a Red Hat Support ticket',
  },
  goToDocs: {
    id: 'integrations.splunk.goToDocs',
    defaultMessage: 'Go to documentation',
  },
});

interface SplunkSetupFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  stepIsInProgress: boolean;
  setStepIsInProgress: Dispatch<SetStateAction<boolean>>;
  stepVariant: ProgressStepProps['variant'];
  setStepVariant: Dispatch<SetStateAction<ProgressStepProps['variant']>>;
  hecToken: string;
  setHecToken: Dispatch<SetStateAction<string>>;
  splunkServerHostName: string;
  setHostName: Dispatch<SetStateAction<string>>;
  automationLogs: React.ReactChild[];
  setAutomationLogs: Dispatch<SetStateAction<React.ReactChild[]>>;
  setError: Dispatch<SetStateAction<Error | undefined>>;
}

const SplunkURLSchema = string()
  .url()
  .test('has-no-path', 'URL contains path or parameters', (url) => {
    let urlObj;
    try {
      urlObj = new URL(url as string);
    } catch {
      return false;
    }

    return (urlObj.pathname === '/' || urlObj.pathname === '') && urlObj.search === '';
  });

export const SplunkSetupForm: React.FunctionComponent<SplunkSetupFormProps> = ({
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
}) => {
  const { addDangerNotification } = useNotification();
  const startSplunkAutomation = useSplunkSetup();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [validatedServerHostname, setValidatedServerHostname] = useState<ValidatedOptions>(
    ValidatedOptions.default
  );
  const [validatedHecToken, setValidatedHecToken] = useState<ValidatedOptions>(
    ValidatedOptions.default
  );

  const onHostnameChange = async (value) => {
    setHostName(value);
    if (value === '') {
      setValidatedServerHostname(ValidatedOptions.default);
    } else {
      const isValid = await SplunkURLSchema.isValid(value);
      setValidatedServerHostname(isValid ? ValidatedOptions.success : ValidatedOptions.error);
    }
  };

  const onHecTokenChange = async (value) => {
    setHecToken(value);
    if (value === '') {
      setValidatedHecToken(ValidatedOptions.default);
    } else {
      const isValid = await string().uuid().isValid(value);
      setValidatedHecToken(isValid ? ValidatedOptions.success : ValidatedOptions.error);
    }
  };

  useEffect(() => {
    if ([validatedServerHostname, validatedHecToken].every((v) => v === ValidatedOptions.success)) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [validatedServerHostname, validatedHecToken]);

  const onProgress = (message, className?) => {
    let newLog = message;
    if (className) {
      newLog = <span className={className}>{message}</span>;
    }

    setAutomationLogs((prevLogs) => [...prevLogs, newLog]);
  };

  const onStart = async () => {
    setStepIsInProgress(true);
    setAutomationLogs([]);

    try {
      await startSplunkAutomation({ hecToken, splunkServerHostName }, onProgress);
    } catch (error) {
      onProgress(`\nError: ${extractErrorMessage(error)}`, 'pf-v6-u-danger-color-200');
      setStepIsInProgress(false);
      setStepVariant('danger');

      addDangerNotification('Configuration failed', <SplunkSetupFailedToast />, true);
      setError(error as Error);
      return;
    }

    setIsDisabled(false);
    setStepIsInProgress(false);
    setStepVariant('success');
    onProgress('\nDONE!', 'pf-v6-u-success-color-200');
  };

  const intl = useIntl();

  const onFinish = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <Grid>
      <GridItem span={6}>
        <Form className="pf-v6-u-mr-md">
          <FormGroup
            label={intl.formatMessage(messages.urlLabel)}
            labelHelp={
              <Popover
                headerContent={
                  <div>
                    <FormattedMessage
                      {...messages.urlPopoverHeader}
                      values={{
                        hostname: BOLD_HOSTNAME,
                        port: BOLD_PORT,
                      }}
                    />
                  </div>
                }
                bodyContent={
                  <div>
                    <FormattedMessage
                      {...messages.urlPopoverBody}
                      values={{
                        link: (
                          <a target="_blank" rel="noreferrer" href={SPLUNK_CLOUD_HEC_DOC}>
                            {intl.formatMessage(messages.urlPopoverLink)}
                          </a>
                        ),
                      }}
                    />
                  </div>
                }
              >
                <button
                  type="button"
                  aria-label={intl.formatMessage(messages.urlPopoverAria)}
                  onClick={(e) => e.preventDefault()}
                  aria-describedby="splunk-server-hostname"
                  className="pf-c-form__group-label-help"
                >
                  <HelpIcon />
                </button>
              </Popover>
            }
            isRequired
            fieldId="splunk-server-hostname"
          >
            <TextInput
              isRequired
              type="text"
              id="splunk-server-hostname"
              name="splunk-server-hostname"
              aria-describedby="splunk-server-hostname-helper"
              value={splunkServerHostName}
              validated={validatedServerHostname}
              onChange={(_event, value) => onHostnameChange(value)}
            />
            {validatedServerHostname === 'error' && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant="error">
                    {intl.formatMessage(messages.urlValidationError)}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>
          <FormGroup
            label={intl.formatMessage(messages.tokenLabel)}
            fieldId="splunk-hec-token"
            isRequired
          >
            <TextInput
              isRequired
              type="text"
              id="splunk-hec-token"
              name="splunk-hec-token"
              aria-describedby="splunk-hec-token-helper"
              validated={validatedHecToken}
              value={hecToken}
              onChange={(_event, value) => onHecTokenChange(value)}
            />
            {validatedHecToken === 'error' && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant="error">
                    {intl.formatMessage(messages.tokenValidationError)}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>
          <ActionGroup>
            <SplunkAutomationButton
              {...{
                onStart,
                onFinish,
                stepIsInProgress,
                stepVariant,
                isDisabled,
              }}
            />
          </ActionGroup>
        </Form>
      </GridItem>

      <GridItem span={6}>
        <CodeBlock>
          <CodeBlockCode>{automationLogs}</CodeBlockCode>
        </CodeBlock>
      </GridItem>
    </Grid>
  );
};

const SplunkAutomationButton = ({
  onStart,
  onFinish,
  stepIsInProgress,
  stepVariant,
  isDisabled,
}) => {
  const intl = useIntl();
  if (stepIsInProgress) {
    return (
      <Button variant="primary" isLoading={true}>
        <FormattedMessage {...messages.configInProgress} />
      </Button>
    );
  } else if (stepVariant === 'success' || stepVariant === 'danger') {
    return (
      <Button variant="primary" onClick={onFinish}>
        {stepVariant === 'success' ? <CheckCircleIcon /> : <ExclamationCircleIcon />}{' '}
        {intl.formatMessage(messages.nextReview)}
      </Button>
    );
  } else {
    return (
      <Button variant="primary" isDisabled={isDisabled} onClick={onStart}>
        <FormattedMessage {...messages.runConfiguration} />
      </Button>
    );
  }
};

const SplunkSetupFailedToast = () => (
  <>
    <p className="pf-v6-u-mb-md">
      <FormattedMessage {...messages.setupFailedTitle} />
    </p>
    <List variant={ListVariant.inline}>
      <ListItem>
        <a target="_blank" rel="noopener noreferrer" href={OPEN_CASE_URL}>
          <FormattedMessage {...messages.openTicket} />
        </a>
      </ListItem>
      <ListItem>
        <a target="_blank" rel="noopener noreferrer" href={DOCUMENTATION_URL}>
          <FormattedMessage {...messages.goToDocs} />
        </a>
      </ListItem>
    </List>
  </>
);
