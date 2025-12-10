import { Content, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';

const EmptyTableState = () => {
  return (
    <EmptyState
      headingLevel="h2"
      icon={SearchIcon}
      titleText="No results found"
      variant="full"
    >
      <EmptyStateBody>
        <Content>
          <Content component="p">
            No notifications match your filter choices above. Try removing or
            changing the filters to see results.
          </Content>
        </Content>
      </EmptyStateBody>
    </EmptyState>
  );
};

export default EmptyTableState;
