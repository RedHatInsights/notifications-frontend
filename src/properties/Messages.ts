import { DeepReadonly } from 'ts-essentials';
import { IntegrationType } from '../types/Integration';

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    appName: 'Notifications',
    pages: {
        integrations: {
            list: {
                title: 'Integrations'
            },
            add: {
                title: 'Add Integration'
            },
            edit: {
                title: 'Edit Integration'
            },
            types: {
                hooks: 'Webhook',
                hooksUrl: 'Webhook URL'
            }
        },
        notifications: {
            list: {
                title: 'Notifications'
            }
        },
        error: {
            title: 'Notifications',
            emptyState: {
                title: 'Unhandled error',
                content: 'There was a problem trying to process your request.',
                showDetails: 'Show details',
                actions: {
                    goToIndex: 'Go to Policy list'
                }
            }
        }
    },
    components: {
        integrations: {
            toolbar: {
                actions: {
                    addIntegration: 'Add integration',
                    editIntegration: 'Edit integration'
                }
            },
            table: {
                title: 'Integrations',
                columns: {
                    name: 'Name',
                    type: 'Type',
                    enabled: 'Enabled'
                }
            },
            integrationType: {
                [IntegrationType.WEBHOOK]: 'Webhook'
            }
        }
    },
    common: {
        choose: 'Please choose'
    }
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
