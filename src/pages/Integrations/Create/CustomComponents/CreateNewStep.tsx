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
import React from 'react';

interface ProgressBarProps {
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
        icon={<EmptyStateIcon icon={Spinner} />}
      />
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
