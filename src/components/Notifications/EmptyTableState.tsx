import React from 'react';
import {EmptyState, EmptyStateBody, EmptyStateIcon, Text, TextContent, Title} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

const EmptyTableState = () => {
  return (
    <EmptyState variant="full">
      <EmptyStateIcon className="pf-u-mb-xl" icon={SearchIcon} />
      <Title headingLevel="h2" size="lg">
        No results found
      </Title>
      <EmptyStateBody>
        <TextContent>
          <Text>No notifications match your filter choices above. Try removing or changing the filters to see results.</Text>
        </TextContent>
      </EmptyStateBody>
    </EmptyState>
  );
};

export default EmptyTableState;