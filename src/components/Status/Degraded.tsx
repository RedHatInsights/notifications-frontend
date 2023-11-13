import { HelperText, HelperTextItem } from '@patternfly/react-core';
import * as React from 'react';
import { style } from 'typestyle';
const degradedClassName = style({
  fontWeight: 600,
});

export interface DegradedProps {
  isDegraded?: boolean;
}

export const Degraded: React.FunctionComponent<DegradedProps> = (props) => (
  <>
    {props.children}
    {props.isDegraded && (
      <HelperText>
        <HelperTextItem className={degradedClassName} variant="warning">
          Degraded connection
        </HelperTextItem>
      </HelperText>
    )}
  </>
);
