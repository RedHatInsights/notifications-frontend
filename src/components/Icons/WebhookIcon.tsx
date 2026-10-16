import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import * as React from 'react';
import { style } from 'typestyle';

import icon from './WebhookIcon.svg';

const WEBHOOK_ALT = 'Webhook';
const className = style({
  verticalAlign: '-0.125em',
  width: '1em',
  height: '1em',
});

export const WebhookIcon: React.FunctionComponent<SVGIconProps> = () => {
  return <img alt={WEBHOOK_ALT} className={className} src={icon} />;
};
