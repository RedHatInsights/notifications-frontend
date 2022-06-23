import { Text, TextContent, Title } from '@patternfly/react-core';
import { global_spacer_sm } from '@patternfly/react-tokens';
import { Form } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { style } from 'typestyle';
import * as Yup from 'yup';

import { EditBehaviorGroupForm } from '../../../../components/Notifications/BehaviorGroup/BehaviorGroupForm';
import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { ActionsArray } from '../../../../schemas/Integrations/Notifications';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';

const title = 'Actions and recipients';

const subtitleClassName = style({
    paddingTop: global_spacer_sm.value
});

const ActionAndRecipientsStep: React.FunctionComponent = () => {
    const { values } = useFormikContext<CreateBehaviorGroup>();

    return (
        <Form>
            <div>
                <Title
                    headingLevel="h4"
                    size="xl"
                >
                    { title }
                </Title>
                <TextContent className={ subtitleClassName }>
                    <Text>Select action and recipient pairs to assign to your notification events.</Text>
                </TextContent>
                <EditBehaviorGroupForm behaviorGroup={ values } showOnlyActions={ true } />
            </div>
        </Form>
    );
};

const schema = Yup.object({
    actions: ActionsArray
});

export const useActionAndRecipientStep: CreateWizardStep = () => {
    return {
        name: title,
        component: <ActionAndRecipientsStep />,
        schema
    };
};
