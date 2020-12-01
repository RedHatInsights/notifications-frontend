import { createIntl, createIntlCache } from 'react-intl';

import { DeepReadonly } from 'ts-essentials';
import { IntegrationType } from '../types/Integration';
import { intlHelper } from '@redhat-cloud-services/frontend-components-translations';
import messages from './DefinedMessages';

const cache = createIntlCache();
const locale = navigator.language.slice(0, 2);
const intl = createIntl({
    // eslint-disable-next-line no-console
    onError: console.log,
    locale
}, cache);
const intlSettings = { locale };

const MutableMessages = {
    appName: intlHelper(intl.formatMessage(messages.notifications), intlSettings),
    appNameIntegrations: intlHelper(intl.formatMessage(messages.integrations), intlSettings),
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
            types: {
                EMAIL_SUBSCRIPTION: 'Send email',
                DRAWER: 'Send to notification drawer',
                INTEGRATION: 'Integration',
                PLATFORM_ALERT: 'Platform alert'
            },
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
