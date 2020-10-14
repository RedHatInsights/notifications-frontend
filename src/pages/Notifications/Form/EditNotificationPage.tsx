import * as React from 'react';
import { useContext } from 'react';
import { DefaultNotificationBehavior, IntegrationRef, Notification } from '../../../types/Notification';
import { NotificationSaveModal } from '../../../components/Notifications/SaveModal';
import { IntegrationType } from '../../../types/Integration';
import {
    listIntegrationIntegrationDecoder,
    listIntegrationsActionCreator
} from '../../../services/useListIntegrations';
import { ClientContext } from 'react-fetching-library';
import { Filter, Operator, Page } from '@redhat-cloud-services/insights-common-typescript';

interface EditNotificationPagePropsNotification {
    type: 'notification';
    data: Notification;
}

interface EditNotificationPagePropsDefault {
    type: 'default';
    data: DefaultNotificationBehavior;
}

export type EditNotificationPageProps = {
    onClose: (saved: boolean) => void;
} & (EditNotificationPagePropsNotification | EditNotificationPagePropsDefault);

const recipients = [
    'Admin',
    'Another one',
    'Default user access',
    'Security admin',
    'Stakeholders'
];

const getRecipients = async (search: string) => {
    if (search !== '') {
        search = search.toLowerCase();
        return recipients.filter(r => r.toLowerCase().includes(search));
    }

    return recipients;
};

export const EditNotificationPage: React.FunctionComponent<EditNotificationPageProps> = (props) => {

    const { query } = useContext(ClientContext);

    const getIntegrations = React.useCallback(async (type: IntegrationType, search: string) => {
        return query(listIntegrationsActionCreator(
            Page.of(
                1,
                20,
                new Filter()
                .and('type', Operator.EQUAL, type)
            )
        )).then(response => {
            let integrations: Array<IntegrationRef> = [];
            const payload = response.payload ? listIntegrationIntegrationDecoder(response.payload) : undefined;

            if (payload?.type === 'integrationArray') {
                integrations = payload.value;
            }

            return integrations;
        });
    }, [ query ]);

    return (
        <NotificationSaveModal
            isSaving={ false }
            { ...props }
            getRecipients={ getRecipients }
            getIntegrations={ getIntegrations }
        />
    );
};
