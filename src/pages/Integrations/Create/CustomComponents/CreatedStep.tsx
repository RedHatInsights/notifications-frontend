import {
  Button,
  EmptyState,
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
import { IntegrationsData } from './FinalStep';

interface ProgressProps {
  integrationName: string;
  behaviorGroupName: string;
  onClose: () => void;
  data: IntegrationsData;
}

export const CreatedStep: React.FunctionComponent<ProgressProps> = (props) => {
  const { isBeta, getBundle } = useChrome();
  const navigate = useNavigate();
  return (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText="Integration created"
        headingLevel="h4"
        icon={<EmptyStateIcon icon={CheckCircleIcon} color="green" />}
      />
      <EmptyStateBody>
        The integration <b>&apos;{props.integrationName}&apos;</b> was created
        successfully. The behavior group{' '}
        <b>&apos;{props.behaviorGroupName}&apos;</b> was created successfully.
        You can configure additional events in the Hybrid Cloud Console
        settings.
      </EmptyStateBody>
      <EmptyStateFooter>
        <Stack hasGutter>
          <StackItem>
            <Button
              variant="primary"
              component="a"
              href={`/${getBundle()}/integrations`}
              size="lg"
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
              }/${getBundle()}/notifications/configure-events?bundle=${
                props.data.bundle_name
              }&tab=behaviorGroups`}
              size="lg"
              onClick={(e) => {
                props.onClose();
                e.preventDefault();
                navigate(
                  `/${getBundle()}/notifications/configure-events?tab=behaviorGroups`
                );
              }}
            >
              View behavior group
            </Button>
          </StackItem>
        </Stack>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default CreatedStep;
