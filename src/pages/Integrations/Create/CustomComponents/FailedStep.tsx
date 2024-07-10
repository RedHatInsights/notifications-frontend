import {
  Button,
  Progress,
  ProgressMeasureLocation,
  ProgressVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import ErrorState from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import React from 'react';

interface ProgressBarProps {
  progress: number;
  integrationName: string;
  closeModal: () => void;
}

export const FailedStep: React.FunctionComponent<ProgressBarProps> = (
  props
) => {
  return (
    <>
      <ErrorState
        errorTitle="Integration creation failed"
        errorDescription={`There was an error creating ${props.integrationName}`}
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
      <Progress
        value={props.progress}
        measureLocation={ProgressMeasureLocation.outside}
        variant={ProgressVariant.danger}
      />
    </>
  );
};

export default FailedStep;
