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
import { useIntl } from 'react-intl';

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
          title={intl.formatMessage({
            id: 'integrations.unauthorizedState.alertTitle',
            defaultMessage: 'Need to create an integration?',
          })}
          actionLinks={
            <AlertActionLink
              component="a"
              href="https://access.redhat.com/articles/6957948"
              target="_blank"
              rel="noopener noreferrer"
            >
              {intl.formatMessage({
                id: 'integrations.unauthorizedState.alertLink',
                defaultMessage: 'Learn about requesting access via the Virtual Assistant',
              })}
            </AlertActionLink>
          }
        >
          <Content>
            <Content component={ContentVariants.p}>
              {intl.formatMessage({
                id: 'integrations.unauthorizedState.alertParagraph',
                defaultMessage:
                  'You do not have the permissions for integration management. Contact your organization admin if you need these permissions updated.',
              })}
            </Content>
          </Content>
        </Alert>
      </StackItem>
      <StackItem>
        <Card isPlain>
          <CardBody className="pf-v5-u-text-align-center">
            <EmptyState
              headingLevel={ContentVariants.h2}
              icon={LockIcon}
              titleText={intl.formatMessage({
                id: 'integrations.unauthorizedState.heading',
                defaultMessage: 'No integrations available',
              })}
            >
              <EmptyStateBody>
                {intl.formatMessage({
                  id: 'integrations.unauthorizedState.description',
                  defaultMessage:
                    'You need read permissions to view integrations. Contact your organization administrator to request access.',
                })}
              </EmptyStateBody>
            </EmptyState>
          </CardBody>
        </Card>
      </StackItem>
    </Stack>
  );
};
