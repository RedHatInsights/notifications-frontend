import { Button, ButtonVariant } from '@patternfly/react-core';
import * as React from 'react';

export const ButtonLink: React.FunctionComponent<{ navigate: () => void }> = (props) => {
    return <Button variant={ ButtonVariant.secondary } onClick={ props.navigate }>{ props.children }</Button>;
};
