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
        message: 'Contact my org admin.',
      });
    }
  };

  if (!isVAAvailable) {
    return <Content component="p">Contact your organization administrator</Content>;
  }

  return (
    <button
      type="button"
      onClick={handleContactAdmin}
      className="pf-v6-c-button pf-m-link pf-m-inline"
    >
      Contact your organization administrator
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

  return (
    <EmptyState
      titleText={
        <Title headingLevel="h4" size="lg">
          No notifications found
        </Title>
      }
      icon={BellSlashIcon}
    >
      <EmptyStateBody>
        {isOrgAdmin ? (
          <Stack>
            <StackItem>
              <Content component="p">There are currently no notifications for you.</Content>
            </StackItem>
            <StackItem>
              <Content component="p">
                Try&nbsp;
                <Link onClick={onLinkClick} to="/settings/notifications/user-preferences">
                  checking your notification preferences
                </Link>
                &nbsp;and managing the&nbsp;
                <Link onClick={onLinkClick} to="/settings/notifications/configure-events">
                  notification configuration
                </Link>
                &nbsp;for your organization.
              </Content>
            </StackItem>
          </Stack>
        ) : (
          <>
            <Stack>
              <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
                <Content component="p">There are currently no notifications for you.</Content>
              </StackItem>
              <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
                <Link onClick={onLinkClick} to="/settings/notifications/user-preferences">
                  Check your Notification Preferences
                </Link>
              </StackItem>
              <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
                <Link onClick={onLinkClick} to="/settings/notifications/notificationslog">
                  View the Event log to see all fired events
                </Link>
              </StackItem>
              <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
                {isVAEnabled ? (
                  <EmptyNotificationsVAButton onLinkClick={onLinkClick} />
                ) : (
                  <Content component="p">Contact your organization administrator</Content>
                )}
              </StackItem>
            </Stack>
          </>
        )}
      </EmptyStateBody>
    </EmptyState>
  );
};
