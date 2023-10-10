import { Button, ButtonProps } from '@patternfly/react-core';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

type ButtonLinkProps = ButtonProps & Omit<LinkProps, 'component'>;

export const ButtonLink: React.FunctionComponent<ButtonLinkProps> = ({ to, ...props }) => {
    const { getBundle } = useChrome();
    return <Link to={ `/${getBundle()}/notifications${to}` }>
        <Button { ...props } >
            { props.children }
        </Button>
    </Link>;
};
