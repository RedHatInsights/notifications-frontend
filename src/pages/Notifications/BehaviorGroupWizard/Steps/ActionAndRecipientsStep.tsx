import { Text, TextContent, Title } from '@patternfly/react-core';
import { Form } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';

import { EditBehaviorGroupForm } from '../../../../components/Notifications/BehaviorGroup/BehaviorGroupForm';
import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { ActionsArray } from '../../../../schemas/Integrations/Notifications';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';

const title = 'Actions and recipients';

const ActionAndRecipientsStep: React.FunctionComponent = () => {
  const { values } = useFormikContext<CreateBehaviorGroup>();

  return (
    <Form>
      <div>
        <Title headingLevel="h4" size="xl">
          {title}
        </Title>
        <TextContent className="pf-v5-u-pt-sm">
          <Text>
            Select action and recipient pairs to assign to your notification
            events.
          </Text>
        </TextContent>
        <EditBehaviorGroupForm behaviorGroup={values} />
      </div>
    </Form>
  );
};

const schema = Yup.object({
  actions: ActionsArray,
});

export const useActionAndRecipientStep: CreateWizardStep = () => {
  return React.useMemo(
    () => ({
      name: title,
      component: <ActionAndRecipientsStep />,
      schema,
    }),
    []
  );
};
