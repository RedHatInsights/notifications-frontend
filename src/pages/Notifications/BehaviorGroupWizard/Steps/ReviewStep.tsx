import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { c_form__label_FontSize } from '@patternfly/react-tokens';
import { Form } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupActionsSummary } from '../../../../components/Notifications/BehaviorGroup/BehaviorGroupActionsSummary';
import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';
import { EventType } from '../../../../types/Notification';

const title = 'Review';

const contentTitleClassName = style({
  fontSize: c_form__label_FontSize.value,
});

interface EventTypeReviewTableProps {
  events: ReadonlyArray<EventType>;
}

const EventTypeTable: React.FunctionComponent<EventTypeReviewTableProps> = (
  props
) => {
  return (
    <Grid>
      <GridItem span={6}>
        <TextContent>
          <Text component={TextVariants.h6} className={contentTitleClassName}>
            Event type
          </Text>
        </TextContent>
      </GridItem>
      <GridItem span={6}>
        <TextContent>
          <Text component={TextVariants.h6} className={contentTitleClassName}>
            Application
          </Text>
        </TextContent>
      </GridItem>
      {props.events.map((event) => (
        <React.Fragment key={event.id}>
          <GridItem span={6}>{event.eventTypeDisplayName}</GridItem>
          <GridItem span={6}>{event.applicationDisplayName}</GridItem>
        </React.Fragment>
      ))}
    </Grid>
  );
};

const ReviewStep: React.FunctionComponent = () => {
  const { values } = useFormikContext<CreateBehaviorGroup>();

  return (
    <Form ouiaId="review-step">
      <Title headingLevel="h2" size="xl">
        {title}
      </Title>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>
            {' '}
            {values.displayName}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm> Actions and recipients</DescriptionListTerm>
          <DescriptionListDescription>
            <BehaviorGroupActionsSummary actions={values.actions} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Associate event types</DescriptionListTerm>
          <DescriptionListDescription>
            <EventTypeTable events={values.events} />
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </Form>
  );
};

export const createReviewStep: CreateWizardStep = () => ({
  name: title,
  component: <ReviewStep />,
  nextButtonText: 'Finish',
});
