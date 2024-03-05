import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  ButtonVariant,
  Modal,
  ModalVariant,
  TextInput,
} from '@patternfly/react-core';
import { useNotification } from '../../../utils/AlertUtils';
import { integrationTypes } from '../../../config/Config';
import { Link } from 'react-router-dom';
import { linkTo } from '../../../Routes';

const IntegrationTestModal = ({
  integrationId,
  integrationType,
  isModalOpen,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');
  const { addSuccessNotification, addWarningNotification } = useNotification();

  const placeholderText =
    'Congratulations! The integration was successfully tested!';

  const handleNotificationTest = async (
    notificationMessage: string,
    integrationType: string
  ) => {
    const body = { message: notificationMessage };
    const type = integrationTypes[integrationType].name;
    const testFailedMessage = `Test to integration ${type} failed`;

    try {
      const response = await axios.post(
        `/api/integrations/v1/endpoints/${integrationId}/test`,
        body
      );
      response?.status === 204
        ? addSuccessNotification(
            notificationMessage,
            <>
              Your test to integration {type} was successful. To view payload
              response check{' '}
              <Link to={`/settings/notifications${linkTo.eventLog()}`}>
                event log
              </Link>
              .
            </>
          )
        : addWarningNotification(
            testFailedMessage,
            response.data ||
              `Status: ${response.status} - ${response.statusText}`
          );
    } catch (error) {
      console.error(testFailedMessage, error);
      addWarningNotification(testFailedMessage, error?.toString());
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      title="Integration test"
      isOpen={isModalOpen}
      onClose={onClose}
      description="You can specify a custom message for the notification's payload. If you don't, a default message will be&nbsp;sent."
      actions={[
        <Button
          key="send"
          onClick={() =>
            handleNotificationTest(
              inputValue || placeholderText,
              integrationType
            )
          }
        >
          Send
        </Button>,
        <Button key="cancel" onClick={onClose} variant={ButtonVariant.link}>
          Cancel
        </Button>,
      ]}
    >
      <TextInput
        value={inputValue}
        onChange={setInputValue}
        aria-label="Test notification input"
        placeholder={placeholderText}
      />
    </Modal>
  );
};

export default IntegrationTestModal;
