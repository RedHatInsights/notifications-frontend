import { Grid, GridItem, Text, TextContent, TextVariants, Title } from '@patternfly/react-core';
import { c_form__label_FontSize } from '@patternfly/react-tokens';
import { Form, FormText } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupActionsSummary } from '../../../../components/Notifications/BehaviorGroup/BehaviorGroupActionsSummary';
import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';
import { EventType } from '../../../../types/Notification';

const title = 'Review';

const contentTitleClassName = style({
    fontSize: c_form__label_FontSize.value
});

const tableContainerClassName = style({
    maxWidth: 500
});

interface EventTypeReviewTableProps {
    events: ReadonlyArray<EventType>;
}

// Disabled while we get the service to assign a behavior group to event types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EventTypeTable: React.FunctionComponent<EventTypeReviewTableProps> = props => {
    return (
        <div className={ tableContainerClassName }>
            <Grid>
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
                { props.events.map(event => (
                    <React.Fragment key={ event.id }>
                        <GridItem span={ 6 }>
                            { event.eventTypeDisplayName }
                        </GridItem>
                        <GridItem span={ 6 }>
                            { event.applicationDisplayName }
                        </GridItem>
                    </React.Fragment>
                )) }
            </Grid>
        </div>
    );
};

const ReviewStep: React.FunctionComponent = () => {
    const { values } = useFormikContext<CreateBehaviorGroup>();

    return (
        <Form ouiaId="review-step">
            <Title
                headingLevel="h2"
                size="xl"
            >
                { title }
            </Title>
            <FormText id="review-name" name="displayName" label="Name" />
            <div className={ tableContainerClassName }>
                <BehaviorGroupActionsSummary actions={ values.actions } />
            </div>
            {
                // Disabled while we get the service to assign a behavior group to event types
                // <EventTypeTable events={ values.events } />
            }
        </Form>
    );
};

export const createReviewStep: CreateWizardStep = () => ({
    name: title,
    component: <ReviewStep />,
    nextButtonText: 'Finish'
});
