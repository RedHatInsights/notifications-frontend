import { Label, LabelProps, Tooltip } from '@patternfly/react-core';
import * as React from 'react';

interface GroupNotFoundProps {
  onClose?: LabelProps['onClose'];
}

export const GroupNotFound: React.FunctionComponent<GroupNotFoundProps> = (
  props
) => {
  const text = 'User Access group (Not found)';
  return (
    <Tooltip content="This User Access group was not found, and may have been deleted. Remove it from your behavior group to stop seeing it.">
      {props.onClose ? (
        <Label variant="outline" color="red" onClose={props.onClose}>
          {text}
        </Label>
      ) : (
        <span className="pf-v6-u-color-300"> {text} </span>
      )}
    </Tooltip>
  );
};
