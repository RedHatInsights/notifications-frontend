import { Content, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  noResults: {
    id: 'notifications.emptyTable.noResults',
    defaultMessage: 'No results found',
  },
  noMatch: {
    id: 'notifications.emptyTable.noMatch',
    defaultMessage:
      'No notifications match your filter choices above. Try removing or changing the filters to see results.',
  },
});

const EmptyTableState = () => {
  const intl = useIntl();
  return (
    <EmptyState
      headingLevel="h2"
      icon={SearchIcon}
      titleText={intl.formatMessage(messages.noResults)}
      variant="full"
    >
      <EmptyStateBody>
        <Content>
          <Content component="p">{intl.formatMessage(messages.noMatch)}</Content>
        </Content>
      </EmptyStateBody>
    </EmptyState>
  );
};

export default EmptyTableState;
