import { addDangerNotification, addSuccessNotification } from '@redhat-cloud-services/insights-common-typescript';
import { Formik, useFormikContext } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';

import { BehaviorGroupWizard } from '../../../components/Notifications/BehaviorGroup/Wizard/BehaviorGroupWizard';
import { RecipientContextProvider } from '../../../components/Notifications/RecipientContext';
import { useGetIntegrations } from '../../../components/Notifications/useGetIntegrations';
import { useGetRecipients } from '../../../components/Notifications/useGetRecipients';
import { CreateBehaviorGroup } from '../../../types/CreateBehaviorGroup';
import { Facet } from '../../../types/Notification';
import { SaveBehaviorGroupResult, useSaveBehaviorGroup } from '../Form/useSaveBehaviorGroup';
import { useSteps } from './useSteps';

interface BehaviorGroupWizardProps {
    bundle: Facet;
    applications: ReadonlyArray<Facet>;
}

interface BehaviorGroupWizardInternalProps extends BehaviorGroupWizardProps {
    validationSchema?: Yup.AnySchema;
    setValidationSchema: (schema?: Yup.AnySchema) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {};

const InternalBehaviorGroupWizardPage: React.FunctionComponent<BehaviorGroupWizardInternalProps> = props => {
    const [ currentStep, setCurrentStep ] = React.useState(0);
    const { isValid, validateForm } = useFormikContext<CreateBehaviorGroup>();
    const saving = useSaveBehaviorGroup(); // use the partial for the edit here
    const { values } = useFormikContext<CreateBehaviorGroup>();

    const associateEventTypeStepProps = {
        bundle: props.bundle,
        applications: props.applications
    };

    const steps = useSteps(associateEventTypeStepProps, currentStep, isValid);

    const currentStepModel = steps[currentStep] as (typeof steps)[number] | undefined;
    const stepValidationSchema = currentStepModel?.schema;

    React.useEffect(() => {
        props.setValidationSchema(stepValidationSchema);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentStep ]);

    React.useEffect(() => {
        validateForm();
    }, [ props.validationSchema, validateForm ]);

    React.useEffect(() => {
        if (currentStepModel === undefined) {
            const save = saving.save;
            (async () => {
                const behaviorGroup = {
                    ...values,
                    bundleId: props.bundle.id
                };

                const result = await save(behaviorGroup);

                if (result.status) {
                    if (result.operation === SaveBehaviorGroupResult.CREATE) {
                        addSuccessNotification(
                            'New behavior group created',
                            <>
                                Group <b> { behaviorGroup.displayName } </b> created successfully.
                            </>
                        );
                    } else {
                        addSuccessNotification(
                            'Behavior group saved',
                            <>
                                Group <b> { behaviorGroup.displayName } </b> was saved successfully.
                            </>
                        );
                    }
                } else {
                    if (result.operation === SaveBehaviorGroupResult.CREATE) {
                        addDangerNotification(
                            'Behavior group failed to be created',
                            <>
                                Failed to create group <b> { behaviorGroup.displayName }</b>.
                                <br />
                                Please try again.
                            </>
                        );
                    } else {
                        addDangerNotification(
                            'Behavior group failed to save',
                            <>
                                Failed to save group <b> { behaviorGroup.displayName }</b>.
                                <br />
                                Please try again.
                            </>
                        );
                    }
                }
            })();
        }
    }, [ currentStepModel, values, saving.save, props.bundle ]);

    const onNext = async (goNext) => {
        let shouldGoNext = true;

        if (currentStepModel?.isValid) {
            shouldGoNext = await currentStepModel.isValid();
        }

        if (shouldGoNext) {
            setCurrentStep(prev => prev + 1);
            goNext();
        }
    };

    const onBack = async (goBack) => {
        setCurrentStep(prev => prev - 1);
        goBack();
    };

    return <BehaviorGroupWizard
        steps={ steps }
        onNext={ onNext }
        onBack={ onBack }
        onGoToStep={ setCurrentStep }
        loading={ saving.isSaving }
    />;
};

export const BehaviorGroupWizardPage: React.FunctionComponent<BehaviorGroupWizardProps> = props => {
    const getRecipients = useGetRecipients();
    const getIntegrations = useGetIntegrations();
    const actionsContextValue = React.useMemo(() => ({
        getIntegrations,
        getNotificationRecipients: getRecipients
    }), [ getIntegrations, getRecipients ]);

    const [ validationSchema, setValidationSchema ] = React.useState<Yup.AnySchema>();

    return (
        <RecipientContextProvider value={ actionsContextValue }>
            <Formik<Partial<CreateBehaviorGroup>>
                validateOnMount
                onSubmit={ noOp }
                initialValues={ {
                    actions: [],
                    events: [],
                    displayName: undefined
                } }
                validationSchema={ validationSchema }
                validateOnBlur
                validateOnChange
            >
                <InternalBehaviorGroupWizardPage { ...props } validationSchema={ validationSchema } setValidationSchema={ setValidationSchema } />
            </Formik>
        </RecipientContextProvider>
    );
};
