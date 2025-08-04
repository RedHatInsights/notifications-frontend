import { Content, Title } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';

import { EditBehaviorGroupForm } from '../../../../components/Notifications/BehaviorGroup/BehaviorGroupForm';
import { IntegrationWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { ActionsArray } from '../../../../schemas/Integrations/Notifications';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';
import { Form } from '../../../../utils/insights-common-typescript';

const title = 'Actions and recipients';

const ActionAndRecipientsStep: React.FunctionComponent = () => {
  const { values } = useFormikContext<CreateBehaviorGroup>();

  return (
    <Form>
      <div>
        <Title headingLevel="h4" size="xl">
          {title}
        </Title>
        <Content className="pf-v5-u-pt-sm">
          <Content component="p">
            Select action and recipient pairs to assign to your notification
            events.
          </Content>
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
  return React.useMemo(
    () => ({
      name: title,
      component: <ActionAndRecipientsStep />,
      schema,
    }),
    []
  );
};
