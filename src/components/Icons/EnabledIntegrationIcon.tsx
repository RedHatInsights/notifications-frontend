import { Icon } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';

export const EnabledIntegrationIcon: React.FunctionComponent = () => {
  return (
    <Icon status="success">
      <CheckCircleIcon />
    </Icon>
  );
};
