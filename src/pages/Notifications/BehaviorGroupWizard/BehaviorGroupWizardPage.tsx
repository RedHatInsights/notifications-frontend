import { Formik, useFormikContext } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { BehaviorGroupWizard } from '../../../components/Notifications/BehaviorGroup/Wizard/BehaviorGroupWizard';
import { RecipientContextProvider } from '../../../components/Notifications/RecipientContext';
import { useGetIntegrations } from '../../../components/Notifications/useGetIntegrations';
import { useGetRecipients } from '../../../components/Notifications/useGetRecipients';
import { CreateBehaviorGroup } from '../../../types/CreateBehaviorGroup';
import { Facet } from '../../../types/Notification';
import { useNotification } from '../../../utils/AlertUtils';
import { SaveBehaviorGroupOperation, useSaveBehaviorGroup } from './useSaveBehaviorGroup';
import { useSteps } from './useSteps';

const messages = defineMessages({
  createSuccessTitle: {
    id: 'behaviorGroup.wizard.createSuccessTitle',
    defaultMessage: 'New behavior group created',
  },
  createSuccessBody: {
    id: 'behaviorGroup.wizard.createSuccessBody',
    defaultMessage: 'Group {name} created successfully.',
  },
  saveSuccessTitle: {
    id: 'behaviorGroup.wizard.saveSuccessTitle',
    defaultMessage: 'Behavior group saved',
  },
  saveSuccessBody: {
    id: 'behaviorGroup.wizard.saveSuccessBody',
    defaultMessage: 'Group {name} was saved successfully.',
  },
  createFailTitle: {
    id: 'behaviorGroup.wizard.createFailTitle',
    defaultMessage: 'Behavior group failed to be created',
  },
  createFailDuplicateBody: {
    id: 'behaviorGroup.wizard.createFailDuplicateBody',
    defaultMessage: 'A behavior group with display name {name} already exists.',
  },
  createFailBody: {
    id: 'behaviorGroup.wizard.createFailBody',
    defaultMessage: 'Failed to create group {name}. Please try again.',
  },
  saveFailTitle: {
    id: 'behaviorGroup.wizard.saveFailTitle',
    defaultMessage: 'Behavior group failed to save',
  },
  saveFailBody: {
    id: 'behaviorGroup.wizard.saveFailBody',
    defaultMessage: 'Failed to save group {name}. Please try again.',
  },
});

interface BehaviorGroupWizardProps {
  bundle: Facet;
  applications: ReadonlyArray<Facet>;
  behaviorGroup?: Partial<CreateBehaviorGroup>;
  onClose: (saved: boolean) => void;
}

interface BehaviorGroupWizardInternalProps extends BehaviorGroupWizardProps {
  validationSchema?: Yup.AnySchema;
  setValidationSchema: (schema?: Yup.AnySchema) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {};

const InternalBehaviorGroupWizardPage: React.FunctionComponent<BehaviorGroupWizardInternalProps> = (
  props
) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const { isValid, validateForm } = useFormikContext<CreateBehaviorGroup>();
  const saving = useSaveBehaviorGroup(props.behaviorGroup);
  const { values } = useFormikContext<CreateBehaviorGroup>();
  const { addDangerNotification, addSuccessNotification } = useNotification();
  const intl = useIntl();

  const associateEventTypeStepProps = {
    bundle: props.bundle,
    applications: props.applications,
  };

  const steps = useSteps(associateEventTypeStepProps, currentStep, isValid, saving.isSaving);

  const currentStepModel = steps[currentStep] as (typeof steps)[number] | undefined;
  const stepValidationSchema = currentStepModel?.schema;

  React.useEffect(() => {
    props.setValidationSchema(stepValidationSchema);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  React.useEffect(() => {
    validateForm();
  }, [props.validationSchema, validateForm]);

  const onSave = React.useCallback(async () => {
    const onClose = props.onClose;
    const save = saving.save;
    const behaviorGroup = {
      ...values,
      bundleId: props.bundle.id,
    };

    const result = await save(behaviorGroup);

    if (result.status) {
      if (result.operation === SaveBehaviorGroupOperation.CREATE) {
        addSuccessNotification(
          intl.formatMessage(messages.createSuccessTitle),
          <FormattedMessage
            {...messages.createSuccessBody}
            values={{ name: <b>{behaviorGroup.displayName}</b> }}
          />
        );
      } else {
        addSuccessNotification(
          intl.formatMessage(messages.saveSuccessTitle),
          <FormattedMessage
            {...messages.saveSuccessBody}
            values={{ name: <b>{behaviorGroup.displayName}</b> }}
          />
        );
      }

      onClose(true);
    } else {
      if (result.duplicate && result.operation === SaveBehaviorGroupOperation.CREATE) {
        addDangerNotification(
          intl.formatMessage(messages.createFailTitle),
          <FormattedMessage
            {...messages.createFailDuplicateBody}
            values={{ name: <b>{behaviorGroup.displayName}</b> }}
          />
        );
      } else {
        if (result.operation === SaveBehaviorGroupOperation.CREATE) {
          addDangerNotification(
            intl.formatMessage(messages.createFailTitle),
            <FormattedMessage
              {...messages.createFailBody}
              values={{ name: <b>{behaviorGroup.displayName}</b> }}
            />
          );
        } else {
          addDangerNotification(
            intl.formatMessage(messages.saveFailTitle),
            <FormattedMessage
              {...messages.saveFailBody}
              values={{ name: <b>{behaviorGroup.displayName}</b> }}
            />
          );
        }
      }
    }
  }, [
    values,
    saving.save,
    props.bundle,
    props.onClose,
    addDangerNotification,
    addSuccessNotification,
    intl,
  ]);

  const onNext = async (goNext) => {
    let shouldGoNext = true;

    if (currentStepModel?.isValid) {
      shouldGoNext = await currentStepModel.isValid();
    }

    if (shouldGoNext) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      goNext();
    }
  };

  const onBack = async (goBack) => {
    setCurrentStep((prev) => prev - 1);
    goBack();
  };

  const onClose = () => {
    props.onClose(false);
  };

  return (
    <BehaviorGroupWizard
      steps={steps}
      onNext={onNext}
      onBack={onBack}
      onGoToStep={setCurrentStep}
      loading={saving.isSaving}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

export const BehaviorGroupWizardPage: React.FunctionComponent<BehaviorGroupWizardProps> = (
  props
) => {
  const getRecipients = useGetRecipients();
  const getIntegrations = useGetIntegrations();
  const actionsContextValue = React.useMemo(
    () => ({
      getIntegrations,
      getNotificationRecipients: getRecipients,
    }),
    [getIntegrations, getRecipients]
  );

  const [validationSchema, setValidationSchema] = React.useState<Yup.AnySchema>();

  return (
    <RecipientContextProvider value={actionsContextValue}>
      <Formik<Partial<CreateBehaviorGroup>>
        validateOnMount
        onSubmit={noOp}
        initialValues={
          props.behaviorGroup ?? {
            actions: [],
            events: [],
            displayName: undefined,
          }
        }
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
      >
        <InternalBehaviorGroupWizardPage
          {...props}
          validationSchema={validationSchema}
          setValidationSchema={setValidationSchema}
        />
      </Formik>
    </RecipientContextProvider>
  );
};
