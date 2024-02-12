import { Button, ButtonVariant, Spinner } from '@patternfly/react-core';
import * as React from 'react';

import { IntegrationRef } from '../../types/Notification';

interface AddNotificationBodyProps {
  integration: IntegrationRef;
  isLoading: boolean;
  switchEnabled: () => void;
}

export const AddNotificationBody: React.FunctionComponent<
  AddNotificationBodyProps
> = (props) => {
  const text = props.integration.isEnabled
    ? 'This integration is enabled and ready to use.'
    : 'This integration is disabled.';
  const buttonText = props.integration.isEnabled
    ? 'Disable integration'
    : 'Enable integration';

  return (
    <>
      <div>{text}</div>
      <Button
        className="pf-v5-u-pl-0"
        isDisabled={props.isLoading}
        variant={ButtonVariant.link}
        onClick={props.switchEnabled}
      >
        {buttonText}
      </Button>
      {props.isLoading && <Spinner size="sm" />}
    </>
  );
};
