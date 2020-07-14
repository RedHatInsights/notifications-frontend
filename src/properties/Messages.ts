import { DeepReadonly } from 'ts-essentials';

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    appName: 'Notifications',
    pages: {
        integrations: {
            list: {
                title: 'Integrations'
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
                    addIntegration: 'Add integration'
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
    }
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
