import * as React from 'react';
import { SaveModal, SaveModalProps } from '@redhat-cloud-services/insights-common-typescript';

import { Formik } from 'formik';
import { NotificationForm } from './Form';
import { DefaultNotificationBehavior, IntegrationRef, Notification } from '../../types/Notification';
import { IntegrationSchema } from '../../schemas/Integrations/Integration';
import { ModalVariant } from '@patternfly/react-core';
import { IntegrationType } from '../../types/Integration';

type DataFetcher = {
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: IntegrationType, search: string) => Promise<Array<IntegrationRef>>;
}

type UsedProps = 'isOpen' | 'title' | 'content' | 'onSave';
export type NotificationSaveModalProps = Omit<SaveModalProps, UsedProps> & ({
    type: 'default';
    data: DefaultNotificationBehavior;
} | {
    type: 'notification';
    data: Notification;
}) & DataFetcher

interface InternalProps extends DataFetcher {
    onClose: (saved: boolean) => void;
    type: NotificationSaveModalProps['type'];
}

const InternalNotificationSaveModal: React.FunctionComponent<InternalProps> = (props) => {
    const title =  `Edit${props.type === 'default' && ' default'} notification actions`;

    return (
        <SaveModal
            content={ <NotificationForm
                type={ props.type }
                getRecipients={ props.getRecipients }
                getIntegrations={ props.getIntegrations }
            /> }
            isSaving={ false }
            onSave={ () => true }
            isOpen={ true }
            title={ title }
            onClose={ props.onClose }
            variant={ ModalVariant.large }
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
                getRecipients={ props.getRecipients }
                getIntegrations={ props.getIntegrations }
            />
        </Formik>
    );
};
