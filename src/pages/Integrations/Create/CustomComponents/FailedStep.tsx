import { Button, Stack, StackItem } from '@patternfly/react-core';
import ErrorState from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import React from 'react';

interface ProgressProps {
  integrationName: string;
  behaviorGroupName: string;
  onClose: () => void;
  hasBehaviorGroup: boolean;
}

export const FailedStep: React.FunctionComponent<ProgressProps> = (props) => {
  return (
    <>
      <ErrorState
        errorTitle="Integration creation failed"
        errorDescription={
          props.hasBehaviorGroup ? (
            <span>
              There was an error creating <b>&apos;{props.integrationName}</b>
              &apos; integrations and/or the
              <b>&apos;{props.behaviorGroupName}</b>
              &apos; behavior group.
            </span>
          ) : (
            <span>
              There was an error creating <b>&apos;{props.integrationName}</b>
              &apos; integrations.
            </span>
          )
        }
        customFooter={
          <>
            <Stack hasGutter>
              <StackItem>
                <Button variant="link" onClick={props.onClose}>
                  Close
                </Button>
              </StackItem>
            </Stack>
          </>
        }
      />
    </>
  );
};

export default FailedStep;
