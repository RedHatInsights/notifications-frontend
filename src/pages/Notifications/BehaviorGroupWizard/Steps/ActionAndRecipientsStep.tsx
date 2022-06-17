import { Text, TextContent, Title } from '@patternfly/react-core';
import { global_spacer_sm } from '@patternfly/react-tokens';
import { Form } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';

const title = 'Actions and recipients';

const subtitleClassName = style({
    paddingTop: global_spacer_sm.value
});

const ActionAndRecipientsStep: React.FunctionComponent = () => {
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
            </div>
        </Form>
    );
};

export const createActionAndRecipientStep: CreateWizardStep = () => ({
    name: title,
    component: <ActionAndRecipientsStep />
});
