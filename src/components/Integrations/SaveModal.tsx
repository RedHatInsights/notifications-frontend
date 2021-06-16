import { ActionModalError, SaveModal, SaveModalProps } from '@redhat-cloud-services/insights-common-typescript';
import { Formik, useFormikContext } from 'formik';
import * as React from 'react';

import { Messages } from '../../properties/Messages';
import { IntegrationSchema } from '../../schemas/Integrations/Integration';
import { NewUserIntegration, UserIntegration } from '../../types/Integration';
import { IntegrationsForm } from './Form';

type PartialIntegration = Partial<UserIntegration>;
type UsedProps = 'isOpen' | 'title' | 'content' | 'onSave';

export interface IntegrationSaveModalProps extends Omit<SaveModalProps, UsedProps>{
    initialIntegration?: PartialIntegration;
    onSave: (integration: UserIntegration | NewUserIntegration) => boolean | Promise<boolean>;
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
    const { handleSubmit, isValid, isSubmitting } = useFormikContext<NewUserIntegration>();

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
            content={ <IntegrationsForm /> }
            onClose={ props.onClose }
            error={ props.error }
            actionButtonDisabled={ !isValid }
        />
    );
};

export const IntegrationSaveModal: React.FunctionComponent<IntegrationSaveModalProps> = (props) => {

    const [ initialIntegration ] = React.useState<PartialIntegration>(() => {
        return {
            // The call is twice, because we use lazy evaluation for the integration base type.
            // To ensure we get the defaults on the second level (webhook, slack, etc) we need to call it again
            ...IntegrationSchema.cast(IntegrationSchema.cast({})),
            ...props.initialIntegration
        } as PartialIntegration;
    });

    const onSubmit = React.useCallback(async (integration: PartialIntegration) => {
        const onSave = props.onSave;
        const onClose = props.onClose;
        const transformedIntegration = IntegrationSchema.cast(integration) as NewUserIntegration;
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
            validateOnMount={ true }
        >
            <InternalIntegrationSaveModal
                isEdit={ props.isEdit }
                onClose={ props.onClose }
                error={ props.error }
            />
        </Formik>
    );
};
