import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';

const NotificationsLogEmptyState = () => {
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.sm}>
        <EmptyStateHeader
          titleText="No results found"
          icon={<EmptyStateIcon icon={SearchIcon} />}
          headingLevel="h2"
        />
        <EmptyStateBody>Clear all filters and try again.</EmptyStateBody>
        <EmptyStateFooter>
          <Button variant="link">Clear all filters</Button>
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
};

export default NotificationsLogEmptyState;
