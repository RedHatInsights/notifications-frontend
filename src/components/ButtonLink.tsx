import { Button, ButtonProps } from '@patternfly/react-core';
import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

type ButtonLinkProps = ButtonProps & Omit<LinkProps, 'component'>;

export const ButtonLink: React.FunctionComponent<ButtonLinkProps> = props => {

    const InternalButtonLink: React.FunctionComponent<{ navigate: () => void }> = internalProps => {
        return <Button { ...props } onClick={ internalProps.navigate }>
            { props.children }
        </Button>;
    };

    return <Link { ...props } component={ InternalButtonLink }>
        { props.children }
    </Link>;
};
