import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProgressProps {
  integrationName: string;
  behaviorGroupName: string;
  onClose: () => void;
}

export const CreatedStep: React.FunctionComponent<ProgressProps> = (props) => {
  const { isBeta, getBundle } = useChrome();
  const navigate = useNavigate();
  return (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText="Integration created"
        headingLevel="h4"
        icon={<EmptyStateIcon icon={CheckCircleIcon} />}
      />
      <EmptyStateBody>
        The integration ${props.integrationName} was created successfully. The
        behavior group ${props.behaviorGroupName} was created successfully. You
        can configure additional events in the Hybrid Cloud Console settings.
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Stack hasGutter>
            <StackItem>
              <Button
                variant="primary"
                component="a"
                href={`${
                  isBeta() ? '/preview' : ''
                }/${getBundle()}/settings/integrations`}
                size="lg"
                onClick={(e) => {
                  props.onClose();
                  e.preventDefault();
                  navigate(`/${getBundle()}/settings/integrations`);
                }}
              >
                View integration
              </Button>
            </StackItem>
            <StackItem>
              <Button
                variant="link"
                component="a"
                href={`${
                  isBeta() ? '/preview' : ''
                }/${getBundle()}/notifications/configure-events`}
                size="lg"
                onClick={(e) => {
                  props.onClose();
                  e.preventDefault();
                  navigate(`/${getBundle()}/notifications/configure-events`);
                }}
              >
                View behavior group
              </Button>
            </StackItem>
          </Stack>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default CreatedStep;
