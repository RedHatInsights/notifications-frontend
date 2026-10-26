import { Content, Title } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as Yup from 'yup';

import { EditBehaviorGroupForm } from '../../../../components/Notifications/BehaviorGroup/BehaviorGroupForm';
import { IntegrationWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { ActionsArray } from '../../../../schemas/Integrations/Notifications';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';
import { Form } from '../../../../utils/insights-common-typescript';

const messages = defineMessages({
  description: {
    id: 'behaviorGroup.wizard.actionAndRecipients.description',
    defaultMessage: 'Select action and recipient pairs to assign to your notification events.',
  },
});

const titleMessages = {
  title: {
    id: 'behaviorGroup.wizard.actionAndRecipients.title',
    defaultMessage: 'Actions and recipients',
  },
} as const;

const ActionAndRecipientsStep: React.FunctionComponent = () => {
  const intl = useIntl();
  const { values } = useFormikContext<CreateBehaviorGroup>();

  return (
    <Form>
      <div>
        <Title headingLevel="h4" size="xl">
          {intl.formatMessage(titleMessages.title)}
        </Title>
        <Content className="pf-v6-u-pt-sm">
          <Content component="p">{intl.formatMessage(messages.description)}</Content>
        </Content>
        <EditBehaviorGroupForm behaviorGroup={values} />
      </div>
    </Form>
  );
};

const schema = Yup.object({
  actions: ActionsArray,
});

export const useActionAndRecipientStep: IntegrationWizardStep = () => {
  const intl = useIntl();
  return React.useMemo(
    () => ({
      name: intl.formatMessage(titleMessages.title),
      component: <ActionAndRecipientsStep />,
      schema,
    }),
    [intl]
  );
};
