import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';

interface EmptyStateSearchProps {
  className?: string;
  variant?: EmptyStateVariant;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentClass<any>;
  title: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  description: string;
}

export const EmptyStateSearch: React.FunctionComponent<
  EmptyStateSearchProps
> = (props) => {
  return (
    <EmptyState
      headingLevel={props.headingLevel ?? 'h3'}
      icon={props.icon ?? SearchIcon}
      titleText={<>{props.title}</>}
      className={`pf-v5-u-background-color-100 ${props.className}`}
      variant={props.variant}
    >
      <EmptyStateBody>{props.description}</EmptyStateBody>
    </EmptyState>
  );
};
