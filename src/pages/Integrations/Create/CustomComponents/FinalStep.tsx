import React from 'react';
import CreatedStep from './CreatedStep';
import FailedStep from './FailedStep';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Spinner,
} from '@patternfly/react-core';

export type IntegrationsData = {
  url: string;
  type: string;
  sub_type?: string;
  name: string;
  secret_token?: string;
  isEdit?: boolean;
  template?: {
    id: string;
  };
  event_type_id: string;
  bundle_name: string;
};

interface ProgressProps {
  data: IntegrationsData;
  onCancel: () => void;
}

export const FinalStep: React.FunctionComponent<ProgressProps> = ({
  data,
  onCancel,
}) => {
  const [isFinished, setIsFinished] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const integrationsUrl = '/api/integrations/v1.0/endpoints';
  const behaviorGroupUrl = `/api/notifications/v1.0/notifications/behaviorGroups`;

  React.useEffect(() => {
    const createAction = async () => {
      try {
        const result = await (
          await fetch(
            `${integrationsUrl}${data.isEdit ? `/${data.template?.id}` : ''}`,
            {
              method: data.isEdit ? 'PUT' : 'POST',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
              },
              body: JSON.stringify({
                name: data.name,
                enabled: true,
                type: data.type,
                ...(data.sub_type && { sub_type: data.sub_type }),
                description: '',
                properties: {
                  method: 'POST',
                  url: data.url,
                  disable_ssl_verification: false,
                  secret_token: data.secret_token,
                },
              }),
            }
          )
        ).json();

        console.log(result, 'resultsss');

        await fetch(`${behaviorGroupUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bundle_name: [data.bundle_name],
            display_name: `${data?.name || ''} behavior group`,
            endpoint_ids: [result.id],
            // TODO: fill in event ids from data object
            id: [data.event_type_id],
          }),
        });
      } catch (e) {
        setHasError(true);
      }
      setIsFinished(true);
    };
    createAction();
  }, [behaviorGroupUrl, data]);

  console.log(data, 'ah');

  return isFinished ? (
    hasError ? (
      <FailedStep
        integrationName={data?.name || ''}
        behaviorGroupName={`${data?.name || ''} behavior group`}
        onClose={onCancel}
      />
    ) : (
      <CreatedStep
        integrationName={data?.name || ''}
        behaviorGroupName={`${data?.name || ''} behavior group`}
        onClose={onCancel}
      />
    )
  ) : (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText="Creating integration"
        headingLevel="h4"
        icon={<EmptyStateIcon icon={Spinner} />}
      />
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button
            variant="link"
            onClick={() => {
              onCancel();
            }}
          >
            {' '}
            Cancel
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default FinalStep;
