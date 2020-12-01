import { ModalVariant } from '@patternfly/react-core';
import { SaveModal, SaveModalProps } from '@redhat-cloud-services/insights-common-typescript';
import { Formik, useFormikContext } from 'formik';
import * as React from 'react';

import { WithActions } from '../../schemas/Integrations/Notifications';
import { UserIntegrationType } from '../../types/Integration';
import { DefaultNotificationBehavior, IntegrationRef, Notification } from '../../types/Notification';
import { NotificationForm } from './Form';

type DataFetcher = {
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
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
    const title =  `Edit${props.type === 'default' && ' default' || ''} notification actions`;

    const { handleSubmit, isValid, isSubmitting } = useFormikContext<Notification | DefaultNotificationBehavior>();

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
            actionButtonDisabled={ !isValid }
        />
    );
};

export const NotificationSaveModal: React.FunctionComponent<NotificationSaveModalProps> = (props) => {

    const onSubmit = React.useCallback(async (data: Notification | DefaultNotificationBehavior) => {
        const onClose = props.onClose;
        let saved = false;
        if (props.type === 'notification') {
            const onSave = props.onSave;
            saved = await onSave(data as Notification);
        } else if (props.type === 'default') {
            const onSave = props.onSave;
            saved = await onSave(data as DefaultNotificationBehavior);
        }

        if (saved) {
            onClose(true);
        }
    }, [ props.onSave, props.onClose, props.type ]);

    return (
        <Formik<Notification | DefaultNotificationBehavior>
            initialValues={ props.data }
            validationSchema={ WithActions }
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
