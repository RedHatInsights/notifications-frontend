import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';

const NotificationsLogEmptyState = () => {
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={SearchIcon} />
        <Title headingLevel="h2" size="lg">
          No results found
        </Title>
        <EmptyStateBody>Clear all filters and try again.</EmptyStateBody>
        <Button variant="link">Clear all filters</Button>
      </EmptyState>
    </Bullseye>
  );
};

export default NotificationsLogEmptyState;
