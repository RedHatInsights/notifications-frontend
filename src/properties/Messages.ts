import intlHelper from '@redhat-cloud-services/frontend-components-translations/intlHelper';
import { createIntl, createIntlCache } from 'react-intl';
import { DeepReadonly } from 'ts-essentials';

import messages from './DefinedMessages';

const cache = createIntlCache();
const locale = navigator.language.slice(0, 2);
const intl = createIntl(
  {
    // eslint-disable-next-line no-console
    onError: console.log,
    locale,
  },
  cache
);
const intlSettings = { locale };

const MutableMessages = {
  appName: intlHelper(intl.formatMessage(messages.notifications), intlSettings),
  appNameIntegrations: intlHelper(
    intl.formatMessage(messages.integrations),
    intlSettings
  ),
  pages: {
    integrations: {
      list: {
        title: 'Integrations',
      },
      add: {
        title: 'Add integration',
      },
      edit: {
        title: 'Edit integration',
      },
    },
    splunk: {
      page: {
        title: 'Red Hat Insights integration for Splunk',
        description:
          'To finish the Splunk configuration, follow the instructions to start the automation process.',
        help:
          'Configure the integration between your Splunk instance' +
          ' and Red Hat Insights to allow you to receive events from Insights.',
        helpUrl:
          'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2022/html-single' +
          '/configuring_notifications_and_integrations_on_the_red_hat_hybrid_cloud_console',
      },
    },
    notifications: {
      list: {
        title: 'Notifications',
        viewHistory: 'View event log',
      },
      eventLog: {
        title: 'Event Log',
        subtitle: 'View all events that have occurred in your organization.',
        viewNotifications: 'View notification settings',
      },
      notificationsLog: {
        title: 'Notifications log',
        subtitle:
          'View details for all notifications delivered to my notification drawer.',
      },
    },
    error: {
      title: 'Notifications',
      emptyState: {
        title: 'Unhandled error',
        content: 'There was a problem trying to process your request.',
        showDetails: 'Show details',
        actions: {
          goToIndex: 'Go back',
        },
      },
    },
  },
  components: {
    integrations: {
      toolbar: {
        actions: {
          addIntegration: 'Add integration',
          editIntegration: 'Edit integration',
        },
      },
      table: {
        title: 'Integrations',
        columns: {
          name: 'Name',
          type: 'Type',
          lastConnectionAttempt: 'Last connection attempt',
          enabled: 'Enabled',
        },
      },
      enableError: {
        title: 'Unable to enable the Integration',
        description:
          'There was a problem trying to enable the integration: "{0}".\nPlease try again.',
      },
      disableError: {
        title: 'Unable to disable the Integration',
        description:
          'There was a problem trying to disable the integration: "{0}".\nPlease try again.',
      },
    },
    notifications: {
      toolbar: {
        actions: {},
      },
      table: {
        title: 'Notifications',
        columns: {
          event: 'Event type',
          action: 'Action',
          recipient: 'Recipient',
        },
      },
    },
    eventLog: {
      table: {
        notFound: {
          title: 'No matching events found',
          description:
            'This filter criteria matches no events. Try changing your filter settings.',
        },
      },
    },
  },
  common: {
    choose: 'Please choose',
  },
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
