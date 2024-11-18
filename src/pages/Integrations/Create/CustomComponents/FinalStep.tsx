import React from 'react';
import SuccessStep from './SuccessStep';
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
import { useFlag } from '@unleash/proxy-client-react';

export type IntegrationsData = {
  url: string;
  type: string;
  sub_type?: string;
  name: string;
  secret_token?: string;
  isEdit?: boolean;
  template?: {
    id?: string;
  };
  event_types: [];
  bundle_name: string;
  severity: string;
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
  const [hasBehaviorGroup, setHasBehaviorGroup] = React.useState(false);

  const isBehaviorGroupsEnabled = useFlag(
    'platform.integrations.behavior-groups-move'
  );

  const integrationsUrl = '/api/integrations/v1.0/endpoints';

  React.useEffect(() => {
    const updateAction = async () => {
      const method = 'PUT';
      try {
        const response = await fetch(
          `${integrationsUrl}/${data.template?.id}`,
          {
            method,
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
                method: method,
                url: data.url,
                disable_ssl_verification: false,
                secret_token: data.secret_token,
                severity: data.severity,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create or update the integration');
        }
        if (isBehaviorGroupsEnabled && data?.event_types) {
          let ids: string[] = [];
          Object.values(data.event_types).forEach((item) => {
            ids = [...ids, ...Object.keys(item)];
          });
          const behaviorGroupResponse = await fetch(
            `${integrationsUrl}/${data.template?.id}/eventTypes`,
            {
              method: method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ids),
            }
          );

          setHasBehaviorGroup(true);

          if (!behaviorGroupResponse.ok) {
            throw new Error('Failed to create behavior group');
          }
        }

        setIsFinished(true);
      } catch (e) {
        setHasError(true);
        setIsFinished(true);
      }
    };
    updateAction();
  }, [data, isBehaviorGroupsEnabled]);

  return isFinished ? (
    hasError ? (
      <FailedStep
        integrationName={data?.name || ''}
        behaviorGroupName={
          isBehaviorGroupsEnabled ? `${data?.name || ''} behavior group` : ''
        }
        onClose={onCancel}
        hasBehaviorGroup={hasBehaviorGroup}
      />
    ) : (
      <SuccessStep
        integrationName={data?.name || ''}
        behaviorGroupName={
          isBehaviorGroupsEnabled ? `${data?.name || ''} behavior group` : ''
        }
        onClose={onCancel}
        data={data}
        hasBehaviorGroup={hasBehaviorGroup}
      />
    )
  ) : (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText="Updating integration"
        headingLevel="h4"
        icon={<EmptyStateIcon icon={Spinner} />}
      />
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="link" onClick={() => onCancel()}>
            {' '}
            Cancel
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default FinalStep;
