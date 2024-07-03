import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Progress,
  ProgressMeasureLocation,
} from '@patternfly/react-core';
import { CogsIcon } from '@patternfly/react-icons';
import React from 'react';

interface ProgressBarProps {
  progress: number;
  integrationName: string;
  closeModal: () => void;
}

export const CreateNewStep: React.FunctionComponent<ProgressBarProps> = (
  props
) => {
  return (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText="Creating integration"
        headingLevel="h4"
        icon={<EmptyStateIcon icon={CogsIcon} />}
      />
      <EmptyStateBody>
        <Progress
          value={props.progress}
          measureLocation={ProgressMeasureLocation.outside}
        />
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="link" onClick={props.closeModal}>
            Cancel
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default CreateNewStep;
