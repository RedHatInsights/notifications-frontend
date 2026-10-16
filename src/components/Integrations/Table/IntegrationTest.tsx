import React, { useState } from 'react';
import axios from 'axios';
import { Button, ButtonVariant, TextInput } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useNotification } from '../../../utils/AlertUtils';
import { integrationTypes } from '../../../config/Config';
import { Link } from 'react-router-dom';
import { linkTo } from '../../../Routes';

const messages = defineMessages({
  title: {
    id: 'integrations.test.title',
    defaultMessage: 'Integration test',
  },
  description: {
    id: 'integrations.test.description',
    defaultMessage:
      "You can specify a custom message for the notification's payload. If you don't, a default message will be\u00A0sent.",
  },
  send: {
    id: 'integrations.test.send',
    defaultMessage: 'Send',
  },
  cancel: {
    id: 'integrations.test.cancel',
    defaultMessage: 'Cancel',
  },
  inputAria: {
    id: 'integrations.test.inputAria',
    defaultMessage: 'Test notification input',
  },
  placeholder: {
    id: 'integrations.test.placeholder',
    defaultMessage: 'Congratulations! The integration was successfully tested!',
  },
  successBody: {
    id: 'integrations.test.successBody',
    defaultMessage:
      'Your test to integration {type} was successful. To view payload response check {link}.',
  },
  eventLogLink: {
    id: 'integrations.test.eventLogLink',
    defaultMessage: 'event log',
  },
  testFailedTitle: {
    id: 'integrations.test.testFailedTitle',
    defaultMessage: 'Test to integration {type} failed',
  },
  statusFallback: {
    id: 'integrations.test.statusFallback',
    defaultMessage: 'Status: {status} - {statusText}',
  },
});

const IntegrationTestModal = ({ integrationId, integrationType, isModalOpen, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const { addSuccessNotification, addWarningNotification } = useNotification();
  const intl = useIntl();

  const handleNotificationTest = async (notificationMessage: string, integrationType: string) => {
    const body = { message: notificationMessage };
    const type = integrationTypes[integrationType].name;
    const testFailedMessage = intl.formatMessage(messages.testFailedTitle, { type });

    try {
      const response = await axios.post(
        `/api/integrations/v1/endpoints/${integrationId}/test`,
        body
      );
      response?.status === 204
        ? addSuccessNotification(
            notificationMessage,
            <FormattedMessage
              {...messages.successBody}
              values={{
                type,
                link: (
                  <Link to={`/settings/notifications${linkTo.eventLog()}`}>
                    {intl.formatMessage(messages.eventLogLink)}
                  </Link>
                ),
              }}
            />
          )
        : addWarningNotification(
            testFailedMessage,
            response.data ||
              intl.formatMessage(messages.statusFallback, {
                status: response.status,
                statusText: response.statusText,
              })
          );
    } catch (error) {
      addWarningNotification(testFailedMessage, error?.toString());
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      title={intl.formatMessage(messages.title)}
      isOpen={isModalOpen}
      onClose={onClose}
      description={intl.formatMessage(messages.description)}
      actions={[
        <Button
          key="send"
          onClick={() =>
            handleNotificationTest(
              inputValue || intl.formatMessage(messages.placeholder),
              integrationType
            )
          }
        >
          {intl.formatMessage(messages.send)}
        </Button>,
        <Button key="cancel" onClick={onClose} variant={ButtonVariant.link}>
          {intl.formatMessage(messages.cancel)}
        </Button>,
      ]}
    >
      <TextInput
        value={inputValue}
        onChange={(_event, value) => setInputValue(value)}
        aria-label={intl.formatMessage(messages.inputAria)}
        placeholder={intl.formatMessage(messages.placeholder)}
      />
    </Modal>
  );
};

export default IntegrationTestModal;
