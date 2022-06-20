import { Grid, GridItem, Text, TextContent, TextVariants, Title } from '@patternfly/react-core';
import { Form, FormText } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { BehaviorGroupActionsSummary } from '../../../../components/Notifications/BehaviorGroup/BehaviorGroupActionsSummary';
import { c_form__label_FontSize } from '@patternfly/react-tokens';
import { style } from 'typestyle';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';
import { NotificationType } from '../../../../types/Notification';
import { NotificationUserRecipient } from '../../../../types/Recipient';
import { useFormikContext } from 'formik';

const title = 'Review';

const contentTitleClassName = style({
    fontSize: c_form__label_FontSize.value
});

const tableContainerClassName = style({
    maxWidth: 500
});

const ReviewStep: React.FunctionComponent = () => {
    const x = useFormikContext<CreateBehaviorGroup>();
    console.log(x.values);

    const values: CreateBehaviorGroup = {
        name: 'my new behavior group',
        actions: [
            {
                type: NotificationType.EMAIL_SUBSCRIPTION,
                recipient: [
                    new NotificationUserRecipient('foo', true)
                ]
            }
        ],
        events: [
            {
                id: 'policy-triggered',
                name: 'Policy triggered',
                applicationName: 'Policies'
            }
        ]
    };

    return (
        <Form ouiaId="review-step">
            <Title
                headingLevel="h2"
                size="xl"
            >
                { title }
            </Title>
            <FormText id="review-name" name="name" label="Name" />
            <div className={ tableContainerClassName }>
                <BehaviorGroupActionsSummary actions={ values.actions } />
            </div>
            <div className={ tableContainerClassName }>
                <Grid hasGutter>
                    <GridItem span={ 6 }>
                        <TextContent>
                            <Text component={ TextVariants.h5 } className={ contentTitleClassName }>Event type</Text>
                        </TextContent>
                    </GridItem>
                    <GridItem span={ 6 }>
                        <TextContent>
                            <Text component={ TextVariants.h5 } className={ contentTitleClassName }>Application</Text>
                        </TextContent>
                    </GridItem>
                    { values.events.map(event => (
                        <React.Fragment key={ event.id }>
                            <GridItem span={ 6 }>
                                { event.name }
                            </GridItem>
                            <GridItem span={ 6 }>
                                { event.applicationName }
                            </GridItem>
                        </React.Fragment>
                    )) }
                </Grid>
            </div>
        </Form>
    );
};

export const createReviewStep: CreateWizardStep = () => ({
    name: title,
    component: <ReviewStep />
});
