import { DeepReadonly } from 'ts-essentials';

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    pages: {
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
    }
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
