import * as React from 'react';
import { Formik, FormikHelpers, useFormikContext } from 'formik';
import {
    Button, ButtonVariant,
    Modal, ModalVariant
} from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useSaveIntegrationMutation } from '../../../services/useSaveIntegration';

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

<<<<<<< HEAD
const CreateIntegrationModal: React.FunctionComponent<IntegrationFormProps> = (props) => {
=======
    const saveIntegrationMutation = useSaveIntegrationMutation();

    const [ newUrl, updateUrl ] = useState(initialValue);
    const [ intCount, updateIntCount ] = useState(0);
    const [ pageTitle, updatePageTitle ] = useState(Messages.components.integrations.toolbar.actions.addIntegration);
    useEffect(() => {
        if (props.currentRow) {
            updatePageTitle(Messages.components.integrations.toolbar.actions.editIntegration);
            const integration = props.model.find(element => element.id === props.currentRow);
            //preload url for editing if available.
            if (integration) {
                updateUrl(integration.url);
            }
        } else {
            updatePageTitle(Messages.components.integrations.toolbar.actions.addIntegration);
        }
    }, [ props.currentRow, props.model ]);
>>>>>>> WIP

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
                <Button ouiaId="submit" key="submit" variant={ ButtonVariant.primary } isDisabled={ !isValid } onClick={ onSubmitClicked }>
                    Submit
                </Button>,
                <Button ouiaId="cancel" key="cancel" variant={ ButtonVariant.plain } onClick={ props.onClose }>
                    Cancel
                </Button>
            ] }
        >
            <IntegrationsForm/>
        </Modal>
    );
};

<<<<<<< HEAD
export const CreatePage: React.FunctionComponent<CreatePageProps> = props => {

    const onSubmit = (integration: PartialIntegration, formikHelpers: FormikHelpers<PartialIntegration>) => {
        formikHelpers.setSubmitting(false);
        const transformedIntegration = IntegrationSchema.cast(integration) as NewIntegration;
        props.onSave(transformedIntegration);
=======
                if (integration) {
                    const index =  props.model.map(function(element) { return element.id; }).indexOf(integration.id);
                    integration.url = newUrl;
                    if (index === 0) {
                        props.updateModel(
                            [ integration, ...props.model.slice(1) ]
                        );
                    }
                    else if (index === props.model.length - 1) {
                        props.updateModel(
                            [ ...props.model.slice(0, props.model.length - 1), integration ]
                        );
                    }
                    else {
                        props.updateModel(
                            [ ...props.model.slice(0, index - 1), integration, ...props.model.slice(index + 1) ]
                        );
                    }
                }
            } else {
                saveIntegrationMutation.mutate({
                    enabled: true,
                    name: 'Pager duty-' + intCount,
                    type: EndpointType.WEBHOOK,
                    description: 'foo bar',
                    properties: {
                        url: newUrl,
                        method: 'POST',
                        disable_ssl_verification: false,
                        secret_token: ''
                    }
                }).then(handleExit);

                /*props.updateModel(
                    [ ...props.model, ]
                );*/
            }
        }
>>>>>>> WIP
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
