import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal, TextInput } from '@patternfly/react-core';
import { useNotification } from '../../../utils/AlertUtils';

const IntegrationTestModal = ({ integrationUUID }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const { addSuccessNotification, addWarningNotification } = useNotification();

  const placeholderText =
    'Congratulations! The integration you created on https://console.redhat.com was successfully tested!';

  const failedTestText =
    'Your integration test has unfortunately failed, please verify your integration information.';

  const handleModalCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleNotificationTest = async (notificationMessage: string) => {
    const endpointURL = `/api/integrations/v1/endpoints/${integrationUUID}/test`;

    const body = { message: notificationMessage };

    try {
      const response = await axios.post(endpointURL, body);
      response?.status === 204
        ? addSuccessNotification('Integration Test', notificationMessage)
        : addWarningNotification(
            'Failed Test',
            `Error through server response: ${response.status}`
          );

      console.log('Succesful request. Response data:', response);
    } catch (error) {
      console.error('\nError sending test notification:', error);

      const responseString = `${failedTestText} ${error}`;
      addWarningNotification('Failed Test', responseString);
    }

    handleModalCancel();
  };

  return (
    <Modal
      title="Integration Test"
      isOpen={isModalOpen}
      onClose={handleModalCancel}
      description="You can specify a custom message for the notification's payload. If you don't, the default message will be sent"
      actions={[
        <Button
          key="test"
          onClick={() => handleNotificationTest(inputValue || placeholderText)}
        >
          Test
        </Button>,
        <Button key="cancel" onClick={handleModalCancel}>
          Cancel
        </Button>,
      ]}
    >
      <TextInput
        value={inputValue}
        onChange={(value) => setInputValue(value)}
        aria-label="Test notifications input"
        placeholder={placeholderText}
      />
    </Modal>
  );
};

export default IntegrationTestModal;
