import * as React from 'react';
import { SaveModal, SaveModalProps } from '@redhat-cloud-services/insights-common-typescript';

import { Formik, useFormikContext } from 'formik';
import { NotificationForm } from './Form';
import { DefaultNotificationBehavior, IntegrationRef, Notification } from '../../types/Notification';
import { IntegrationSchema } from '../../schemas/Integrations/Integration';
import { ModalVariant } from '@patternfly/react-core';
import { IntegrationType, NewIntegration } from '../../types/Integration';

type DataFetcher = {
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: IntegrationType, search: string) => Promise<Array<IntegrationRef>>;
}

type UsedProps = 'isOpen' | 'title' | 'content' | 'onSave';
export type NotificationSaveModalProps = Omit<SaveModalProps, UsedProps> & ({
    type: 'default';
    data: DefaultNotificationBehavior;
    onSave: (dnb: DefaultNotificationBehavior) => boolean | Promise<boolean>;
} | {
    type: 'notification';
    data: Notification;
    onSave: (notification: Notification) => boolean | Promise<boolean>;
}) & DataFetcher;

interface InternalProps extends DataFetcher {
    onClose: (saved: boolean) => void;
    type: NotificationSaveModalProps['type'];
}

const InternalNotificationSaveModal: React.FunctionComponent<InternalProps> = (props) => {
    const title =  `Edit${props.type === 'default' && ' default'} notification actions`;

    const { handleSubmit, isValid, isSubmitting } = useFormikContext<NewIntegration>();

    const onSaveClicked = React.useCallback(() => {
        handleSubmit();
        return false;
    }, [ handleSubmit ]);

    return (
        <SaveModal
            content={ <NotificationForm
                type={ props.type }
                getRecipients={ props.getRecipients }
                getIntegrations={ props.getIntegrations }
            /> }
            isSaving={ isSubmitting }
            onSave={ onSaveClicked }
            isOpen={ true }
            title={ title }
            onClose={ props.onClose }
            variant={ ModalVariant.large }
            // actionButtonDisabled={ !isValid }
        />
    );
};

export const NotificationSaveModal: React.FunctionComponent<NotificationSaveModalProps> = (props) => {

    const onSubmit = React.useCallback(async (data: Notification | DefaultNotificationBehavior) => {
        const onSave = props.onSave;
        const onClose = props.onClose;
        // const transformedIntegration = IntegrationSchema.cast(integration) as NewIntegration;
        const saved = await onSave(data as any); // Todo remove this cast
        if (saved) {
            onClose(true);
        }
    }, [ props.onSave, props.onClose ]);

    return (
        <Formik<Notification | DefaultNotificationBehavior>
            initialValues={ props.data }
            // validationSchema={ IntegrationSchema }
            onSubmit={ onSubmit }
            validateOnMount={ true }
        >
            <InternalNotificationSaveModal
                type={ props.type }
                onClose={ props.onClose }
                getRecipients={ props.getRecipients }
                getIntegrations={ props.getIntegrations }
            />
        </Formik>
    );
};
