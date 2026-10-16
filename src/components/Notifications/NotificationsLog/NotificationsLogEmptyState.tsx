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
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  noResults: {
    id: 'notificationsLog.emptyState.noResults',
    defaultMessage: 'No results found',
  },
  clearFiltersBody: {
    id: 'notificationsLog.emptyState.clearFiltersBody',
    defaultMessage: 'Clear all filters and try again.',
  },
  clearFilters: {
    id: 'notificationsLog.emptyState.clearFilters',
    defaultMessage: 'Clear all filters',
  },
});

const NotificationsLogEmptyState = () => {
  const intl = useIntl();
  return (
    <Bullseye>
      <EmptyState
        headingLevel="h2"
        icon={SearchIcon}
        titleText={intl.formatMessage(messages.noResults)}
        variant={EmptyStateVariant.sm}
      >
        <EmptyStateBody>{intl.formatMessage(messages.clearFiltersBody)}</EmptyStateBody>
        <EmptyStateFooter>
          <Button variant="link">{intl.formatMessage(messages.clearFilters)}</Button>
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
};

export default NotificationsLogEmptyState;
