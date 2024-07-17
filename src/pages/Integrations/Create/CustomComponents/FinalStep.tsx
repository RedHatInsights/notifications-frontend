import React from 'react';
import CreatedStep from './CreatedStep';
import FailedStep from './FailedStep';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
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
  React.useEffect(() => {
    console.log('I was rendered!');
    const createAction = async () => {
      try {
        const result = await (
          await fetch(
            // TODO: change this to constant
            `/api/integrations/v1.0/endpoints${
              data.isEdit ? `/${data.template?.id}` : ''
            }`,
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

        console.log(result, 'this is the result data!');
        // TODO: change this URL to constant
        await fetch(`/api/notifications/v1.0/notifications/behaviorGroups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // TODO: we'll have to go trough each event and probably create multiple behavior groups for each product family
            productFamily: 'rhel', // TODO: temporary rhel
            display_name: `${data?.name || ''} behavior group`,
            // TODO: fill in value from result
            endpoint_ids: [result.id],
            // TODO: fill in event ids from data object
            event_type_ids: [],
          }),

          /*
          '{
            "bundle_id": "35fd787b-a345-4fe8-a135-7773de15905e",
            "display_name": "My super duper unique name",
            "endpoint_ids": [
              "744e4c9d-57db-4067-a1d5-078133c8c302"
            ],
            "event_type_ids": [
              "95a6d179-5dbd-4de4-a726-5bab2a699912",
              "75233a10-646c-4e26-a5f1-639a7df8f29f",
              "3fb7e996-8c32-432d-94e0-cafe0e108b44"
            ]
          }' 
          */
        });
      } catch (e) {
        setHasError(true);
      }
      setIsFinished(true);
    };
    createAction();
  }, [data]);
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
    <Bullseye>
      <EmptyState>
        <EmptyStateHeader titleText={<Spinner />} headingLevel="h4" />
        <EmptyStateBody>Creating integration</EmptyStateBody>
        <EmptyStateFooter>
          <Button
            variant="link"
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </Button>
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
};

export default FinalStep;
