import { Form, Grid, GridItem } from '@patternfly/react-core';
import { global_spacer_md } from '@patternfly/react-tokens';
import { FormTextInput, OuiaComponentProps, ouiaIdConcat } from '@redhat-cloud-services/insights-common-typescript';
import { FieldArray } from 'formik';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroup } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { BehaviorGroupFormActionsTable } from './BehaviorGroupFormActionsTable';

export interface EditBehaviorGroupProps extends OuiaComponentProps {
    behaviorGroup?: Partial<BehaviorGroup>;
}

const subtitleClassName = style({
    paddingBottom: global_spacer_md.var
});

export const EditBehaviorGroupForm: React.FunctionComponent<EditBehaviorGroupProps> = props => {

    return (
        <div { ... getOuiaProps('Notifications/BehaviorGroupForm', props) }>
            <div className={ subtitleClassName }>Enter a name and add actions for your new group.</div>
            <Form>
                <Grid hasGutter>
                    <GridItem span={ 12 }>
                        <FormTextInput
                            ouiaId={ ouiaIdConcat(props.ouiaId, 'group-name') }
                            label="Group name"
                            name="displayName"
                            id="group-name"
                        />
                    </GridItem>
                    <FieldArray name="actions">
                        { helpers => (
                            <>
                                <BehaviorGroupFormActionsTable
                                    { ...helpers }
                                />
                            </>
                        ) }
                    </FieldArray>
                </Grid>
            </Form>
        </div>
    );
};
