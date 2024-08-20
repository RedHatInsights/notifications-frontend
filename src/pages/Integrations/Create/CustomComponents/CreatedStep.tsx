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
  hasBehaviorGroup: boolean;
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
        {props.hasBehaviorGroup ? (
          <span>
            The integration <b>&apos;{props.integrationName}&apos;</b> was
            created successfully. The behavior group{' '}
            <b>&apos;{props.behaviorGroupName}&apos;</b> was created
            successfully. You can configure additional events in the Hybrid
            Cloud Console settings.
          </span>
        ) : (
          <span>
            The integration <b>&apos;{props.integrationName}&apos;</b> was
            created successfully. You can configure additional events in the
            Hybrid Cloud Console settings.
          </span>
        )}
      </EmptyStateBody>
      <EmptyStateFooter>
        <Stack hasGutter>
          <StackItem>
            <Button
              variant="primary"
              component="a"
              size="lg"
              href={`/${getBundle()}/integrations`}
              onClick={() => {
                props.onClose();
                navigate(`/${getBundle()}/integrations`);
              }}
            >
              View integration
            </Button>
          </StackItem>
          <StackItem>
            {props.hasBehaviorGroup ? (
              <Button
                variant="link"
                component="a"
                href={`/${getBundle()}/notifications/configure-events?bundle=${
                  props.data.bundle_name
                }&tab=behaviorGroups`}
                onClick={() => {
                  navigate(
                    `/${getBundle()}/notifications/configure-events?bundle=${
                      props.data.bundle_name
                    }&tab=behaviorGroups`
                  );
                }}
                size="lg"
              >
                View behavior group
              </Button>
            ) : (
              ' '
            )}
          </StackItem>
        </Stack>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default CreatedStep;
