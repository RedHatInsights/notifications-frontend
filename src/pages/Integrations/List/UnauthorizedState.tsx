import {
  Alert,
  AlertActionLink,
  Card,
  CardBody,
  Content,
  ContentVariants,
  EmptyState,
  EmptyStateBody,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  alertTitle: {
    id: 'integrations.unauthorizedState.alertTitle',
    defaultMessage: 'Need to create an integration?',
  },
  alertLink: {
    id: 'integrations.unauthorizedState.alertLink',
    defaultMessage: 'Learn about requesting access via the Virtual Assistant',
  },
  alertParagraph: {
    id: 'integrations.unauthorizedState.alertParagraph',
    defaultMessage:
      'You do not have the permissions for integration management. Contact your organization admin if you need these permissions updated.',
  },
  heading: {
    id: 'integrations.unauthorizedState.heading',
    defaultMessage: 'No integrations available',
  },
  description: {
    id: 'integrations.unauthorizedState.description',
    defaultMessage:
      'You need read permissions to view integrations. Contact your organization administrator to request access.',
  },
});

export const UnauthorizedState: React.FunctionComponent = () => {
  const intl = useIntl();

  return (
    <Stack hasGutter>
      <StackItem>
        <Alert
          customIcon={<LockIcon />}
          variant="info"
          isInline
          isExpandable
          title={intl.formatMessage(messages.alertTitle)}
          actionLinks={
            <AlertActionLink
              component="a"
              href="https://access.redhat.com/articles/6957948"
              target="_blank"
              rel="noopener noreferrer"
            >
              {intl.formatMessage(messages.alertLink)}
            </AlertActionLink>
          }
        >
          <Content>
            <Content component={ContentVariants.p}>
              {intl.formatMessage(messages.alertParagraph)}
            </Content>
          </Content>
        </Alert>
      </StackItem>
      <StackItem>
        <Card isPlain>
          <CardBody className="pf-v6-u-text-align-center">
            <EmptyState
              headingLevel={ContentVariants.h2}
              icon={LockIcon}
              titleText={intl.formatMessage(messages.heading)}
            >
              <EmptyStateBody>{intl.formatMessage(messages.description)}</EmptyStateBody>
            </EmptyState>
          </CardBody>
        </Card>
      </StackItem>
    </Stack>
  );
};
