import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import BellSlashIcon from '@patternfly/react-icons/dist/dynamic/icons/bell-slash-icon';
import { Link } from 'react-router-dom';
import {
  Stack,
  StackItem,
} from '@patternfly/react-core/dist/dynamic/layouts/Stack';

export const EmptyNotifications = ({
  isOrgAdmin,
  onLinkClick,
}: {
  onLinkClick: () => void;
  isOrgAdmin?: boolean;
}) => (
  <EmptyState>
    <EmptyStateIcon icon={BellSlashIcon} />
    <Title headingLevel="h4" size="lg">
      No notifications found
    </Title>
    <EmptyStateBody>
      {isOrgAdmin ? (
        <Stack>
          <StackItem>
            <Text>There are currently no notifications for you.</Text>
          </StackItem>
          <StackItem>
            <Text>
              Try&nbsp;
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/user-preferences"
              >
                checking your notification preferences
              </Link>
              &nbsp;and managing the&nbsp;
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/configure-events"
              >
                notification configuration
              </Link>
              &nbsp;for your organization.
            </Text>
          </StackItem>
        </Stack>
      ) : (
        <>
          <Stack>
            <StackItem className="pf-v5-u-pl-lg pf-v5-u-pb-sm">
              <Text>There are currently no notifications for you.</Text>
            </StackItem>
            <StackItem className="pf-v5-u-pl-lg pf-v5-u-pb-sm">
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/user-preferences"
              >
                Check your Notification Preferences
              </Link>
            </StackItem>
            <StackItem className="pf-v5-u-pl-lg pf-v5-u-pb-sm">
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/notificationslog"
              >
                View the Event log to see all fired events
              </Link>
            </StackItem>
            <StackItem className="pf-v5-u-pl-lg pf-v5-u-pb-sm">
              <Text>Contact your organization administrator</Text>
            </StackItem>
          </Stack>
        </>
      )}
    </EmptyStateBody>
  </EmptyState>
);
