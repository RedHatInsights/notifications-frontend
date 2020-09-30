import * as React from 'react';
import { DefaultNotificationBehavior, IntegrationRef, Notification } from '../../../types/Notification';
import { NotificationSaveModal } from '../../../components/Notifications/SaveModal';
import { IntegrationType } from '../../../types/Integration';

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

const integrations: Array<IntegrationRef> = [
    {
        type: IntegrationType.WEBHOOK,
        id: '0001',
        name: 'Robot'
    },
    {
        type: IntegrationType.WEBHOOK,
        id: '0002',
        name: 'Stuff'
    },
    {
        type: IntegrationType.WEBHOOK,
        id: '0003',
        name: 'Read'
    },
    {
        type: IntegrationType.WEBHOOK,
        id: '0004',
        name: 'Ready'
    },
    {
        type: IntegrationType.WEBHOOK,
        id: '0005',
        name: 'Else'
    },
    {
        type: IntegrationType.WEBHOOK,
        id: '0006',
        name: 'Foo'
    },
    {
        type: IntegrationType.WEBHOOK,
        id: 'integration-00003',
        name: 'Pager duty'
    },
    {
        type: IntegrationType.WEBHOOK,
        id: 'integration-00001',
        name: 'Send stuff over there'
    },
    {
        type: IntegrationType.WEBHOOK,
        id: 'integration-00002',
        name: 'Message to #policies'
    }
];

const getRecipients = (search: string) => {
    if (search !== '') {
        search = search.toLowerCase();
        return recipients.filter(r => r.toLowerCase().includes(search));
    }

    return recipients;
};

const getIntegrations = (type: IntegrationType, search: string) => {
    const typedIntegrations = integrations.filter(i => i.type === type);
    if (search !== '') {
        search = search.toLowerCase();
        return typedIntegrations.filter(i => i.name.toLowerCase().includes(search));
    }

    return typedIntegrations;
};

export const EditNotificationPage: React.FunctionComponent<EditNotificationPageProps> = (props) => {
    return (
        <NotificationSaveModal
            isSaving={ false }
            { ...props }
            getRecipients={ getRecipients }
            getIntegrations={ getIntegrations }
        />
    );
};
