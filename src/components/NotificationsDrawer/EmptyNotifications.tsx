import React, { Dispatch, SetStateAction } from 'react';
import {
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import BellSlashIcon from '@patternfly/react-icons/dist/dynamic/icons/bell-slash-icon';
import { Link } from 'react-router-dom';
import { Stack, StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { useLoadModule, useRemoteHook } from '@scalprum/react-core';
import { useFlag } from '@unleash/proxy-client-react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  noNotifications: {
    id: 'notificationsDrawer.empty.noNotifications',
    defaultMessage: 'No notifications found',
  },
  noNotificationsForYou: {
    id: 'notificationsDrawer.empty.noNotificationsForYou',
    defaultMessage: 'There are currently no notifications for you.',
  },
  tryChecking: {
    id: 'notificationsDrawer.empty.tryChecking',
    defaultMessage:
      'Try {preferencesLink} and managing the {configurationLink} for your organization.',
  },
  checkingPreferences: {
    id: 'notificationsDrawer.empty.checkingPreferences',
    defaultMessage: 'checking your notification preferences',
  },
  notificationConfiguration: {
    id: 'notificationsDrawer.empty.notificationConfiguration',
    defaultMessage: 'notification configuration',
  },
  checkPreferences: {
    id: 'notificationsDrawer.empty.checkPreferences',
    defaultMessage: 'Check your Notification Preferences',
  },
  viewEventLog: {
    id: 'notificationsDrawer.empty.viewEventLog',
    defaultMessage: 'View the Event log to see all fired events',
  },
  contactAdmin: {
    id: 'notificationsDrawer.empty.contactAdmin',
    defaultMessage: 'Contact your organization administrator',
  },
  contactAdminVAMessage: {
    id: 'notificationsDrawer.empty.contactAdminVAMessage',
    defaultMessage: 'Contact my org admin.',
  },
});

type ModelsType = {
  VA: string;
};

type VirtualAssistantState = {
  isOpen: boolean;
  currentModel?: string;
  message?: string;
};

/**
 * Sub-component that loads VA modules only when mounted.
 * Extracted so that Scalprum module loading is skipped entirely
 * when the feature flag is disabled (FedRAMP compliance).
 */
export const EmptyNotificationsVAButton = ({ onLinkClick }: { onLinkClick: () => void }) => {
  const intl = useIntl();
  const { hookResult: useVirtualAssistant, loading } = useRemoteHook<
    [VirtualAssistantState, Dispatch<SetStateAction<VirtualAssistantState>>]
  >({
    scope: 'virtualAssistant',
    module: './state/globalState',
    importName: 'useVirtualAssistant',
  });

  const [module] = useLoadModule(
    {
      scope: 'virtualAssistant',
      module: './state/globalState',
      importName: 'Models',
    },
    null
  );

  const Models = module as ModelsType | null;
  const [, setVAState] = useVirtualAssistant || [null, null];
  const isVAAvailable = !loading && !!setVAState && !!Models?.VA;

  const handleContactAdmin = () => {
    if (setVAState && Models?.VA) {
      onLinkClick();
      setVAState({
        isOpen: true,
        currentModel: Models.VA,
        message: intl.formatMessage(messages.contactAdminVAMessage),
      });
    }
  };

  if (!isVAAvailable) {
    return <Content component="p">{intl.formatMessage(messages.contactAdmin)}</Content>;
  }

  return (
    <button
      type="button"
      onClick={handleContactAdmin}
      className="pf-v6-c-button pf-m-link pf-m-inline"
    >
      {intl.formatMessage(messages.contactAdmin)}
    </button>
  );
};

export const EmptyNotifications = ({
  isOrgAdmin,
  onLinkClick,
}: {
  onLinkClick: () => void;
  isOrgAdmin?: boolean;
}) => {
  const isVAEnabled = useFlag('platform.va.environment.enabled');
  const intl = useIntl();

  return (
    <EmptyState
      titleText={
        <Title headingLevel="h4" size="lg">
          {intl.formatMessage(messages.noNotifications)}
        </Title>
      }
      icon={BellSlashIcon}
    >
      <EmptyStateBody>
        {isOrgAdmin ? (
          <Stack>
            <StackItem>
              <Content component="p">{intl.formatMessage(messages.noNotificationsForYou)}</Content>
            </StackItem>
            <StackItem>
              <Content component="p">
                <FormattedMessage
                  {...messages.tryChecking}
                  values={{
                    preferencesLink: (
                      <Link onClick={onLinkClick} to="/settings/notifications/user-preferences">
                        {intl.formatMessage(messages.checkingPreferences)}
                      </Link>
                    ),
                    configurationLink: (
                      <Link onClick={onLinkClick} to="/settings/notifications/configure-events">
                        {intl.formatMessage(messages.notificationConfiguration)}
                      </Link>
                    ),
                  }}
                />
              </Content>
            </StackItem>
          </Stack>
        ) : (
          <>
            <Stack>
              <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
                <Content component="p">
                  {intl.formatMessage(messages.noNotificationsForYou)}
                </Content>
              </StackItem>
              <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
                <Link onClick={onLinkClick} to="/settings/notifications/user-preferences">
                  {intl.formatMessage(messages.checkPreferences)}
                </Link>
              </StackItem>
              <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
                <Link onClick={onLinkClick} to="/settings/notifications/eventlog">
                  {intl.formatMessage(messages.viewEventLog)}
                </Link>
              </StackItem>
              <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
                {isVAEnabled ? (
                  <EmptyNotificationsVAButton onLinkClick={onLinkClick} />
                ) : (
                  <Content component="p">{intl.formatMessage(messages.contactAdmin)}</Content>
                )}
              </StackItem>
            </Stack>
          </>
        )}
      </EmptyStateBody>
    </EmptyState>
  );
};
