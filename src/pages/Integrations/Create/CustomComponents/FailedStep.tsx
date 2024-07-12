import { Button, Stack, StackItem } from '@patternfly/react-core';
import ErrorState from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import React from 'react';

interface ProgressProps {
  progress: number;
  integrationName: string;
  behaviorGroupName: string;
  closeModal: () => void;
}

export const FailedStep: React.FunctionComponent<ProgressProps> = (props) => {
  return (
    <>
      <ErrorState
        errorTitle="Integration creation failed"
        errorDescription={`There was an error creating ${props.integrationName} integrations and/or the ${props.behaviorGroupName} behavior group.`}
        customFooter={
          <>
            <Stack hasGutter>
              <StackItem>
                <Button variant="link" onClick={props.closeModal}>
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
