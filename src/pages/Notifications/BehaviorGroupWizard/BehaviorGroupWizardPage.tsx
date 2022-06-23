import { Formik, useFormikContext } from 'formik';
import * as React from 'react';

import { BehaviorGroupWizard } from '../../../components/Notifications/BehaviorGroup/Wizard/BehaviorGroupWizard';
import { RecipientContextProvider } from '../../../components/Notifications/RecipientContext';
import { useGetIntegrations } from '../../../components/Notifications/useGetIntegrations';
import { useGetRecipients } from '../../../components/Notifications/useGetRecipients';
import { CreateBehaviorGroup } from '../../../types/CreateBehaviorGroup';
import { Facet } from '../../../types/Notification';
import { useSteps } from './useSteps';
import * as Yup from 'yup';

interface BehaviorGroupWizardProps {
    bundle: Facet;
    applications: ReadonlyArray<Facet>;
}

interface BehaviorGroupWizardInternalProps extends BehaviorGroupWizardProps {
    setValidationSchema: (schema?: Yup.AnySchema) => void;
}

const InternalBehaviorGroupWizardPage: React.FunctionComponent<BehaviorGroupWizardInternalProps> = props => {
    const [ currentStep, setCurrentStep ] = React.useState(0);
    const [ maxStep, setMaxStep ] = React.useState(0);
    const { isValid, values } = useFormikContext<CreateBehaviorGroup>();

    const associateEventTypeStepProps = {
        bundle: props.bundle,
        applications: props.applications
    };

    const steps = useSteps(associateEventTypeStepProps, maxStep).map(value => ({
        ...value,
        enableNext: value.id === currentStep ? isValid : value.enableNext
    }));

    const currentStepModel = steps[currentStep];
    const validationSchema = currentStepModel.schema;

    React.useEffect(() => {
        props.setValidationSchema(validationSchema);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentStep ]);

    const onNext = async (goNext) => {
        let shouldGoNext = true;

        if (currentStepModel.schema) {
            shouldGoNext = await currentStepModel.schema.validate(values);
        }

        if (currentStepModel.isValid) {
            shouldGoNext = await currentStepModel.isValid();
        }

        if (shouldGoNext) {
            setCurrentStep(prev => prev + 1);
            setMaxStep(prev => prev + 1);
            goNext();
        }
    };

    return <BehaviorGroupWizard
        steps={ steps }
        onNext={ onNext }
        onGoToStep={ setCurrentStep }
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
                onSubmit={ () => { console.log('onsubmit'); } }
                initialValues={ {
                    actions: [],
                    events: [],
                    name: ''
                } }
                validationSchema={ validationSchema }
                isInitialValid={ false }
            >
                <InternalBehaviorGroupWizardPage { ...props } setValidationSchema={ setValidationSchema } />
            </Formik>
        </RecipientContextProvider>
    );
};
