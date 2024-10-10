import React from 'react';
import { Alert, AlertVariant } from '@patternfly/react-core';

const InlineAlert = ({
  variant,
  title,
}: {
  variant: AlertVariant;
  title: string;
}) => {
  return <Alert variant={variant} isInline isPlain title={title} />;
};

export default InlineAlert;
