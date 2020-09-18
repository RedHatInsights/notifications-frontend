import { DeepReadonly } from 'ts-essentials';
import { IntegrationType } from '../types/Integration';

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    appName: 'Notifications',
    appNameIntegrations: 'Integrations',
    pages: {
        integrations: {
            list: {
                title: 'Integrations'
            },
            add: {
                title: 'Add integration'
            },
            edit: {
                title: 'Edit integration'
            }
        },
        notifications: {
            list: {
                title: 'Notifications',
                viewHistory: 'View notification history'
            }
        },
        error: {
            title: 'Notifications',
            emptyState: {
                title: 'Unhandled error',
                content: 'There was a problem trying to process your request.',
                showDetails: 'Show details',
                actions: {
                    goToIndex: 'Go back'
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
                    lastConnectionAttempt: 'Last connection attempt',
                    enabled: 'Enabled'
                }
            },
            enableError: {
                title: 'Unable to enable the Integration',
                description: 'There was a problem trying to enable the integration: "{0}".\nPlease try again.'
            },
            disableError: {
                title: 'Unable to disable the Integration',
                description: 'There was a problem trying to disable the integration: "{0}".\nPlease try again.'
            },
            integrationType: {
                [IntegrationType.WEBHOOK]: 'Webhook'
            }
        },
        notifications: {
            toolbar: {
                actions: {

                }
            },
            table: {
                title: 'Notifications',
                columns: {
                    event: 'Event',
                    action: 'Action',
                    recipient: 'Recipient'
                }
            }
        }
    },
    common: {
        choose: 'Please choose'
    }
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
