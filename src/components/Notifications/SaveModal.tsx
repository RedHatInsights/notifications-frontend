import * as React from 'react';
import { SaveModal, SaveModalProps } from '@redhat-cloud-services/insights-common-typescript';

import { Formik } from 'formik';
import { NotificationForm } from './Form';
import { DefaultNotificationBehavior, Notification } from '../../types/Notification';
import { IntegrationSchema } from '../../schemas/Integrations/Integration';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onSave';
export type NotificationSaveModalProps = Omit<SaveModalProps, UsedProps> & ({
    type: 'default';
    data: DefaultNotificationBehavior;
} | {
    type: 'notification';
    data: Notification;
})

interface InternalProps {
    onClose: (saved: boolean) => void;
    type: NotificationSaveModalProps['type'];
}

const InternalNotificationSaveModal: React.FunctionComponent<InternalProps> = (props) => {
    const title = props.type === 'default' ? 'Edit default notification actions' : 'Edit notification actions';

    return (
        <SaveModal
            content={ <NotificationForm type={ props.type } /> }
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
        <Formik<Notification | DefaultNotificationBehavior>
            initialValues={ props.data }
            validationSchema={ IntegrationSchema }
            onSubmit={ () => props.onClose(true) }
            validateOnMount={ true }
        >
            <InternalNotificationSaveModal
                type={ props.type }
                onClose={ props.onClose }
            />
        </Formik>
    );
};
