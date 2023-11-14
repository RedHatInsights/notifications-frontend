import { Label, LabelProps, Tooltip } from '@patternfly/react-core';
import { global_palette_black_500 } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

interface GroupNotFoundProps {
  onClose?: LabelProps['onClose'];
}

const greyColor = style({
  color: global_palette_black_500.value,
});

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
        <span className={greyColor}> {text} </span>
      )}
    </Tooltip>
  );
};
