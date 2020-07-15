import { DeepReadonly } from 'ts-essentials';

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    appName: 'Notifications',
    pages: {
        integrations: {
            list: {
                title: 'Integrations'
            },
            add: {
                name: 'Integration name',
                type: 'Type',
                submit: 'Submit',
                cancel: 'Cancel'
            },
            types: {
                hooks: 'Webhook',
                hooksUrl: 'Webhook URL'
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
            }
        }
    },
    common: {
        choose: 'Please choose'
    }
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
