import { Grid } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { FieldArray } from 'formik';
import * as React from 'react';

import { BehaviorGroup } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { BehaviorGroupFormActionsTable } from './BehaviorGroupFormActionsTable';

export interface EditBehaviorGroupProps extends OuiaComponentProps {
  behaviorGroup?: Partial<BehaviorGroup>;
}

export const EditBehaviorGroupForm: React.FunctionComponent<
  EditBehaviorGroupProps
> = (props) => {
  return (
    <div {...getOuiaProps('Notifications/BehaviorGroupForm', props)}>
      <Grid hasGutter>
        <FieldArray name="actions">
          {(helpers) => (
            <>
              <BehaviorGroupFormActionsTable {...helpers} />
            </>
          )}
        </FieldArray>
      </Grid>
    </div>
  );
};
