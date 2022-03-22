import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core/dist/js/components';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';
import { style } from 'typestyle';

interface ParentProps {
    className?: string,
    variant?: EmptyStateVariant,
    icon?: React.ComponentClass<any>
    title: string,
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
    description: string
}

const emptyStateClassName = style({
    backgroundColor: 'white'
});

export const EmptyStateSearch: React.FunctionComponent<ParentProps> = props => {
    return (
        <EmptyState className={ `${emptyStateClassName} ${props.className}` } variant={ props.variant }>
            <EmptyStateIcon icon={ props.icon ?? SearchIcon } />
            <Title headingLevel={ props.headingLevel ?? 'h3' }>{props.title}</Title>
            <EmptyStateBody>{props.description}</EmptyStateBody>
        </EmptyState>
    );
};
