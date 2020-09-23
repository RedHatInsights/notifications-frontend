import * as React from 'react';
import { SaveModal, SaveModalProps } from '@redhat-cloud-services/insights-common-typescript';

import { Formik } from 'formik';
import { NotificationForm } from './Form';
import { Action, Notification } from '../../types/Notification';
import { IntegrationSchema } from '../../schemas/Integrations/Integration';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onSave';
export type NotificationSaveModalProps = Omit<SaveModalProps, UsedProps> & ({
    type: 'default';
    actions: Array<Action>;
} | {
    type: 'notification';
    notification: Notification;
})

interface InternalProps {
    onClose: (saved: boolean) => void;
    isDefault: boolean;
}

const InternalNotificationSaveModal: React.FunctionComponent<InternalProps> = (props) => {
    const title = props.isDefault ? 'Edit default notification actions' : 'Edit notification actions';

    return (
        <SaveModal
            content={ <NotificationForm type={ props.isDefault ? 'default' : 'notification' } /> }
            isSaving={ false }
            onSave={ () => true }
            isOpen={ true }
            title={ title }
            onClose={ props.onClose }
        />
    );
};

export const NotificationSaveModal: React.FunctionComponent<NotificationSaveModalProps> = (props) => {
    return (
        <Formik<Notification | Array<Action>>
            initialValues={ props.type === 'default' ? props.actions : props.notification }
            validationSchema={ IntegrationSchema }
            onSubmit={ () => props.onClose(true) }
            validateOnMount={ true }
        >
            <InternalNotificationSaveModal
                isDefault={ props.type === 'default' }
                onClose={ props.onClose }
            />
        </Formik>
    );
};
