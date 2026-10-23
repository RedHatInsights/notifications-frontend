import { HelperText, HelperTextItem } from '@patternfly/react-core';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { style } from 'typestyle';

const messages = defineMessages({
  degradedConnection: {
    id: 'status.degradedConnection',
    defaultMessage: 'Degraded connection',
  },
});

const degradedClassName = style({
  fontWeight: 600,
});

export interface DegradedProps {
  isDegraded?: boolean;
}

export const Degraded: React.FunctionComponent<React.PropsWithChildren<DegradedProps>> = (
  props
) => {
  const intl = useIntl();
  return (
    <>
      {props.children}
      {props.isDegraded && (
        <HelperText>
          <HelperTextItem className={degradedClassName} variant="warning">
            {intl.formatMessage(messages.degradedConnection)}
          </HelperTextItem>
        </HelperText>
      )}
    </>
  );
};
