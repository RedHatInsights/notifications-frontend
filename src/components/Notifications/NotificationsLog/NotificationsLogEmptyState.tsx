import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';

const NotificationsLogEmptyState = () => {
  return (
    <Bullseye>
      <EmptyState
        headingLevel="h2"
        icon={SearchIcon}
        titleText="No results found"
        variant={EmptyStateVariant.sm}
      >
        <EmptyStateBody>Clear all filters and try again.</EmptyStateBody>
        <EmptyStateFooter>
          <Button variant="link">Clear all filters</Button>
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
};

export default NotificationsLogEmptyState;
