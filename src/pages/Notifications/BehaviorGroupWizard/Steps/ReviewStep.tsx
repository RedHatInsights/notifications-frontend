import {
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Title,
} from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { BehaviorGroupActionsSummary } from '../../../../components/Notifications/BehaviorGroup/BehaviorGroupActionsSummary';
import { IntegrationWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';
import { EventType } from '../../../../types/Notification';
import { Form } from '../../../../utils/insights-common-typescript';

const messages = defineMessages({
  review: {
    id: 'behaviorGroup.wizard.review.review',
    defaultMessage: 'Review',
  },
  finish: {
    id: 'behaviorGroup.wizard.review.finish',
    defaultMessage: 'Finish',
  },
  eventType: {
    id: 'behaviorGroup.wizard.review.eventType',
    defaultMessage: 'Event type',
  },
  application: {
    id: 'behaviorGroup.wizard.review.application',
    defaultMessage: 'Application',
  },
  name: {
    id: 'behaviorGroup.wizard.review.name',
    defaultMessage: 'Name',
  },
  actionsAndRecipients: {
    id: 'behaviorGroup.wizard.review.actionsAndRecipients',
    defaultMessage: 'Actions and recipients',
  },
  associateEventTypes: {
    id: 'behaviorGroup.wizard.review.associateEventTypes',
    defaultMessage: 'Associate event types',
  },
});

interface EventTypeReviewTableProps {
  events: ReadonlyArray<EventType>;
}

const EventTypeTable: React.FunctionComponent<EventTypeReviewTableProps> = (props) => {
  const intl = useIntl();
  return (
    <Grid>
      <GridItem span={6}>
        <Content>
          <Content component={ContentVariants.h6}>{intl.formatMessage(messages.eventType)}</Content>
        </Content>
      </GridItem>
      <GridItem span={6}>
        <Content>
          <Content component={ContentVariants.h6}>
            {intl.formatMessage(messages.application)}
          </Content>
        </Content>
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
  const intl = useIntl();

  return (
    <Form ouiaId="review-step">
      <Title headingLevel="h2" size="xl">
        {intl.formatMessage(messages.review)}
      </Title>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>{intl.formatMessage(messages.name)}</DescriptionListTerm>
          <DescriptionListDescription> {values.displayName}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            {intl.formatMessage(messages.actionsAndRecipients)}
          </DescriptionListTerm>
          <DescriptionListDescription>
            <BehaviorGroupActionsSummary actions={values.actions} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            {intl.formatMessage(messages.associateEventTypes)}
          </DescriptionListTerm>
          <DescriptionListDescription>
            <EventTypeTable events={values.events} />
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </Form>
  );
};

export const useReviewStep: IntegrationWizardStep = () => {
  const intl = useIntl();
  return React.useMemo(
    () => ({
      name: intl.formatMessage(messages.review),
      component: <ReviewStep />,
      nextButtonText: intl.formatMessage(messages.finish),
    }),
    [intl]
  );
};
