import * as React from 'react';
import { Integration, IntegrationType, NewIntegration } from '../../types/Integration';
import { Messages } from '../../properties/Messages';
import { Formik, useFormikContext } from 'formik';
import { SaveModal, SaveModalProps } from '../Modals/SaveModal';
import { IntegrationsForm } from './Form';
import { IntegrationSchema } from '../../schemas/Integrations/Integration';
import { ActionModalError } from '../Modals/ActionModal';

type PartialIntegration = Partial<Integration>;
type UsedProps = 'isOpen' | 'title' | 'content' | 'onSave';

export interface IntegrationSaveModalProps extends Omit<SaveModalProps, UsedProps>{
    initialIntegration?: PartialIntegration;
    onSave: (integration: Integration | NewIntegration) => boolean | Promise<boolean>;
    isEdit: boolean;
}

interface InternalIntegrationSaveModalProps {
    isEdit: boolean;
    onClose: (saved: boolean) => void;
    error?: ActionModalError;
}

const InternalIntegrationSaveModal: React.FunctionComponent<InternalIntegrationSaveModalProps> = (props) => {

    const pageMessages = props.isEdit ? Messages.pages.integrations.edit : Messages.pages.integrations.add;
    const pageTitle =  pageMessages.title;
    const { handleSubmit, isValid, isSubmitting } = useFormikContext<NewIntegration>();

    const onSaveClicked = React.useCallback(() => {
        handleSubmit();
        return false;
    }, [ handleSubmit ]);

    return (
        <SaveModal
            isOpen={ true }
            isSaving={ isSubmitting }
            onSave={ onSaveClicked }
            title={ pageTitle }
            content={ <IntegrationsForm/> }
            onClose={ props.onClose }
            error={ props.error }
            actionButtonDisabled={ isValid }
        />
    );
};

export const IntegrationSaveModal: React.FunctionComponent<IntegrationSaveModalProps> = (props) => {

    const [ initialIntegration ] = React.useState<PartialIntegration>(() => {
        const type = props.initialIntegration?.type ?? IntegrationType.WEBHOOK;
        return {
            ...props.initialIntegration,
            type
        };
    });

    const onSubmit = React.useCallback(async (integration: PartialIntegration) => {
        const onSave = props.onSave;
        const onClose = props.onClose;
        const transformedIntegration = IntegrationSchema.cast(integration) as NewIntegration;
        const saved = await onSave(transformedIntegration);
        if (saved) {
            onClose(true);
        }
    }, [ props.onSave, props.onClose ]);

    return (
        <Formik<PartialIntegration>
            initialValues={ initialIntegration }
            validationSchema={ IntegrationSchema }
            onSubmit={ onSubmit }
        >
            <InternalIntegrationSaveModal
                isEdit={ props.isEdit }
                onClose={ props.onClose }
                error={ props.error }
            />
        </Formik>
    );
};
