import * as React from 'react';
import { Formik, FormikHelpers, useFormikContext } from 'formik';
import {
    Button, ButtonVariant,
    Modal, ModalVariant
} from '@patternfly/react-core';

import { Integration, IntegrationType, NewIntegration } from '../../../types/Integration';
import { IntegrationSchema } from '../../../schemas/Integrations/Integration';
import { Messages } from '../../../properties/Messages';
import { IntegrationsForm } from '../../../components/Integrations/Form';

type PartialIntegration = Partial<Integration>;

interface CreatePageProps {
    initialValue: PartialIntegration;
    isModalOpen: boolean;
    onSave: (integration: NewIntegration) => void;
    onClose: () => void;
    isEdit: boolean;
}

interface IntegrationFormProps {
    isEdit: boolean;
    onClose: () => void;
}

const CreateIntegrationModal: React.FunctionComponent<IntegrationFormProps> = (props) => {

    const pageMessages = props.isEdit ? Messages.pages.integrations.edit : Messages.pages.integrations.add;
    const pageTitle =  pageMessages.title;
    const { setFieldValue, values, handleSubmit, isValid } = useFormikContext<NewIntegration>();

    React.useEffect(() => {
        const type = values.type;

        if (!type) {
            setFieldValue('type', Object.values(IntegrationType)[0]);
        }
    }, [ setFieldValue, values.type ]);

    const onSubmitClicked = React.useCallback(() => {
        handleSubmit();
    }, [ handleSubmit ]);

    return (
        <Modal
            title={ pageTitle }
            isOpen={ true }
            onClose={ props.onClose }
            variant={ ModalVariant.small }
            actions={ [
                <Button key="submit" variant={ ButtonVariant.primary } isDisabled={ !isValid } onClick={ onSubmitClicked }>
                    Submit
                </Button>,
                <Button key="cancel" variant={ ButtonVariant.plain } onClick={ props.onClose }>
                    Cancel
                </Button>
            ] }
        >
            <IntegrationsForm/>
        </Modal>
    );
};

export const CreatePage: React.FunctionComponent<CreatePageProps> = props => {

    const onSubmit = (integration: PartialIntegration, formikHelpers: FormikHelpers<PartialIntegration>) => {
        formikHelpers.setSubmitting(false);
        const transformedIntegration = IntegrationSchema.cast(integration) as NewIntegration;
        props.onSave(transformedIntegration);
    };

    if (!props.isModalOpen) {
        return <></>;
    }

    return (
        <Formik<PartialIntegration>
            initialValues={ props.initialValue }
            validationSchema={ IntegrationSchema }
            onSubmit={ onSubmit }
        >
            <CreateIntegrationModal
                isEdit={ props.isEdit }
                onClose={ props.onClose }
            />
        </Formik>
    );
};
