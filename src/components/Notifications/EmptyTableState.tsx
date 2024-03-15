import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';

const EmptyTableState = () => {
  return (
    <EmptyState variant="full">
      <EmptyStateHeader
        titleText="No results found"
        icon={<EmptyStateIcon className="pf-u-mb-xl" icon={SearchIcon} />}
        headingLevel="h2"
      />
      <EmptyStateBody>
        <TextContent>
          <Text>
            No notifications match your filter choices above. Try removing or
            changing the filters to see results.
          </Text>
        </TextContent>
      </EmptyStateBody>
    </EmptyState>
  );
};

export default EmptyTableState;
